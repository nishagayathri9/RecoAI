# backend/api.py
# ───────────────────────────────────────────────────────────────
# FastAPI wrapper for RecoAI  ▸  preprocess  ▸  fine-tune
# ───────────────────────────────────────────────────────────────
from __future__ import annotations

import os, uuid, tempfile, copy
from pathlib import Path
from typing import List, Dict, Optional

import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from backend.preprocessing import Preprocessing
from backend.model import HybridDeepFM
from backend.core_models import BASE_MODEL, CKPT          # CKPT: pre-trained state_dict

# ─────────────────────────── Hyper-params ───────────────────────────
MAX_SEQ_LEN   = 50
EMB_DIM       = 64
HIDDEN_DIM    = 96
AUX_WEIGHT    = 0.65
BATCH_SIZE    = 512
LR_DEFAULT    = 3e-5
EPOCHS_DEFAULT= 30

META_COLS = ["price_scaled", "sentiment",
             "category_encoded", "color_encoded", "material_encoded"]

# ─────────────────────────── Helpers ────────────────────────────────
EMB_DIM = 64      # keep in sync with your text encoder

def build_meta_matrix(df: pd.DataFrame,
                      emb: Dict[str, np.ndarray],
                      struct_cols: List[str]) -> np.ndarray:
    """
    Stack [structured | review_emb | feature_emb | title_emb]
    • Missing structured cols → zeros
    • Missing embedding keys → zeros
    """
    parts: List[np.ndarray] = []

    # structured features
    for col in struct_cols:
        if col in df.columns:
            parts.append(df[[col]].values.astype("float32"))
        else:
            print(f"⚠️ '{col}' missing → zeros")
            parts.append(np.zeros((len(df), 1), dtype="float32"))

    # text / dense embeddings
    for name in ("review", "features", "product_title"):
        if name in emb:
            parts.append(emb[name].astype("float32"))
        else:
            print(f"⚠️ '{name}' embedding missing → zeros")
            parts.append(np.zeros((len(df), EMB_DIM), dtype="float32"))

    return np.hstack(parts)

class RecommenderDataset(Dataset):
    def __init__(self, df, meta, labels):
        self.u_idx = torch.tensor(df["u_idx"].values, dtype=torch.long)
        self.i_idx = torch.tensor(df["i_idx"].values, dtype=torch.long)
        self.seq   = torch.tensor(np.vstack(df["seq"].values), dtype=torch.long)
        self.meta  = torch.tensor(meta, dtype=torch.float32)
        self.y     = torch.tensor(labels, dtype=torch.float32)

    def __len__(self): return len(self.y)
    def __getitem__(self, i):
        return {"u_idx": self.u_idx[i], "i_idx": self.i_idx[i],
                "seq": self.seq[i],     "meta":  self.meta[i]}, self.y[i]

def safe_load_pretrained(model: HybridDeepFM,
                         state: dict,
                         skip_embeddings: bool = True):
    ms = model.state_dict(); ok, skip = {}, []
    for k, v in state.items():
        if k not in ms:                               skip.append(k); continue
        if skip_embeddings and any(t in k for t in
              ["user_emb", "item_emb", "user_bias", "item_bias"]):
                                                     skip.append(k); continue
        if ms[k].shape != v.shape:                   skip.append(k); continue
        ok[k] = v
    model.load_state_dict({**ms, **ok})
    print(f"✓ loaded {len(ok)} layers – skipped {len(skip)}")

# ─────────────────────────── FastAPI app ────────────────────────────
app = FastAPI(title="RecoAI Preprocess + Fine-Tune API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["GET","POST"], allow_headers=["*"])

@app.on_event("startup")
async def _init():
    app.state.raw_df          = None   # raw upload
    app.state.df_processed    = None   # cleaned DF
    app.state.embeddings      = None   # dict of np arrays
    app.state.ft_models       = {}

# ─────────────────────────── Routes ────────────────────────────────
@app.get("/healthz", tags=["meta"])
async def healthz(): return {"status": "ok"}

# ---------------- upload ----------------
@app.post("/upload", tags=["data"])
async def upload(data_file: UploadFile = File(...)):
    if not data_file.filename.endswith(".csv"):
        raise HTTPException(400, "only .csv accepted")
    try:  df = pd.read_csv(data_file.file)
    except Exception as e:
        raise HTTPException(400, f"CSV read error: {e}")
    app.state.raw_df = df

    REQUIRED_CORE = {"user_id", "product_id", "click"}   # everything else optional
    missing = REQUIRED_CORE - set(df.columns)
    if missing:
        raise HTTPException(400, f"Dataset missing required columns: {missing}")

    return {"rows": len(df), "cols": list(df.columns)}



# -------------- preprocess --------------
def _cleanup(path: Path):
    try: path.unlink(missing_ok=True); path.parent.rmdir()
    except Exception: pass

@app.post("/preprocess", tags=["data"])
async def preprocess():
    """Clean the uploaded CSV and cache the result for fine-tuning."""
    df = app.state.raw_df
    if df is None:
        raise HTTPException(400, "Upload a dataset first with /upload")

    pp = Preprocessing(df)
    processed_df, emb_list = pp.run()         # no on-disk CSV

    # Cache for the fine-tune step
    app.state.df_processed = processed_df
    app.state.embeddings   = dict(emb_list)

    return {
        "detail": "preprocess complete",
        "rows":   len(processed_df),
        "cols":   list(processed_df.columns)
    }

# -------------- fine-tune ----------------

EPOCHS_FIXED = 20
LR_FIXED     = 3e-5

@app.post("/fine_tune", tags=["training"])
async def fine_tune(bt: BackgroundTasks):
    """Background fine-tune using 20 epochs, lr=3e-5 (no overrides)."""
    if any(x is None for x in [app.state.df_processed, app.state.embeddings]):
        raise HTTPException(400, "Run /preprocess first")

    job_id = uuid.uuid4().hex

    def _job():
        df   = app.state.df_processed
        emb  = app.state.embeddings

        # ----- dataset prep ------------------------------------------------
        BASE_STRUCT = ["price_scaled", "sentiment",
               "category_encoded", "color_encoded", "material_encoded"]

        struct_cols = [c for c in BASE_STRUCT if c in df.columns]
        X_meta      = build_meta_matrix(df, emb, struct_cols)

        y      = df["click"].values
        dft, dfv, yt, yv, Xm_t, Xm_v = train_test_split(
            df, y, X_meta, test_size=0.2, random_state=42
        )
        tr_ds, vl_ds = RecommenderDataset(dft, Xm_t, yt), RecommenderDataset(dfv, Xm_v, yv)
        weights = 1.0 / np.bincount(yt)
        sampler = WeightedRandomSampler(weights[yt], len(yt), replacement=True)
        tl, vl  = DataLoader(tr_ds, BATCH_SIZE, sampler=sampler), DataLoader(vl_ds, BATCH_SIZE)

        # ----- model -------------------------------------------------------
        model = copy.deepcopy(BASE_MODEL)
        for p in model.cf.parameters(): p.requires_grad = False
        safe_load_pretrained(model, CKPT, skip_embeddings=True)

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model.to(device)
        opt  = torch.optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=LR_FIXED)
        crit = torch.nn.BCEWithLogitsLoss()

        best_auc, best_state = 0.0, None
        for ep in range(EPOCHS_FIXED):
            model.train(); running = 0.0
            for bx, yb in tl:
                bx = {k: v.to(device) for k, v in bx.items()}
                yb = yb.to(device)
                opt.zero_grad()
                logits, aux = model(bx)
                loss = crit(logits, yb) + AUX_WEIGHT * crit(aux, yb)
                loss.backward(); opt.step(); running += loss.item()

            # quick val
            model.eval(); yt, yp = [], []
            with torch.no_grad():
                for bx, yb in vl:
                    bx = {k: v.to(device) for k, v in bx.items()}
                    preds, _ = model(bx)
                    yt.extend(yb.numpy())
                    yp.extend(torch.sigmoid(preds).cpu().numpy())
            auc = roc_auc_score(yt, yp)
            print(f"[{job_id}] ep {ep+1}/20 loss {running/len(tl):.4f}  auc {auc:.4f}")
            if auc > best_auc:
                best_auc, best_state = auc, model.state_dict()

        # keep best weights, switch to eval, store in RAM
        model.load_state_dict(best_state or model.state_dict())
        model.eval()
        app.state.ft_models[job_id] = model
        print(f"[{job_id}] fine-tune complete (best AUC={best_auc:.4f})")

    bt.add_task(_job)
    return {"job_id": job_id, "status": "running"}

# ─────────────────────────── Local run ─────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api:app", host="0.0.0.0",
                port=int(os.getenv("PORT", 8080)), reload=True)
