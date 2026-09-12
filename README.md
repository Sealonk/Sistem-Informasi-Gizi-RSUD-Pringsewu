# Sistem-Informasi-Gizi-RSUD-Pringsewu

## Prediksi pasien

Alur: `/portal` -> `/prediksi-pasien` (informasi historis) -> `/prediksi-pasien/prediksi` (form dan hasil).

- `GET /api/info-historis`: tanggal awal/akhir, jumlah hari, dan total pasien.
- `POST /api/predict`: body `{ "hari_kedepan": 7 }`, dengan jumlah hari 1-365.
- Grafik, ringkasan, tabel, dan CSV menggunakan respons AI, tanpa prediksi buatan frontend.

### Pengembangan lokal

Jalankan layanan AI pada `http://127.0.0.1:8000` dan frontend dengan `npm start`.
Restart server frontend setelah penambahan `src/setupProxy.js`. Proxy meneruskan
`/prediction-api/api/*` ke `http://127.0.0.1:8000/api/*`, sehingga browser dapat
mengakses API dari port frontend (termasuk 3001) tanpa perubahan CORS backend.
Proxy ini tidak meneruskan token login aplikasi ke layanan AI.

### Deployment

`setupProxy.js` hanya digunakan development server. Pada hosting produksi,
konfigurasikan reverse proxy `/prediction-api/api/*` menuju layanan AI `/api/*`,
atau isi `REACT_APP_PREDIKSI_API_URL` dengan origin layanan AI sebelum build.
Jika memakai origin berbeda, layanan AI harus mengizinkan origin frontend melalui CORS.
