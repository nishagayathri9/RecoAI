# train_utils.py

import torch
import numpy as np
from sklearn.metrics import roc_auc_score, accuracy_score, classification_report

def train_model(
    model,
    train_loader,
    val_loader,
    optimizer,
    criterion,
    device,
    epochs,
    aux_weight=0.65
):
    """
    Train `model` for `epochs` epochs on train_loader, validate on val_loader,
    keep the best model (by val AUC), and return it.
    """
    best_auc = 0.0
    best_state = None

    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0

        for batch_x, batch_y in train_loader:
            batch_x = {k: v.to(device) for k, v in batch_x.items()}
            batch_y = batch_y.to(device)

            optimizer.zero_grad()
            preds, aux = model(batch_x)

            loss = criterion(preds, batch_y) \
                   + aux_weight * criterion(aux, batch_y)
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * batch_y.size(0)

        avg_train_loss = total_loss / len(train_loader.dataset)

        # --- validation pass ---
        model.eval()
        val_true = []
        val_pred = []
        with torch.no_grad():
            for batch_x, batch_y in val_loader:
                batch_x = {k: v.to(device) for k, v in batch_x.items()}
                batch_y = batch_y.to(device)

                preds, _ = model(batch_x)
                val_true.extend(batch_y.cpu().numpy())
                val_pred.extend(torch.sigmoid(preds).cpu().numpy())

        val_auc = roc_auc_score(val_true, val_pred)
        print(f"Epoch {epoch:2d} | Train Loss {avg_train_loss:.4f} | Val AUC {val_auc:.4f}")

        if val_auc > best_auc:
            best_auc = val_auc
            best_state = model.state_dict()

    # restore best
    if best_state is not None:
        model.load_state_dict(best_state)

    return model


def evaluate_model(model, loader, device):
    """
    Run `model` on `loader` and print Test AUC, accuracy, and classification report.
    Returns (auc, accuracy).
    """
    model.eval()
    all_true = []
    all_pred = []

    with torch.no_grad():
        for batch_x, batch_y in loader:
            batch_x = {k: v.to(device) for k, v in batch_x.items()}
            logits, _ = model(batch_x)
            probs = torch.sigmoid(logits).cpu().numpy()

            all_pred.extend(probs)
            all_true.extend(batch_y.numpy())

    # binarize predictions
    pred_bin = (np.array(all_pred) > 0.5).astype(int)
    auc = roc_auc_score(all_true, all_pred)
    acc = accuracy_score(all_true, pred_bin)

    print(f"\n>>> Test AUC:      {auc:.4f}")
    print(f">>> Test Accuracy:{acc:.4f}\n")
    print(classification_report(all_true, pred_bin))

    return auc, acc
