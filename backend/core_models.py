# backend/core_models.py  – load once
import torch, nltk
from sentence_transformers import SentenceTransformer
from nltk.sentiment import SentimentIntensityAnalyzer
from backend.model import HybridDeepFM
from pathlib import Path    

nltk.download("vader_lexicon")

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
EMBEDDER = SentenceTransformer("all-mpnet-base-v2", device=DEVICE)
SENTIMENT = SentimentIntensityAnalyzer()

HERE = Path(__file__).resolve().parent   # …/backend
CKPT_PATH = HERE / "new_dien.pth"        # …/backend/new_dien.pth

# --- derive dims from checkpoint ---
ckpt = torch.load(CKPT_PATH, map_location="cpu")

n_users   = ckpt["cf.user_emb.weight"].shape[0]
n_items   = ckpt["cf.item_emb.weight"].shape[0] - 1
meta_dim  = ckpt["cb.fc.0.weight"].shape[1]
emb_dim   = ckpt["cf.user_emb.weight"].shape[1]
hidden_dim= ckpt["cb.fc.0.weight"].shape[0]
seq_len   = 50   # set manually if you changed it

model = HybridDeepFM(
    n_users, n_items, emb_dim, meta_dim, hidden_dim, seq_len
).to(DEVICE)

# (Optional) rename keys if you changed the layer name
if "cf.final_layer.weight" in ckpt:
    ckpt["cf.aux_linear.weight"] = ckpt.pop("cf.final_layer.weight")
    ckpt["cf.aux_linear.bias"]   = ckpt.pop("cf.final_layer.bias")

model.load_state_dict(ckpt, strict=False)
model.eval()

BASE_MODEL = model
CKPT       = ckpt