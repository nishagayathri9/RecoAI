# api/index.py

from backend.main import app

# Vercel uses "handler" as the entrypoint
handler = app
