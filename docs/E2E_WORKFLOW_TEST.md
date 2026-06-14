# E2E Workflow Test - Perhitungan Gizi Lengkap

## Deskripsi
Test end-to-end yang mengotomatisasi workflow lengkap perhitungan gizi pasien, dari pemilihan pasien hingga penyimpanan hasil perhitungan.

## Workflow yang Diuji
```
Pilih Pasien → Konfirmasi Pasien → Assessment → Konfirmasi Perhitungan → Hasil → Simpan → Verifikasi Sukses
```

## Test Steps

| # | Step | Aksi | Verifikasi |
|---|------|------|-----------|
| 1 | Buka Halaman Pilih Pasien | Navigate ke `/perhitungan` dengan token valid | Header "Perhitungan Gizi" tampil |
| 2 | Pilih Pasien Pertama | Click button "Pilih" pada pasien pertama | Modal konfirmasi muncul |
| 3 | Konfirmasi Modal Pilih Pasien | Click "Pilih Pasien" button | Modal tertutup |
| 4 | Navigasi ke Assessment | Tunggu automatic redirect | URL berisi `/assessment` |
| 5 | Verifikasi Assessment Page | - | Header "Assessment Gizi" tampil |
| 6 | Isi Data Assessment | Populate form fields dengan data dummy | Form fields terisi |
| 7 | Submit Assessment | Click "Simpan" button | Form submission berhasil |
| 7.5 | Konfirmasi Modal Perhitungan | Click "Hitung & Lanjut" button | Modal dikonfirmasi |
| 8 | Navigasi ke Hasil | Tunggu redirect ke hasil page | URL berisi `/hasil` |
| 9 | Verifikasi Hasil Page | - | Hasil page components tampil |
| 10 | Simpan Perhitungan | Click "Simpan" button & konfirmasi | Perhitungan tersimpan |
| 11 | Verifikasi Sukses | Tunggu success message | Verifikasi berhasil |

## Menjalankan Test

### Menggunakan NPM Script
```bash
npm run test:selenium:perhitungan:complete
```

### Menjalankan Langsung
```bash
node scripts/run-perhitungan-complete.cjs
```

## Output Test
```
==================================================
        RINGKASAN WORKFLOW PERHITUNGAN LENGKAP       
==================================================
Workflow: Perhitungan Gizi Lengkap (Pilih Pasien → Assessment → Hasil → Simpan)
Status: ✓ SUCCESS
✓ Step 1: PASSED
✓ Step 2: PASSED
✓ Step 3: PASSED
✓ Step 4: PASSED
✓ Step 5: PASSED
✓ Step 6: PASSED
✓ Step 7: PASSED
✓ Step 8: PASSED
✓ Step 9: PASSED
✓ Step 10: PASSED
✓ Step 11: PASSED
==================================================
Total Steps: 11
Status Akhir: SUCCESS
==================================================
```

## Prasyarat Teknis
- React dev server berjalan di `http://localhost:3000`
- Backend API berjalan di `http://localhost:5000`
- User credentials ada: `admin` / `admin123`
- Chrome/Chromium browser tersedia di system
- Selenium WebDriver terpasang via `npm install`

## Autentikasi
Script secara otomatis:
1. Login ke backend menggunakan credentials `admin`/`admin123`
2. Mendapatkan JWT token dari API
3. Inject token ke localStorage sebelum navigasi
4. Semua API calls dilakukan dengan Authorization header yang valid

## Komponen yang Diuji
- ✅ PilihPasien.js - Patient selection & filtering
- ✅ Assessment.js - Assessment form & validation
- ✅ HasilPerhitungan.js - Results display & save functionality
- ✅ ConfirmationModal - Modal interactions
- ✅ Protected routes & authentication flow

## Catatan Penting
- Test menggunakan dummy assessment data (minimal form field population)
- Success verification menggunakan text search sebagai fallback
- Total execution time: ~2-3 menit per run
- Browser window tetap terbuka 5 detik setelah test selesai untuk review

## Troubleshooting

### Issue: "Token tidak valid"
**Solusi**: Pastikan backend API berjalan dan credentials benar

### Issue: "Wait timed out"
**Solusi**: Periksa apakah frontend/backend server responsive, tingkatkan timeout

### Issue: "Element not found"
**Solusi**: Mungkin structure HTML berubah, update XPath selectors di script

## Integrasi dengan Test Suite Lain
Script ini dapat diintegrasikan dengan:
- `test:selenium:perhitungan:visual` - Individual visual tests (11 test cases)
- `test:selenium:login` - Login automation tests
- `test:selenium:portal` - Portal page tests
- `test:selenium:riwayat` - History/Riwayat tests

## Hasil Terbaru
- **Total Steps**: 11
- **Passed**: 11 ✓
- **Failed**: 0
- **Status**: SUCCESS ✓
- **Execution Date**: 2024-12-08
