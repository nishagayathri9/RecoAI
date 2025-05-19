
import pandas as pd
import numpy as np
import re
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sentence_transformers import SentenceTransformer
from fuzzywuzzy import process
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import numpy as np
from sklearn.model_selection import train_test_split
import torch
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler


nltk.download('vader_lexicon')
# drive.mount('/content/drive')

class Preprocessing:
    def __init__(self, df):
        self.df = df.copy()
        self.scaler = StandardScaler()
        self.encoder = LabelEncoder()
        self.embedder = SentenceTransformer('all-mpnet-base-v2', device="cuda")
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.required_cols = {
            'user_id': ['user_id', 'userid', 'user id'],
            'rating': ['overall', 'rating', 'score'],
            'review': ['review_text', 'review', 'text', 'reviewbody'],
            'product_id': ['product_id', 'productid', 'asin', 'product id'],
            'category': ['category', 'group', 'class', 'category_name'],
            # 'subcategory': ['sub-category', 'sub_category', 'subclass', 'subcategory_name'],
            'product_title': ['product', 'title', 'product_title', 'product name', 'name'],
            'price': ['price', 'cost', 'amount', 'listing price'],
            # 'manufacturer': ['manufacturer', 'brand_name', 'brand', 'maker'],
            'color': ['color', 'colour', 'product_color', 'shade', 'hue'],
            'material': ['material', 'fabric', 'composition', 'made of'],
            # 'weight': ['item weight', 'weight', 'product_weight', 'shipping weight'],
            # 'dimensions': ['product dimensions', 'dimensions', 'size', 'product_size', 'size_dimensions'],
            'features': ['features', 'item_features', 'description', 'item_description', 'details', 'item_details']
          }
        self.matched_cols = {}
        self.used_columns = set()
        self._identify_columns()
        self.embeddings = {}

    def _fuzzy_match(self, candidates):
        """Find the best fuzzy match among unused DataFrame columns."""
        best_match = None
        best_score = 0

        available_columns = [col for col in self.df.columns if col not in self.used_columns]

        for name in candidates:
            match, score = process.extractOne(name, available_columns)
            if score > best_score:
                best_match = match
                best_score = score

        if best_score >= 80:
            self.used_columns.add(best_match)
            return best_match
        else:
            return None

    def _identify_columns(self):
        # print("[INFO] Matching required columns (no duplicates)...")
        for key, options in self.required_cols.items():
            matched = self._fuzzy_match(options)
            if matched:
                self.matched_cols[key] = matched
                print(f"[INFO] Matched '{key}' to column: '{matched}'")
            # else:
            #     print(f"[WARN] No match found for '{key}'.")


    def _drop_nulls_duplicates(self):
        # print("[INFO] Dropping nulls and duplicates...")
        self.df.dropna(inplace=True)
        self.df.drop_duplicates(inplace=True)


    def _perform_sentiment_analysis(self):
        # print("[INFO] Performing sentiment analysis...")
        review_col = self.matched_cols.get('review')
        if review_col:
            self.df['sentiment'] = self.df[review_col].astype(str).apply(
                lambda x: self.sentiment_analyzer.polarity_scores(x)['compound']
            )
        # else:
            # print("[WARN] Review column not found. Skipping sentiment analysis.")


    def _scale_numericals(self):
        # print("[INFO] Scaling numerical features...")
        scale_candidates = {
            'price': self.matched_cols.get('price'),
            'Item Weight': 'Item Weight',
            'length': 'length',
            'width': 'width',
            'height': 'height'
        }

        for name, col in scale_candidates.items():
            if col and col in self.df.columns:
                self.df[f"{name}_scaled"] = self.scaler.fit_transform(self.df[[col]])
            # else:
            #     print(f"[WARN] Column '{name}' not found or unmatched. Skipping scaling.")

    def _encode_categoricals(self):
        # print("[INFO] Encoding categorical features...")
        for key in ['category','manufacturer', 'color', 'material']:
            col = self.matched_cols.get(key)
            if col and col in self.df.columns:
                self.df[f"{key}_encoded"] = self.encoder.fit_transform(self.df[col].astype(str))
            # else:
            #     print(f"[WARN] Column '{key}' not found. Skipping encoding.")

    def _generate_embeddings(self):
        # print("[INFO] Generating sentence embeddings (not adding to dataframe)...")
        for key in ['review', 'product_title', 'features']:
            col = self.matched_cols.get(key)
            if col and col in self.df.columns:
                sentences = self.df[col].astype(str).tolist()
                embeddings = self.embedder.encode(sentences, show_progress_bar=True)
                self.embeddings[key] = embeddings
            # else:
            #     print(f"[WARN] Column '{key}' not found. Skipping embeddings.")


    def _standardize_column_names(self):
        # print("[INFO] Renaming matched columns to standard names...")
        for std_name, original in self.matched_cols.items():
            if original != std_name and original in self.df.columns:
                self.df.rename(columns={original: std_name}, inplace=True)
                self.matched_cols[std_name] = std_name  # Ensure internal consistency


    def run(self, output_csv="preprocessed_data_synergy.csv"):
        # print("[INFO] Running full preprocessing pipeline...")
        self._standardize_column_names()
        self._drop_nulls_duplicates()
        # self._clean_weight()
        # self._parse_dimensions()
        self._perform_sentiment_analysis()

        # Generate placeholder user_id column if not found
        if 'user_id' not in self.matched_cols:
            print("[WARN] user_id column not found. Assigning default user_id = -1...")
            self.df['user_id'] = -1  # Assign -1 to all rows
            self.matched_cols['user_id'] = 'user_id'
        
        self.df['u_idx'] = self.df['user_id'].astype('category').cat.codes
        self.df['i_idx'] = self.df['product_id'].astype('category').cat.codes

        # === BUILD USER SEQUENCES ===
        def build_sequence(df, max_len=50):
            hist = self.df.groupby('u_idx')['i_idx'].apply(list).to_dict()
            pad_token = self.df['i_idx'].max() + 1
            def get_seq(uid):
                if uid == 0:
                    return [0] * max_len
                seq = hist.get(uid, [])
                if len(seq) >= max_len:
                    return seq[-max_len:]
                return [pad_token] * (max_len - len(seq)) + seq
            return self.df['u_idx'].map(get_seq)


        self.df['seq'] = build_sequence(self.df)
        self._scale_numericals()
        self._encode_categoricals()
        self._generate_embeddings()

        # print("[INFO] Dropping irrelevant columns...")

        final_cols = set()

        # print(f"Matched cols: {self.matched_cols}")
        for key in self.required_cols:
            raw_col = self.matched_cols.get(key)

            # Skip if column wasn't matched
            if not raw_col:
                continue

            # Drop review column from df (since it's embedded only)
            if key == "review":
                continue

            # For scaled/encoded columns, prefer them over raw
            if key in ['price']:
                scaled_col = f"{key}_scaled"
                if scaled_col in self.df.columns:
                    final_cols.add(scaled_col)
                    continue

            elif key in ['color', 'material']:
                encoded_col = f"{key}_encoded"
                if encoded_col in self.df.columns:
                    final_cols.add(encoded_col)
                    continue

            # For embedded columns 'title' and 'features' keep the original text column
            if key in ['title', 'features']:
                final_cols.add(raw_col)
                continue

            # Otherwise, keep the raw column
            final_cols.add(raw_col)

        # Add engineered columns
        final_cols.update([
            'sentiment'
        ])

        # Also add any scaled/encoded versions that were created
        final_cols.update([col for col in self.df.columns if col.endswith('_scaled') or col.endswith('_encoded')])
        final_cols.update(['u_idx', 'i_idx', 'seq'])
        # Final filter
        self.df = self.df[[col for col in self.df.columns if col in final_cols]]

        # Save CSV
        # print(f"[INFO] Saving processed DataFrame to '{output_csv}'...")
        self.df.to_csv(output_csv, index=False)

        # Save .npy embedding files
        for key, embedding in self.embeddings.items():
            file_name = f"{key}_embeddings_synergy.npy"
            # print(f"[INFO] Saving {key} embeddings to '{file_name}'...")
            np.save(file_name, embedding)

        # print("[INFO] Preprocessing complete.")
        return self.df, list(self.embeddings.items())

class RecommenderDataset(Dataset):
    def __init__(self, df, meta_features, labels):
        self.u_idx = torch.tensor(df['u_idx'].values, dtype=torch.long)
        self.i_idx = torch.tensor(df['i_idx'].values, dtype=torch.long)
        self.seq   = torch.tensor(np.vstack(df['seq'].values), dtype=torch.long)
        self.meta  = torch.tensor(meta_features, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.float32)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return {
            'u_idx': self.u_idx[idx],
            'i_idx': self.i_idx[idx],
            'seq':   self.seq[idx],
            'meta':  self.meta[idx]
        }, self.labels[idx]


class RecommenderDataModule:
    FEATURES = ['price_scaled', 'sentiment', 'color_encoded', 'material_encoded', 'category']
    def __init__(
        self,
        df,
        embeddings_list,
        features,
        batch_size,
        rating_threshold=4,
        test_size=0.2,
        val_size=0.5,
        random_state=42
    ):
        self.df = df
        self.embeddings_list = embeddings_list
        self.features = RecommenderDataModule.FEATURES
        self.batch_size = batch_size
        self.rating_threshold = rating_threshold
        self.test_size = test_size
        self.val_size = val_size
        self.random_state = random_state

    def setup(self):
        # Build meta-feature array and labels
        X_meta = np.hstack([
            self.df[self.features].values,
            self.text_emb,
            self.feat_emb,
            self.title_emb
        ])
        y = (self.df['rating'] >= self.rating_threshold).astype(int).values

        # First split: train+val vs test
        df_tv, df_test, y_tv, y_test, X_tv_meta, X_test_meta = \
            train_test_split(
                self.df,
                y,
                X_meta,
                test_size=self.test_size,
                random_state=self.random_state,
                stratify=y
            )
        # Second split: train vs val
        val_prop = self.val_size
        df_train, df_val, y_train, y_val, X_train_meta, X_val_meta = \
            train_test_split(
                df_tv,
                y_tv,
                X_tv_meta,
                test_size=val_prop,
                random_state=self.random_state,
                stratify=y_tv
            )

        # Instantiate datasets
        self.train_dataset = RecommenderDataset(df_train, X_train_meta, y_train)
        self.val_dataset   = RecommenderDataset(df_val,   X_val_meta,   y_val)
        self.test_dataset  = RecommenderDataset(df_test,  X_test_meta,  y_test)

        # Weighted sampler for training
        counts = np.bincount(y_train)
        weights = 1.0 / counts
        sample_weights = weights[y_train]
        sampler = WeightedRandomSampler(sample_weights, len(sample_weights), replacement=True)

        # DataLoaders
        self.train_loader = DataLoader(
            self.train_dataset,
            batch_size=self.batch_size,
            sampler=sampler
        )
        self.val_loader = DataLoader(
            self.val_dataset,
            batch_size=self.batch_size,
            shuffle=False
        )
        self.test_loader = DataLoader(
            self.test_dataset,
            batch_size=self.batch_size,
            shuffle=False
        )

    def get_loaders(self):
        return self.train_loader, self.val_loader, self.test_loader

    def get_test_split(self):
        return self.df_test, self.X_test_meta

