# backend/main.py

import os
import torch
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.model import DeepFM
from typing import List, Optional
from backend.top_k import topK

# ─── Model hyperparams (must match training) ────────────────────────────────
NUM_USERS, NUM_ITEMS = 15264, 28638
EMB_DIM, META_DIM, HIDDEN_DIM = 16, 1546, 64

# ────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="RecoAI",
    version="0.1.2",    # ←  API version here
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local dev
        "https://reco-ai-fyp.vercel.app",  # Vercel front-end
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Globals (populated by /upload/)
MODEL: DeepFM
USER_META: Optional[dict[int, List[float]]] = None
ITEM_META: Optional[dict[int, List[float]]] = None

@app.on_event("startup")
def load_model():
    global MODEL
    MODEL = DeepFM(
        n_users=NUM_USERS,
        n_items=NUM_ITEMS,
        emb_dim=EMB_DIM,
        meta_dim=META_DIM,
        hidden_dim=HIDDEN_DIM, 
        seq_len=MAX_SEQ_LEN
    )
    ckpt = os.path.join(os.path.dirname(__file__), "dien_deepfm_model_final.pth")
    if not os.path.isfile(ckpt):
        raise FileNotFoundError(f"Model checkpoint not found at {ckpt}")
    MODEL.load_state_dict(torch.load(ckpt, map_location="cpu"))
    MODEL.eval()
    print(f"✅ Loaded model from {ckpt}")

@app.post(
    "/upload/",
    summary="Upload user & item CSVs",
    description="Send two CSV files (user_file+item_file) with columns ['id', feat1, feat2, …].\n"
                "user_file must have user IDs 0…NUM_USERS; item_file must have item IDs 0…NUM_ITEMS.\n"
                "Total columns (excluding 'id') across both files must == META_DIM.",
    responses={
        200: {"description": "Metadata uploaded successfully"},
        400: {"description": "Bad CSV format or feature mismatch"},
        422: {"description": "No files provided"},
        500: {"description": "Internal parsing error"}
    }
)
async def upload(
    user_file: UploadFile = File(..., description="CSV of user features"),
    item_file: UploadFile = File(..., description="CSV of item features")
):
    global USER_META, ITEM_META

    # 1) Read into pandas
    try:
        u_df = pd.read_csv(user_file.file).set_index("id")
        i_df = pd.read_csv(item_file.file).set_index("id")
    except Exception as e:
        raise HTTPException(400, f"Could not read CSVs: {e}")

    # 2) Validate shapes
    u_feats = u_df.shape[1]
    i_feats = i_df.shape[1]
    if u_feats + i_feats != META_DIM:
        raise HTTPException(
            400,
            f"Feature dim mismatch: user has {u_feats}, item has {i_feats}, total must be {META_DIM}"
        )
    # 3) Build lookup dicts
    try:
        USER_META = u_df.astype(float).T.to_dict(orient="list")
        ITEM_META = i_df.astype(float).T.to_dict(orient="list")
    except Exception as e:
        raise HTTPException(500, f"Error building lookup tables: {e}")

    return {
        "detail": "Metadata uploaded successfully",
        "num_users": len(USER_META),
        "num_items": len(ITEM_META),
        "meta_dim": META_DIM
    }

@app.get(
    "/metadata/",
    summary="Get metadata loading status",
    responses={
        200: {"description": "Metadata status"},
        503: {"description": "Metadata not uploaded yet"}
    }
)
def get_metadata():
    """
    Returns whether user/item tables are loaded, and if so:
      - num_users: how many user rows uploaded
      - num_items: how many item rows uploaded
      - meta_dim: total feature length (u_feats + i_feats)
    """
    if USER_META is None or ITEM_META is None:
        raise HTTPException(503, "No metadata uploaded yet; please POST to /upload/ first")
    return {
        "num_users": len(USER_META),
        "num_items": len(ITEM_META),
        "meta_dim": META_DIM
    }

class PredictRequest(BaseModel):
    u_idx: int
    i_idx: int

@app.post(
    "/predict/",
    tags=["inference"],
    summary="Run a recommendation prediction",
    responses={
        200: {"description": "Successful prediction", "content":{"application/json":{"example":{"score":0.123}}}},
        400: {"description": "Metadata missing or invalid indices"},
        503: {"description": "Service not ready (no metadata uploaded)"},
        500: {"description": "Internal inference error"}
    }
)
def predict(req: PredictRequest):
    # 1) Ensure metadata is present
    if USER_META is None or ITEM_META is None:
        raise HTTPException(503, "Please upload user and item CSVs first via POST /upload/")

    # 2) Look up feature vectors
    if req.u_idx not in USER_META:
        raise HTTPException(400, f"user ID {req.u_idx} not found in uploaded data")
    if req.i_idx not in ITEM_META:
        raise HTTPException(400, f"item ID {req.i_idx} not found in uploaded data")

    meta = USER_META[req.u_idx] + ITEM_META[req.i_idx]
    if len(meta) != META_DIM:
        raise HTTPException(500, f"Internal error: combined meta length {len(meta)} != {META_DIM}")

    # 3) Run the model
    try:
        u = torch.tensor([req.u_idx], dtype=torch.long)
        i = torch.tensor([req.i_idx], dtype=torch.long)
        m = torch.tensor([meta], dtype=torch.float32)
        with torch.no_grad():
            out = MODEL(u, i, m)
            score = out[0] if isinstance(out, tuple) else out
        return {"score": float(score.item())}
    except Exception as e:
        raise HTTPException(500, f"Inference failed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)



#nitya_ask_gpt

import os
import torch
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.model import HybridDeepFM, safe_load_pretrained
from typing import List, Optional

# ─── Model hyperparams ─────────────────────────────────────────────────────
EMB_DIM, META_DIM, HIDDEN_DIM = 16, 1546, 64
MAX_SEQ_LEN = 50

# ─── FastAPI App Config ────────────────────────────────────────────────────
app = FastAPI(
    title="RecoAI",
    version="0.1.2"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://reco-ai-fyp.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Globals ───────────────────────────────────────────────────────────────
MODEL: HybridDeepFM = None
USER_META: Optional[dict[int, List[float]]] = None
ITEM_META: Optional[dict[int, List[float]]] = None
NUM_USERS = NUM_ITEMS = 0

# ─── Load Model Dynamically ────────────────────────────────────────────────
def load_model():
    global MODEL
    MODEL = HybridDeepFM(
        n_users=NUM_USERS or 1,
        n_items=NUM_ITEMS or 1,
        emb_dim=EMB_DIM,
        meta_dim=META_DIM,
        hidden_dim=HIDDEN_DIM,
        seq_len=MAX_SEQ_LEN
    )
    ckpt = os.path.join(os.path.dirname(__file__), "dien_deepfm_model_final.pth")
    if not os.path.isfile(ckpt):
        raise FileNotFoundError(f"Model checkpoint not found at {ckpt}")
    pretrained = torch.load(ckpt, map_location="cpu")
    safe_load_pretrained(MODEL, pretrained, skip_embeddings=True)
    MODEL.eval()
    print(f"\u2705 Loaded model from {ckpt}")

# ─── Upload Metadata Endpoint ──────────────────────────────────────────────
@app.post("/upload/")
async def upload(
    user_file: UploadFile = File(...),
    item_file: UploadFile = File(...)
):
    global USER_META, ITEM_META, NUM_USERS, NUM_ITEMS

    try:
        u_df = pd.read_csv(user_file.file).set_index("id")
        i_df = pd.read_csv(item_file.file).set_index("id")
    except Exception as e:
        raise HTTPException(400, f"Could not read CSVs: {e}")

    u_feats = u_df.shape[1]
    i_feats = i_df.shape[1]
    if u_feats + i_feats != META_DIM:
        raise HTTPException(400, f"Feature dim mismatch: user {u_feats} + item {i_feats} != {META_DIM}")

    try:
        USER_META = u_df.astype(float).T.to_dict(orient="list")
        ITEM_META = i_df.astype(float).T.to_dict(orient="list")
        NUM_USERS = u_df.index.max() + 1
        NUM_ITEMS = i_df.index.max() + 1
        load_model()
    except Exception as e:
        raise HTTPException(500, f"Error processing metadata: {e}")

    return {
        "detail": "Metadata uploaded successfully",
        "num_users": len(USER_META),
        "num_items": len(ITEM_META),
        "meta_dim": META_DIM
    }

# ─── Metadata Status Check ─────────────────────────────────────────────────
@app.get("/metadata/")
def get_metadata():
    if USER_META is None or ITEM_META is None:
        raise HTTPException(503, "No metadata uploaded yet; POST to /upload/")
    return {
        "num_users": len(USER_META),
        "num_items": len(ITEM_META),
        "meta_dim": META_DIM
    }

# ─── Prediction Endpoint ───────────────────────────────────────────────────
class PredictRequest(BaseModel):
    u_idx: int
    i_idx: int
    seq: List[int]

@app.post("/predict/")
def predict(req: PredictRequest):
    if USER_META is None or ITEM_META is None:
        raise HTTPException(503, "Upload metadata first")

    if req.u_idx not in USER_META:
        raise HTTPException(400, f"User ID {req.u_idx} not found")
    if req.i_idx not in ITEM_META:
        raise HTTPException(400, f"Item ID {req.i_idx} not found")

    meta = USER_META[req.u_idx] + ITEM_META[req.i_idx]
    if len(meta) != META_DIM:
        raise HTTPException(500, f"Combined meta dim {len(meta)} != {META_DIM}")

    model_input = {
        "u_idx": torch.tensor([req.u_idx], dtype=torch.long),
        "i_idx": torch.tensor([req.i_idx], dtype=torch.long),
        "seq": torch.tensor([req.seq], dtype=torch.long),
        "meta": torch.tensor([meta], dtype=torch.float32)
    }

    try:
        with torch.no_grad():
            out, _ = MODEL(model_input)
            score = torch.sigmoid(out).item()
        return {"score": score}
    except Exception as e:
        raise HTTPException(500, f"Inference failed: {e}")

# ─── Run Server ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
