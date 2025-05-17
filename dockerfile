# Start from a slim Python base
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your backend code
COPY backend/ ./backend

# Expose port 8080 for Uvicorn
EXPOSE 8080

# Launch Uvicorn on 0.0.0.0:8080
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
