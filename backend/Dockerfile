FROM python:3.10-slim

WORKDIR /app

# Install system dependencies and uv package manager
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* \
    && pip install uv

# Install python dependencies using uv (much faster than standard pip)
COPY requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

# Download NLTK data during build
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab')"

# Copy application source
COPY src/ /app/src/

# Command to run
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
