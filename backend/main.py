# backend/main.py

#new backend
import os
import torch
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.model import HybridDeepFM
from typing import List, Optional
from backend.top_k import hybrid_topk_recommendation
from backend.preprocessing import RecommenderDataModule, Preprocessing



# ─── Model hyperparams ─────────────────────────────────────────────────────
EMB_DIM, META_DIM, HIDDEN_DIM = 64, 2314, 96
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
    MODEL.eval()
    print(f"\u2705 Loaded model from {ckpt}")

# ─── Upload Metadata Endpoint ──────────────────────────────────────────────

FEATURES = {
    'price_scaled',
    'sentiment',
    'color_encoded',
    'material_encoded',
    'user_id',
    'product_id',
    'rating',
    'product_title'
}



# ─── Data Preprocessing ─────────────────────────────────────────────────

@app.post("/upload/")
async def upload(data_file: UploadFile = File(...)):
    # 1) Read CSV
    global RAW_DF
    try:
        df = pd.read_csv(data_file.file)
    except Exception as e:
        raise HTTPException(400, f"Could not read CSV: {e}")

    # 2) Check for missing features
    actual = set(df.columns)
    missing = FEATURES - actual
    if missing:
        raise HTTPException(
            400,
            {
                "detail": "Missing required features",
                "missing_features": sorted(missing),
                "required_features": sorted(FEATURES)
            }
        )
    
    RAW_DF = df
    # 3) All required columns are there—return success with the list
    return {
        "detail": "All required features present",
        "features": sorted(actual)
    }

# ─── Data Preprocessing ─────────────────────────────────────────────────
@app.post("/preprocess/")
async def preprocess():
    """
    Placeholder for your real preprocessing logic.
    It will get handed the raw DataFrame you just uploaded.
    """
    global DF_TEST
    global X_TEST_META

    if RAW_DF is None: 
        raise HTTPException(400, "No data uploaded yet; call /upload/ first")

    # TODO: your real preprocessing steps here
    pre = Preprocessing(RAW_DF)
    df_processed, embeddings_list = pre.run()
    
    if df_processed is None or df_processed.empty:
        raise HTTPException(500, "Preprocessing returned an empty DataFrame")
    if not isinstance(embeddings_list, list) or len(embeddings_list) == 0:
        raise HTTPException(500, "Preprocessing returned no embeddings")

    # 2) Split & load
    data_module = RecommenderDataModule(
        df           = df_processed,
        embeddings_list = [emb for key, emb in embeddings_list],
        batch_size   = 512
    )

    data_module.setup()
    train_loader, val_loader, test_loader = data_module.get_loaders()
    df_test, X_test_meta = data_module.get_test_split()
    
    DF_TEST  = df_test
    X_TEST_META =  X_test_meta
    return {
        "detail": "Data is Preprocessed",
        "original_shape": RAW_DF.shape,
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

# ─── Top K ───────────────────────────────────────────────────

DF_INTERACTIONS = None
META_MATRIX = None
ITEM_TITLE_MAP = None
ITEM_EMBEDDINGS = None


DF_INTERACTIONS = DF_TEST
META_MATRIX = X_TEST_META
ITEM_TITLE_MAP = dict(zip(DF_INTERACTIONS['product_id'], DF_INTERACTIONS['product_title']))
with torch.no_grad():
    ITEM_EMBEDDINGS = MODEL.cf.item_emb.weight.detach().cpu().numpy()


@app.get("/interpret/")
def interpret(
    u_idx: int = Query(..., description="User ID to interpret recommendations for"),
    k: int = Query(10, gt=0, description="Number of top items to return"),
    top_n_users: int = Query(10, gt=0, description="Number of similar users to consider for CF-KNN")
):
  
    if any(x is None for x in [MODEL, DF_INTERACTIONS, META_MATRIX, ITEM_TITLE_MAP, ITEM_EMBEDDINGS]):
        raise HTTPException(503, "Model or metadata not loaded. Please call /load_full and /retrain first.")
    
    if u_idx not in DF_INTERACTIONS['u_idx'].values:
        raise HTTPException(400, f"User ID {u_idx} not found in dataset.")

  
    user_purchases_df = DF_INTERACTIONS[DF_INTERACTIONS['u_idx'] == u_idx]
    user_history = dict(zip(user_purchases_df['product_id'], user_purchases_df['product_title']))


    recs = hybrid_topk_recommendation(
        model=MODEL,
        user_id=u_idx,
        df=DF_INTERACTIONS,
        meta_features_all=META_MATRIX,
        product_title_map=ITEM_TITLE_MAP,
        item_embeddings=ITEM_EMBEDDINGS,
        deepfm_weight=0.8,
        knn_weight=0.2,
        top_n_users=top_n_users,    
        top_k_items=k
    )

    return {
        "user_id": u_idx,
        "top_k": k,
        "top_n_users": top_n_users,
        "recommendations": recs,
        "user_history": user_history  
    }



# ─── Run Server ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
