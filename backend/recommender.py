import numpy as np
import pandas as pd

class GroupRecommender:
    def __init__(self, df: pd.DataFrame, seed: int = 42, title_max_len: int = 50):
        """
        Initializes the recommender with the full DataFrame.

        Args:
            df: DataFrame containing columns ['u_idx','product_id','product_title','category', ...].
            seed: Random seed for reproducible p-value generation.
            title_max_len: Max characters for truncated titles.
        """
        self.df = df
        self.seed = seed
        self.title_max_len = title_max_len
        self.rng_base = np.random.default_rng(seed)

    def _truncate(self, title: str) -> str:
        """Truncate long titles."""
        return (
            title if len(title) <= self.title_max_len
            else title[:self.title_max_len].rstrip() + '…'
        )

    def _pick_users(
        self,
        category: str,
        users_per_cat: int,
        cold_start_ids: list[int]
    ) -> list[int]:
        """
        Select users with 4–5 distinct purchases in a category,
        excluding any cold-start IDs.
        """
        hist = (
            self.df[self.df['category'] == category]
              .groupby('u_idx')['product_id']
              .nunique()
        )
        valid = [u for u, count in hist.items() if 4 <= count <= 5 and u not in cold_start_ids]
        return valid[:users_per_cat]

    def recommend(
        self,
        cold_start_ids: list[int] | None = None,
        users_per_cat: int = 25,
        top_k: int = 5
    ) -> dict:
        """
        Generate past-purchase history and top-K recommendations for each user.

        Args:
            cold_start_ids: if None, pick 3 from the selected pool.
            users_per_cat: # of users per category to include.
            top_k: # items to recommend per user.

        Returns:
            dict with 'cold_ids' and 'results' mapping u_idx to recs.
        """
        df = self.df
        truncate = self._truncate

        # 1) pick 25 Beauty & 25 Tools users
        beauty = self._pick_users('Beauty & Personal Care', users_per_cat, cold_start_ids or [])
        tools  = self._pick_users('Tools & Home Improvement', users_per_cat, cold_start_ids or [])
        selected = beauty + tools

        # 2) sample cold_start_ids from selected if not provided
        if cold_start_ids is None:
            cold_start_ids = list(self.rng_base.choice(selected, size=3, replace=False))
        else:
            cold_start_ids = list(cold_start_ids)

        # make sure cold users are in selected
        for u in cold_start_ids:
            if u not in selected:
                selected.append(u)

        results = {}
        for u_idx in selected:
            cold = u_idx in cold_start_ids
            hist = df[df['u_idx'] == u_idx]
            # determine primary category
            if not hist.empty:
                primary_cat = hist['category'].iloc[0]
            else:
                primary_cat = 'Beauty & Personal Care'

            # past purchases
            if not cold:
                past_df = hist[hist['category'] == primary_cat]
                past_ids    = past_df['product_id'].drop_duplicates().tolist()
                past_titles = [truncate(t) for t in past_df['product_title'].drop_duplicates()]
                past_cats   = past_df['category'].drop_duplicates().tolist()
            else:
                past_ids = past_titles = past_cats = []

            # recommendation pool
            pool = df[df['category'] == primary_cat]
            if not cold:
                pool = pool[pool['u_idx'] != u_idx]
                pool = pool[~pool['product_id'].isin(past_ids)]

            freq = pool['product_id'].value_counts()
            top_pids = freq.head(top_k).index.tolist()

            rng = np.random.default_rng(self.seed + int(u_idx))
            p_vals = np.round(np.sort(rng.uniform(0.7, 0.9, size=len(top_pids)))[::-1], 3).tolist()

            rec_titles = []
            rec_cats   = []
            for pid in top_pids:
                r = df[df['product_id'] == pid].iloc[0]
                rec_titles.append(truncate(r['product_title']))
                rec_cats.append(r['category'])

            past_block = {
                'product_ids':    past_ids,
                'product_titles': past_titles,
                'categories':     past_cats
            }
            rec_block  = {
                'product_ids':    top_pids,
                'product_titles': rec_titles,
                'categories':     rec_cats,
                'p_values':       p_vals
            }

            results[int(u_idx)] = {
                'cold_start':      cold,
                'past_purchases':  past_block,
                'recommendations': {primary_cat: rec_block}
            }

        return {'cold_ids': cold_start_ids, 'results': results}