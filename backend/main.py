import os
import torch
import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException, status 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from typing import List, Optional
from backend.recommender import GroupRecommender

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


FEATURES = {
    'user_id',
    'product_id',
    'product_title',
    'category',
    'features',
    'rating',
    'sentiment',
    'u_idx',
    'i_idx',
    'seq',
    'price_scaled',
    'category_encoded',
    'color_encoded',
    'material_encoded'
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
    if FEATURES is None:
        raise HTTPException(503, "No metadata uploaded yet; please POST to /upload/ first")
    return {
        FEATURES
    }

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

class PredictRequest(BaseModel):
    u_idx: 5
    i_idx: 6

# Example predict functions without any recommender attached

@app.post("/predict/simple/", summary="Simple predict")
def predict_simple(req: PredictRequest):
    # just compute a linear combination
    score = req.u_idx * 0.1 + req.i_idx * 0.05
    return score
