# Menggunakan image Python versi slim untuk memperkecil ukuran
FROM python:3.12-slim

# Menentukan direktori kerja di dalam kontainer
WORKDIR /app

# Menginstal dependensi sistem yang dibutuhkan XGBoost (wajib untuk image slim)
RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*

# Menyalin file requirements.txt dan menginstal library Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Menyalin seluruh kode proyek ke dalam kontainer
COPY . .

# Mengekspos port 8080 (standar Cloud Run)
EXPOSE 8080

# Menjalankan server FastAPI menggunakan Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]