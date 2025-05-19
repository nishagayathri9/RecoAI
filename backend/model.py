# backend/model.py

import torch
import torch.nn as nn

# MAX_SEQ_LEN   = 50
# EPOCHS     = 30         # as found
# LR         = 3e-5       # ≈2.84e-5
# BATCH_SIZE = 512        # as found
# EMB_DIM    = 64         # nearest power-of-two to 59
# HIDDEN_DIM = 96         # nearest multiple of 32 to 89
# AUX_WEIGHT = 0.65       # ≈0.6506


# === MODEL COMPONENTS ===
class AttentionUnit(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.query_layer = nn.Linear(dim, dim)
        self.key_layer = nn.Linear(dim, dim)
        self.softmax = nn.Softmax(dim=1)
    def forward(self, query, keys):
        q = self.query_layer(query).unsqueeze(1)
        k = self.key_layer(keys)
        score = torch.bmm(k, q.transpose(1, 2)).squeeze(-1)
        weights = self.softmax(score)
        return torch.bmm(weights.unsqueeze(1), keys).squeeze(1)

class DIENCollaborative(nn.Module):
    def __init__(self, n_users, n_items, emb_dim, seq_len):
        super().__init__()
        self.user_emb = nn.Embedding(n_users, emb_dim)
        self.item_emb = nn.Embedding(n_items + 1, emb_dim)
        self.user_bias = nn.Embedding(n_users, 1)
        self.item_bias = nn.Embedding(n_items, 1)
        self.gru = nn.GRU(emb_dim, emb_dim, batch_first=True)
        self.attn = AttentionUnit(emb_dim)
        self.aux_layer = nn.Linear(emb_dim, 1)
    def forward(self, u_idx, i_idx, seq):
        user_bias = self.user_bias(u_idx).squeeze()
        item_bias = self.item_bias(i_idx).squeeze()
        fm1 = (user_bias + item_bias).unsqueeze(1)
        seq_emb = self.item_emb(seq)
        gru_out, _ = self.gru(seq_emb)
        attn_vec = self.attn(self.item_emb(i_idx), gru_out)
        aux = torch.sigmoid(self.aux_layer(gru_out[:, -1, :])).squeeze()
        return fm1, attn_vec, aux

class ContentTower(nn.Module):
    def __init__(self, meta_dim, cf_dim, hidden_dim=64):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(meta_dim+ cf_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3)
        )
    def forward(self, meta,cf):
        x = torch.cat([cf, meta], dim=1)
        return self.fc(x)

class HybridDeepFM(nn.Module):
    def __init__(self, n_users, n_items, emb_dim, meta_dim, hidden_dim=64, seq_len=50):
        super().__init__()
        self.cf = DIENCollaborative(n_users, n_items, emb_dim, seq_len)
        self.cf_dim = 1 + emb_dim
        self.cb = ContentTower(meta_dim,  self.cf_dim, hidden_dim)
        self.gate = nn.Linear(self.cf_dim, 1)
        self.out = nn.Sequential(
            nn.Linear(hidden_dim, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 1)
        )
    def forward(self, inputs):
        fm1, attn_vec, aux = self.cf(inputs['u_idx'], inputs['i_idx'], inputs['seq'])
        x = torch.cat([fm1, attn_vec], dim=1)
        gate_val = torch.sigmoid(self.gate(x))
        cf_out = gate_val * x
        cb_out = self.cb(inputs['meta'],cf_out)
        out = self.out(cb_out).squeeze()         # [B]
        return out, aux
