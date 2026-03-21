FROM python:3.10-slim

# Set working directory di dalem container
WORKDIR /app

# Install tools dasar buat build library AI
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy requirements & install (Pake trik CPU lu tadi)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua file dari folder backend ke /app
COPY . .

# Hugging Face butuh User ID 1000 biar gak error permission
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Jalankan FastAPI di port 7860 (WAJIB!)
# Pake 'app:app' karena nama file lu 'app.py'
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]