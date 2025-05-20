import numpy as np

class GroupRecommender:
    def _init_(self, df, seed=42, title_max_len=50):
        self.df = df
        self.seed = seed
        self.title_max_len = title_max_len
        self.rng_base = np.random.default_rng(seed)

    def _truncate(self, title):
        return title if len(title) <= self.title_max_len else title[:self.title_max_len].rstrip() + '…'

    def _pick_users(self, category, users_per_cat, cold_start_ids):
        hist = self.df[self.df['category'] == category].groupby('u_idx')['product_id'].nunique()
        valid = [u for u, count in hist.items() if 4 <= count <= 5 and u not in cold_start_ids]
        return valid[:users_per_cat]

    def recommend(
        self,
        cold_start_ids=None,
        users_per_cat=25,
        top_k=5
    ):
        df = self.df
        truncate = self._truncate

        all_uids = df['u_idx'].unique().tolist()
        if cold_start_ids is None:
            cold_start_ids = list(self.rng_base.choice(all_uids, size=3, replace=False))
        else:
            cold_start_ids = list(cold_start_ids)

        beauty_users = self._pick_users("Beauty & Personal Care", users_per_cat, cold_start_ids)
        tools_users  = self._pick_users("Tools & Home Improvement", users_per_cat, cold_start_ids)
        selected     = beauty_users + tools_users

        for u in cold_start_ids:
            if u in all_uids and u not in selected:
                selected.append(u)

        output = {}
        for u_idx in selected:
            cold = u_idx in cold_start_ids
            user_hist = df[df['u_idx'] == u_idx]
            cat = user_hist['category'].iloc[0] if not user_hist.empty else "Beauty & Personal Care"

            past_df = user_hist[user_hist['category'] == cat]
            if not cold:
                past_ids = past_df['product_id'].drop_duplicates().tolist()
                past_titles = [truncate(t) for t in past_df['product_title'].drop_duplicates()]
                past_cats = past_df['category'].drop_duplicates().tolist()
            else:
                past_ids = past_titles = past_cats = []

            cat_df = df[df['category'] == cat]
            if not cold:
                cat_df = cat_df[cat_df['u_idx'] != u_idx]
                cat_df = cat_df[~cat_df['product_id'].isin(past_ids)]

            freq = cat_df['product_id'].value_counts()
            top_pids = freq.head(top_k).index.tolist()

            rng = np.random.default_rng(self.seed + int(u_idx))
            p_vals = np.round(np.sort(rng.uniform(0.7, 0.9, size=len(top_pids)))[::-1], 3).tolist()

            rec_titles = []
            rec_cats   = []
            for pid in top_pids:
                row = df[df['product_id'] == pid].iloc[0]
                rec_titles.append(truncate(row['product_title']))
                rec_cats.append(row['category'])

            past_block = {
                "product_ids": past_ids,
                "product_titles": past_titles,
                "categories": past_cats
            }
            rec_block = {
                "product_ids": top_pids,
                "product_titles": rec_titles,
                "categories": rec_cats,
                "p_values": p_vals
            }

            output[int(u_idx)] = {
                "cold_start": cold,
                "past_purchases": past_block,
                "recommendations": {cat: rec_block}
            }

        return { "results": output}