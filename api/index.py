# api/index.py

from fastapi import FastAPI
from backend.main import app as reco_app

# Create a root FastAPI that mounts your existing app at /api
app = FastAPI()

# All requests to /api/* will go into your FastAPI code (upload, predict, etc.)
app.mount("/api", reco_app)

# Vercel looks for “handler” as the entrypoint
handler = app
