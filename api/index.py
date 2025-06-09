# api/index.py

import os
import sys

# 1) Add project root to path so "backend" is importable
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

# 2) Import the FastAPI app instance from backend/main.py
from backend.main import app