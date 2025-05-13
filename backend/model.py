# backend/model.py

import torch
import torch.nn as nn

class AttentionUnit(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.query_layer = nn.Linear(dim, dim)
        self.key_layer   = nn.Linear(dim, dim)
        self.softmax     = nn.Softmax(dim=1)

    def forward(self, query, keys):
        # query: (batch, dim), keys: (batch, T, dim)
        q = self.query_layer(query).unsqueeze(1)  # (batch,1,dim)
        k = self.key_layer(keys)                  # (batch,T,dim)
        # score: (batch, T)
        score = torch.bmm(k, q.transpose(1,2)).squeeze(-1)
        attn_weights = self.softmax(score)        # (batch, T)
        # weighted sum: (batch,dim)
        weighted_sum = torch.bmm(attn_weights.unsqueeze(1), keys).squeeze(1)
        return weighted_sum, attn_weights

class DIENCollaborative(nn.Module):
    def __init__(self, n_users, n_items, emb_dim):
        super().__init__()
        self.user_emb = nn.Embedding(n_users+1, emb_dim, padding_idx=n_users)
        self.item_emb = nn.Embedding(n_items+1, emb_dim, padding_idx=n_items)
        self.user_bias= nn.Embedding(n_users+1, 1, padding_idx=n_users)
        self.item_bias= nn.Embedding(n_items+1, 1, padding_idx=n_items)
        self.gru      = nn.GRU(emb_dim, emb_dim, batch_first=True)
        self.attn     = AttentionUnit(emb_dim)
        self.aux_layer= nn.Linear(emb_dim, 1)

    def forward(self, u_idx, i_idx):
        # embeddings
        u_vec = self.user_emb(u_idx).unsqueeze(1)            # (batch,1,dim)
        i_vec = self.item_emb(i_idx).unsqueeze(1)            # (batch,1,dim)
        ubias = self.user_bias(u_idx).squeeze(1)             # (batch,)
        ibias = self.item_bias(i_idx).squeeze(1)             # (batch,)
        fm1   = (ubias + ibias).unsqueeze(1)                 # (batch,1)

        # sequence = [user,item] for DIEN aux task
        seq   = torch.cat([u_vec, i_vec], dim=1)            # (batch,2,dim)
        gru_out, _ = self.gru(seq)                          # (batch,2,dim)
        attn_vec, _= self.attn(i_vec.squeeze(1), gru_out)   # (batch,dim)
        aux_loss   = torch.sigmoid(self.aux_layer(gru_out[:,-1,:])).squeeze(1)
        return fm1, attn_vec, aux_loss

class DIENContent(nn.Module):
    def __init__(self, meta_dim, hidden_dim=64):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(meta_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3)
        )

    def forward(self, meta):
        return self.fc(meta)  # (batch,hidden_dim)

class DeepFM(nn.Module):
    def __init__(self, n_users, n_items, emb_dim, meta_dim, hidden_dim=64):
        super().__init__()
        self.cf         = DIENCollaborative(n_users, n_items, emb_dim)
        self.cb         = DIENContent(meta_dim, hidden_dim)
        self.project_cb = nn.Linear(hidden_dim, 1 + emb_dim + hidden_dim)
        self.gate       = nn.Sequential(
                               nn.Linear(1 + emb_dim + hidden_dim, 1),
                               nn.Sigmoid()
                           )
        self.out        = nn.Sequential(
                               nn.Linear(1 + emb_dim + hidden_dim, 1),
                               nn.Sigmoid()
                           )

    def forward(self, u_idx, i_idx, meta):
        fm1, cb_vec, aux = self.cf(u_idx, i_idx)            # fm1: (batch,1), cb_vec: (batch,dim)
        cb_out = self.cb(meta)                              # (batch,hidden_dim)
        x      = torch.cat([fm1, cb_vec, cb_out], dim=1)     # (batch,1+dim+hidden_dim)
        cb_proj= self.project_cb(cb_out)                    # (batch,1+dim+hidden_dim)
        g      = self.gate(x)                               # (batch,1)
        hybrid = g * x + (1 - g) * cb_proj                  # (batch,1+dim+hidden_dim)
        score  = self.out(hybrid).squeeze(1)                 # (batch,)
        return score, aux
