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

class RecommendRequest(BaseModel):
    cold_start_ids: Optional[List[int]] = None
    users_per_cat: int = 25
    top_k: int = 5       


# ─── Group Recommendation Endpoint ─────────────────────────────────────────
@app.post("/group_recommend/")
async def group_recommend(req: RecommendRequest):
    """
    Runs the GroupRecommender on the uploaded DataFrame and returns
    each user's past history + category‐based top-K recs.
    """
    # 1) Check that data is loaded
    if RAW_DF is None:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            {
                "detail": "No data uploaded",
                "message": "Please POST to /upload/ first"
            }
        )

    # 2) Validate request parameters
    if req.top_k < 1:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            {
                "detail": "`top_k` must be at least 1",
                "received": req.top_k
            }
        )
    if req.users_per_cat < 1:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            {
                "detail": "`users_per_cat` must be at least 1",
                "received": req.users_per_cat
            }
        )

    # 3) Attempt recommendation
    try:
        recommender = GroupRecommender(RAW_DF)
        result = recommender.recommend(
            cold_start_ids=req.cold_start_ids,
            users_per_cat=req.users_per_cat,
            top_k=req.top_k
                )
    except KeyError as e:
        # e.g. missing expected column in RAW_DF
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            {
                "detail": "Data format error",
                "missing_column": str(e)
            }
        )
    except Exception as e:
        # catch-all for unexpected errors
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            {
                "detail": "Recommendation generation failed",
                "error": str(e)
            }
        )

    # 4) Return success payload
    return {
        "message": "Recommendations generated successfully",
        "cold_ids": result["cold_ids"],
        "results": result["results"]
    }
#get to output the results