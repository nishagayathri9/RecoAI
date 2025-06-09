# backend/preprocessing.py

import pandas as pd
import numpy as np
import re
from sklearn.preprocessing import StandardScaler, LabelEncoder
from fuzzywuzzy import process
from sklearn.model_selection import train_test_split
import torch
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
from typing import Dict, List, Optional

# Global, shared model objects
from backend.core_models import EMBEDDER, SENTIMENT

# --------------------------------------------------------------------------- #
#                               Preprocessing                                 #
# --------------------------------------------------------------------------- #

class Preprocessing:
    """
    Cleans a DataFrame, engineers features, and persists embeddings/CSV.
    Heavy models are injected so they aren’t re-instantiated per request.
    """

    def __init__(
        self,
        df: pd.DataFrame,
        embedder=EMBEDDER,
        sentiment_analyzer=SENTIMENT,
    ):
        self.df = df.copy()

        # Light-weight objects created per instance
        self.scaler = StandardScaler()
        self.encoder = LabelEncoder()

        # Heavy objects come from the singleton module
        self.embedder = embedder
        self.sentiment_analyzer = sentiment_analyzer

        # Column-matching configuration
        self.required_cols = {
            "user_id":       ["user_id", "userid", "user id"],
            "rating":        ["overall", "rating", "score"],
            "click":         ["click", "clicks"],
            "review":        ["review_text", "review", "text", "reviewbody"],
            "product_id":    ["product_id", "productid", "asin", "product id"],
            "category":      ["category", "group", "class", "category_name"],
            "product_title": ["product", "title", "product_title", "product name", "name"],
            "price":         ["price", "cost", "amount", "listing price"],
            "color":         ["color", "colour", "product_color", "shade", "hue"],
            "material":      ["material", "fabric", "composition", "made of"],
            "features":      [
                "features", "item_features", "description",
                "item_description", "details", "item_details",
            ],
        }
        self.matched_cols: Dict[str, str] = {}
        self.used_columns: set = set() 
        self._identify_columns()          # fuzzy-match on init

        # Will hold key → np.ndarray for embeddings
        self.embeddings: dict[str, np.ndarray] = {}

    # --------------------------------------------------------------------- #
    #                           Column Matching                              #
    # --------------------------------------------------------------------- #

    def _fuzzy_match(self, candidates: List[str]) -> Optional[str]:
        """Return best unused column that matches any of the candidate names."""
        available = [c for c in self.df.columns if c not in self.used_columns]
        best_match, best_score = None, 0
        for name in candidates:
            match, score = process.extractOne(name, available)
            if score > best_score:
                best_match, best_score = match, score
        if best_score >= 80:
            self.used_columns.add(best_match)
            return best_match
        return None

    def _identify_columns(self) -> None:
        for key, options in self.required_cols.items():
            matched = self._fuzzy_match(options)
            if matched:
                self.matched_cols[key] = matched
                print(f"[INFO] Matched “{key}” → “{matched}”")

    # --------------------------------------------------------------------- #
    #                            Cleaning Steps                              #
    # --------------------------------------------------------------------- #

    def _drop_nulls_duplicates(self) -> None:
        self.df.dropna(inplace=True)
        self.df.drop_duplicates(inplace=True)

    def _perform_sentiment_analysis(self) -> None:
        review_col = self.matched_cols.get("review")
        if review_col:
            self.df["sentiment"] = self.df[review_col].astype(str).apply(
                lambda x: self.sentiment_analyzer.polarity_scores(x)["compound"]
            )

    def _scale_numericals(self) -> None:
        scale_candidates = {
            "price": self.matched_cols.get("price"),
            "Item Weight": "Item Weight",
            "length": "length",
            "width": "width",
            "height": "height",
        }
        for name, col in scale_candidates.items():
            if col and col in self.df.columns:
                self.df[f"{name}_scaled"] = self.scaler.fit_transform(self.df[[col]])

    def _encode_categoricals(self) -> None:
        for key in ["category", "manufacturer", "color", "material"]:
            col = self.matched_cols.get(key)
            if col and col in self.df.columns:
                self.df[f"{key}_encoded"] = self.encoder.fit_transform(
                    self.df[col].astype(str)
                )
                if key == "category":
                    self.df["category_encoded"] = self.df[f"{key}_encoded"]

    def _generate_embeddings(self) -> None:
        for key in ["review", "product_title", "features"]:
            col = self.matched_cols.get(key)
            if col and col in self.df.columns:
                sentences = self.df[col].astype(str).tolist()
                self.embeddings[key] = self.embedder.encode(
                    sentences, show_progress_bar=True
                )

    def _standardize_column_names(self) -> None:
        for std_name, original in self.matched_cols.items():
            if original != std_name and original in self.df.columns:
                self.df.rename(columns={original: std_name}, inplace=True)
                self.matched_cols[std_name] = std_name

    # --------------------------------------------------------------------- #
    #                          Pipeline Orchestrator                         #
    # --------------------------------------------------------------------- #

    def run(self, output_csv: str = "preprocessed_data.csv"):
        """Execute full pipeline, persist CSV & .npy files, return processed df."""
        self._standardize_column_names()
        self._drop_nulls_duplicates()
        self._perform_sentiment_analysis()

        # Ensure user_id exists
        if "user_id" not in self.matched_cols:
            print("[WARN] user_id not found; defaulting to -1")
            self.df["user_id"] = -1
            self.matched_cols["user_id"] = "user_id"

        # Build index columns
        self.df["u_idx"] = self.df["user_id"].astype("category").cat.codes
        self.df["i_idx"] = self.df["product_id"].astype("category").cat.codes

        # Pad user histories into seq (example 50-item history)
        def build_sequence(max_len: int = 50):
            hist = self.df.groupby("u_idx")["i_idx"].apply(list).to_dict()
            pad_token = self.df["i_idx"].max() + 1

            def get_seq(uid):
                seq = hist.get(uid, [])
                if len(seq) >= max_len:
                    return seq[-max_len:]
                return [pad_token] * (max_len - len(seq)) + seq

            return self.df["u_idx"].map(get_seq)

        self.df["seq"] = build_sequence()
        self._scale_numericals()
        self._encode_categoricals()
        self._generate_embeddings()

        # --------------------------------------------------------------- #
        #                Select final columns for training                #
        # --------------------------------------------------------------- #

        final_cols: set = set()

        for key in self.required_cols:
            raw_col = self.matched_cols.get(key)
            if not raw_col:
                continue

            # Drop raw review text (embedded only)
            if key == "review":
                continue

            # Prefer engineered variants
            if key == "price":
                col = f"{key}_scaled"
            elif key in ["color", "material"]:
                col = f"{key}_encoded"
            else:
                col = raw_col

            if col in self.df.columns:
                final_cols.add(col)

        # Add engineered + index columns
        final_cols.update(
            [
                "sentiment",
                "u_idx",
                "i_idx",
                "seq",
                *[c for c in self.df.columns if c.endswith("_scaled") or c.endswith("_encoded")],
            ]
        )

        # Final filter & persist
        self.df = self.df[[c for c in self.df.columns if c in final_cols]]
        self.df.to_csv(output_csv, index=False)

        # Save embeddings
        for key, arr in self.embeddings.items():
            np.save(f"{key}_embeddings.npy", arr)

        return self.df, list(self.embeddings.items())

# --------------------------------------------------------------------------- #
#                  Dataset & DataModule helpers (unchanged)                   #
# --------------------------------------------------------------------------- #

class RecommenderDataset(Dataset):
    def __init__(self, df, meta_features, labels):
        self.u_idx = torch.tensor(df["u_idx"].values, dtype=torch.long)
        self.i_idx = torch.tensor(df["i_idx"].values, dtype=torch.long)
        self.seq = torch.tensor(np.vstack(df["seq"].values), dtype=torch.long)
        self.meta = torch.tensor(meta_features, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.float32)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return {
            "u_idx": self.u_idx[idx],
            "i_idx": self.i_idx[idx],
            "seq": self.seq[idx],
            "meta": self.meta[idx],
        }, self.labels[idx]


class RecommenderDataModule:
    FEATURES = ["price_scaled", "sentiment", "color_encoded", "material_encoded", "category"]

    def __init__(
        self,
        df,
        embeddings_list,
        batch_size,
        rating_threshold=4,
        test_size=0.2,
        val_size=0.5,
        random_state=42,
    ):
        self.df = df
        self.batch_size = batch_size
        self.rating_threshold = rating_threshold
        self.test_size = test_size
        self.val_size = val_size
        self.random_state = random_state

        # unpack embeddings_list → title, feat, review (assumed order)
        self.text_emb, self.feat_emb, self.title_emb = [e for _, e in embeddings_list]

    # -- splitting / loader logic identical to your previous version --
    # (omitted here for brevity – copy unchanged from earlier code)
