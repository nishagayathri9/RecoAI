# backend/model.py
"""
Hybrid DeepFM-DIEN recommender used by RecoAI.

Split into:
• DIEN-style collaborative tower (sequence modelling + AUGRU)
• Feed-forward content tower (meta / text embeddings)
• Final fusion MLP

Only the model classes live here—no training loops or data code.
"""

from __future__ import annotations
import torch
import torch.nn as nn
import torch.nn.functional as F

# ────────────────────────────────────────────────────────────────────────────
#  Building Blocks
# ────────────────────────────────────────────────────────────────────────────

class AUGRUCell(nn.Module):
    """
    Attentional GRU cell from the DIEN paper.
    `attn_score` modulates the update gate (z_t).
    """
    def __init__(self, input_dim: int, hidden_dim: int):
        super().__init__()
        self.W_r = nn.Linear(input_dim + hidden_dim, hidden_dim)  # reset gate
        self.W_z = nn.Linear(input_dim + hidden_dim, hidden_dim)  # update gate
        self.W_h = nn.Linear(input_dim + hidden_dim, hidden_dim)  # candidate

    def forward(self, x_t: torch.Tensor,
                      h_prev: torch.Tensor,
                      attn_score: torch.Tensor) -> torch.Tensor:
        xh = torch.cat([x_t, h_prev], dim=-1)
        r_t = torch.sigmoid(self.W_r(xh))
        z_t = torch.sigmoid(self.W_z(xh))
        h_hat = torch.tanh(self.W_h(torch.cat([x_t, r_t * h_prev], dim=-1)))

        # Attention controls how much we update (higher score → larger update)
        z_t = attn_score.unsqueeze(-1) * z_t
        h_t = (1.0 - z_t) * h_prev + z_t * h_hat
        return h_t


# ────────────────────────────────────────────────────────────────────────────
#  DIEN-style Collaborative Tower
# ────────────────────────────────────────────────────────────────────────────

class DIENCollaborative(nn.Module):
    """
    • Embeds user / item IDs
    • GRU over historical item sequence
    • Attention → AUGRU evolves interest vector
    • Auxiliary loss head (1-D sigmoid) returned to top model
    """
    def __init__(self,
                 n_users:   int,
                 n_items:   int,
                 emb_dim:   int,
                 seq_len:   int):
        super().__init__()
        self.user_emb   = nn.Embedding(n_users,        emb_dim)
        self.item_emb   = nn.Embedding(n_items + 1,    emb_dim)  # +1 for PAD
        self.user_bias  = nn.Embedding(n_users, 1)
        self.item_bias  = nn.Embedding(n_items, 1)

        self.gru         = nn.GRU(emb_dim, emb_dim, batch_first=True)
        self.attn_linear = nn.Linear(emb_dim, emb_dim)
        self.augru_cell  = AUGRUCell(emb_dim, emb_dim)
        self.aux_linear  = nn.Linear(emb_dim, 1)  # auxiliary click head

        # Store sequence length for convenience
        self.seq_len = seq_len

    # --------------------------------------------------------------------- #
    def forward(self,
                u_idx: torch.Tensor,          # [B]
                i_idx: torch.Tensor,          # [B]
                seq:  torch.Tensor) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Returns:
            fm1        – first-order bias term  [B, 1]
            attn_vec   – interest vector        [B, D]
            aux_logits – auxiliary click logits [B] (float)
        """
        # ---------- Bias term (first-order FM) ----------------------------
        fm1 = (self.user_bias(u_idx) + self.item_bias(i_idx)).squeeze(2)  # [B, 1]

        # ---------- Item sequence processing ------------------------------
        target_emb = self.item_emb(i_idx)        # [B, D]
        seq_emb    = self.item_emb(seq)          # [B, T, D]

        gru_out, _ = self.gru(seq_emb)           # [B, T, D]

        # Attention weights
        target_proj = self.attn_linear(target_emb).unsqueeze(1)  # [B,1,D]
        attn_scores = torch.sum(gru_out * target_proj, dim=-1)   # [B,T]
        attn_weights = torch.sigmoid(attn_scores)                # [B,T]

        # AUGRU
        h = torch.zeros_like(target_emb)
        for t in range(seq.shape[1]):
            h = self.augru_cell(seq_emb[:, t, :], h, attn_weights[:, t])
        attn_vec = h                                            # [B, D]

        # Auxiliary click / next-item loss
        aux_logits = self.aux_linear(gru_out[:, -1, :]).squeeze(1)  # [B]

        return fm1, attn_vec, aux_logits


# ────────────────────────────────────────────────────────────────────────────
#  Content-based Tower (meta features)
# ────────────────────────────────────────────────────────────────────────────

class ContentTower(nn.Module):
    """
    Simple MLP over meta / embedding features you concatenate beforehand.
    """
    def __init__(self,
                 meta_dim:    int,
                 hidden_dim:  int = 64,
                 dropout:     float = 0.3):
        super().__init__()
        self.fc = nn.Sequential(
            nn.Linear(meta_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout)
        )

    def forward(self, meta: torch.Tensor) -> torch.Tensor:
        return self.fc(meta)  # [B, hidden_dim]


# ────────────────────────────────────────────────────────────────────────────
#  Hybrid DeepFM (fusion)
# ────────────────────────────────────────────────────────────────────────────

class HybridDeepFM(nn.Module):
    """
    Final model that fuses:
      – First-order FM bias + evolved interest (CF tower)
      – MLP on meta features  (Content tower)
    """
    def __init__(self,
                 n_users:   int,
                 n_items:   int,
                 emb_dim:   int,
                 meta_dim:  int,
                 hidden_dim:int = 64,
                 seq_len:   int = 50):
        super().__init__()

        # Collaborative (DIEN) side
        self.cf = DIENCollaborative(n_users, n_items, emb_dim, seq_len)
        self.cf_dim = 1 + emb_dim                          # fm1 (1) + attn_vec (D)

        # Content side
        self.cb = ContentTower(meta_dim, hidden_dim)

        # Final fusion MLP
        fusion_in = self.cf_dim + hidden_dim
        self.out = nn.Sequential(
            nn.Linear(fusion_in, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim, 1)         # logits
        )

    # --------------------------------------------------------------------- #
    def forward(self, batch: dict[str, torch.Tensor]) -> tuple[torch.Tensor, torch.Tensor]:
        """
        Args:
            batch dict expects keys:
              • u_idx  – [B] long
              • i_idx  – [B] long
              • seq    – [B,T] long
              • meta   – [B, meta_dim] float
        Returns:
            logits (main head) ,  aux_logits (DIEN auxiliary)
        """
        fm1, attn_vec, aux_logits = self.cf(
            batch["u_idx"], batch["i_idx"], batch["seq"]
        )
        cf_out = torch.cat([fm1, attn_vec], dim=1)   # [B, cf_dim]
        cb_out = self.cb(batch["meta"])              # [B, hidden_dim]

        fused = torch.cat([cf_out, cb_out], dim=1)   # [B, fusion_in]
        logits = self.out(fused).squeeze(1)          # [B]

        return logits, aux_logits
