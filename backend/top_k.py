from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix
import numpy as np
import torch

def hybrid_topk_recommendation(
    model,
    user_id,
    df,
    meta_features_all,
    product_title_map,
    item_embeddings,
    deepfm_weight=0.7,
    knn_weight=0.3,
    like_threshold=4,
    top_n_users=10,
    top_k_items=5
):
    device = next(model.parameters()).device
    pad_token = df['i_idx'].max() + 1

    # Precompute lookups
    meta_lookup = {i: meta for i, meta in zip(df['i_idx'], meta_features_all)}
    i2asin = df.set_index('i_idx')['product_id'].to_dict()
    i2title = df.set_index('i_idx')['product_title'].to_dict()

    # Step 1: unseen items
    user_df = df[df['u_idx'] == user_id]
    seen_items = set(user_df['i_idx'])
    all_items = set(df['i_idx'].unique())
    unseen_items = list(all_items - seen_items)
    if not unseen_items:
        return []

    # Step 2: DeepFM scoring
    model.eval()
    seq_template = df['seq'].iloc[0]
    if user_df.empty:
        user_seq = [pad_token] * len(seq_template)
    else:
        user_seq = user_df['seq'].iloc[0]

    N = len(unseen_items)
    seq_tensor = torch.tensor([user_seq], dtype=torch.long).repeat(N, 1).to(device)
    uidx_tensor = torch.tensor([user_id] * N, dtype=torch.long).to(device)
    iidx_tensor = torch.tensor(unseen_items, dtype=torch.long).to(device)

    meta_rows = np.vstack([
        meta_lookup.get(i, np.zeros(meta_features_all.shape[1], dtype=float))
        for i in unseen_items
    ])
    meta_tensor = torch.tensor(meta_rows, dtype=torch.float32).to(device)

    with torch.no_grad():
        preds, _ = model({
            'u_idx': uidx_tensor,
            'i_idx': iidx_tensor,
            'seq': seq_tensor,
            'meta': meta_tensor
        })
        deepfm_scores = torch.sigmoid(preds).cpu().numpy().flatten()

    # Cold-start: use constant final score if no history
    if user_df.empty:
        recs = []
        for idx, item_id in enumerate(unseen_items):
            asin = i2asin.get(item_id, "Unknown")
            title = i2title.get(item_id, "Unknown Title")
            recs.append({
                'item_id': item_id,
                'asin': asin,
                'title': title,
                'deepfm_score': round(deepfm_scores[idx], 4),
                'knn_score': 0.0,
                'final_score': 0.1,
                'top5_related_past_titles': []
            })
        return sorted(recs, key=lambda x: x['final_score'], reverse=True)[:top_k_items]

    # Step 3: CF-KNN for similar users
    df_like = df[df['rating'] >= like_threshold]
    uim = df_like.pivot_table(index='u_idx', columns='i_idx', values='rating', fill_value=0)
    sparse_mat = csr_matrix(uim.values)
    user_to_row = {u: i for i, u in enumerate(uim.index)}
    row_to_user = {i: u for u, i in user_to_row.items()}

    if user_id in user_to_row:
        k_users = min(top_n_users + 1, sparse_mat.shape[0])
        cf_knn = NearestNeighbors(n_neighbors=k_users, metric='cosine').fit(sparse_mat)
        _, idxs = cf_knn.kneighbors(
            sparse_mat[user_to_row[user_id]].reshape(1, -1), return_distance=True
        )
        sim_users = [row_to_user[i] for i in idxs[0] if i != user_to_row[user_id]][:top_n_users]
        neigh_df = df_like[df_like['u_idx'].isin(sim_users)]
        item_scores = neigh_df['i_idx'].value_counts(normalize=True).to_dict()
    else:
        item_scores = {}

    # Step 4: KNN for past-item similarity
    past_item_ids = user_seq
    rec_knn = None
    if past_item_ids:
        emb_mat = item_embeddings[past_item_ids]
        k_past = min(5, len(past_item_ids))
        rec_knn = NearestNeighbors(n_neighbors=k_past, metric='cosine').fit(emb_mat)

    # Step 5: Combine and rank
    recs = []
    for idx, item_id in enumerate(unseen_items):
        ds = deepfm_scores[idx]
        ks = item_scores.get(item_id, 0.0)
        # If no CF signal, use constant final score
        if ks == 0:
            fs = 0.1
        else:
            fs = deepfm_weight * ds + knn_weight * ks

        top5 = []
        if rec_knn:
            nbrs = rec_knn.kneighbors(
                item_embeddings[item_id].reshape(1, -1), return_distance=False
            )[0]
            top5 = [i2title.get(pid, "Unknown Title") for pid in nbrs]

        asin = i2asin.get(item_id, "Unknown")
        title = i2title.get(item_id, "Unknown Title")

        recs.append({
            'item_id': item_id,
            'asin': asin,
            'title': title,
            'deepfm_score': round(ds, 4),
            'knn_score': round(ks, 4),
            'final_score': round(fs, 4),
            'top5_related_past_titles': top5
        })

    return sorted(recs, key=lambda x: x['final_score'], reverse=True)[:top_k_items]

### HOW WE R CALLING THE FUNCTION 
product_title_map = dict(zip(df_test1['product_id'], df_test1['product_title']))
with torch.no_grad():
    item_embedding_weights = model.cf.item_emb.weight.detach().cpu().numpy()

recs = hybrid_topk_recommendation(
    model=model,
    user_id=5,
    df=df_test1,
    meta_features_all=X_meta,
    product_title_map=product_title_map,
    item_embeddings=item_embedding_weights,
    deepfm_weight=0.8,
    knn_weight=0.1,
    top_k_items=5
)

for r in recs:
    print(f"\n🔹 {r['title']}")
    print(f"   ASIN: {r['asin']} | DeepFM: {r['deepfm_score']} | CF: {r['knn_score']} | Final: {r['final_score']}")
    print(f"   Most similar past purchases:")
    for t in r['top5_related_past_titles']:
        print(f"   - {t}")