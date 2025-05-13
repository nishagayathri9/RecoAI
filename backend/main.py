# backend/main.py

import os
import torch
from fastapi import FastAPI
from pydantic import BaseModel, validator
from backend.model import DeepFM

# ─── These values MUST match exactly what you trained with ────────────────────
NUM_USERS  = 15264     # you had 15265 embedding rows, so n_users = 15265−1
NUM_ITEMS  = 28638     # you had 28639 embedding rows, so n_items = 28639−1
EMB_DIM    = 16        # your CF embedding dimension
META_DIM   = 1546      # 10 structured feats + 768 text emb + 768 feature emb
HIDDEN_DIM = 64        # your content hidden size
# ──────────────────────────────────────────────────────────────────────────────

app = FastAPI(title="RecoAI")

# We’ll store the loaded model here
MODEL: DeepFM

@app.on_event("startup")
def load_model():
    global MODEL
    # 1) instantiate with the same dims
    MODEL = DeepFM(
        n_users=NUM_USERS,
        n_items=NUM_ITEMS,
        emb_dim=EMB_DIM,
        meta_dim=META_DIM,
        hidden_dim=HIDDEN_DIM
    )
    # 2) load the state_dict
    ckpt = os.path.join(os.path.dirname(__file__), "models", "deepfm_model.pth")
    state = torch.load(ckpt, map_location="cpu")
    MODEL.load_state_dict(state)
    MODEL.eval()
    print(f"✅ Loaded model from {ckpt}")

class RecRequest(BaseModel):
    u_idx: int
    i_idx: int
    meta: list[float]   # length must == META_DIM

    @validator('meta')
    def check_meta_length(cls, v):
        if len(v) != META_DIM:
            raise ValueError(f"meta must have length {META_DIM}, got {len(v)}")
        return v

@app.post("/predict/")
def predict(req: RecRequest):
    # create a batch of size 1
    u = torch.tensor([req.u_idx], dtype=torch.long)
    i = torch.tensor([req.i_idx], dtype=torch.long)
    m = torch.tensor([req.meta], dtype=torch.float32)

    with torch.no_grad():
        out = MODEL(u, i, m)
        # your DIEN-style model returns (score, aux); unpack if tuple
        if isinstance(out, tuple):
            score, _ = out
        else:
            score = out
    return {"score": float(score.item())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
