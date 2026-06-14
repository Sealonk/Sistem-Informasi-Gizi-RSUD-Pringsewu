# Skenario Blackbox Testing Kategori Perhitungan Gizi

File Selenium IDE: `perhitungan-blackbox.side`

Base URL default: `http://localhost:3000`

Backend API dari `.env`: `http://localhost:5000`

Catatan sebelum menjalankan:

- Jalankan frontend dengan `npm start`.
- Pastikan backend aktif di `http://localhost:5000`.
- Import file `tests/selenium/perhitungan-blackbox.side` ke Selenium IDE.
- Skenario TC-PH-006 hingga TC-PH-025 bergantung pada backend yang mengembalikan minimal 1 data pasien.
- Token dummy digunakan untuk bypass autentikasi pada setiap skenario.

**Menjalankan Test Automation**:

| Tipe Test | Command | Lokasi | Output |
|-----------|---------|--------|--------|
| **Visual Tests (Selenium IDE)** | Import ke Selenium IDE | `tests/selenium/perhitungan-blackbox.side` | 12 test cases (TC-PH-001 s/d TC-PH-012) |
| **CLI Automation** | `npm run test:selenium:perhitungan:visual` | `scripts/run-perhitungan-visual.cjs` | 12 test cases automated |

**Test Coverage Saat Ini**: 12 test case yang sudah diimplementasi di file SIDE

**Proposal Tambahan**: TC-PH-013 sampai TC-PH-026 (14 skenario) untuk fase implementasi berikutnya

---

## Ringkasan Test Coverage

### **BAGIAN 1: PILIH PASIEN (TC-PH-001 s/d TC-PH-008) ✅ IMPLEMENTASI**
- ✅ TC-PH-001: Menampilkan halaman pilih pasien
- ✅ TC-PH-002: Filter periode (Hari Ini, Minggu Ini, Bulan Ini)
- ✅ TC-PH-003: Filter custom tanpa tanggal - error validation
- ✅ TC-PH-004: Pencarian pasien berdasarkan nama
- ✅ TC-PH-005: Tombol kembali ke portal
- ✅ TC-PH-006: Modal konfirmasi pilih pasien
- ✅ TC-PH-007: Membatalkan pemilihan pasien
- ✅ TC-PH-008: Navigasi ke assessment setelah konfirmasi

### **BAGIAN 2: ASSESSMENT (TC-PH-009 s/d TC-PH-011 + TC-PH-012 E2E) ✅ IMPLEMENTASI**
- TC-PH-009 sampai TC-PH-011: (Tercakup dalam TC-PH-012)
- ✅ TC-PH-012: E2E Workflow - Assessment → Hasil → Simpan lengkap

### **BAGIAN 3: HASIL PERHITUNGAN (Termasuk dalam TC-PH-012 E2E Test) ✅ IMPLEMENTASI**
- Mencakup: Verifikasi hasil, simpan data, success message

### **PROPOSAL TAMBAHAN UNTUK FASE BERIKUTNYA (TC-PH-013 s/d TC-PH-026) 📋 PLANNED**
- TC-PH-013: Validasi field Nama & RM (detail)
- TC-PH-014: Validasi Antropometri (6 skenario detail)
- TC-PH-015: Single Disease Selection
- TC-PH-016: Multiple Disease Selection
- TC-PH-017: Disease + Gender Validation
- TC-PH-018: Form Submission Success
- TC-PH-019: Modal Konfirmasi Perhitungan
- TC-PH-020: Cancel Calculation
- TC-PH-021: Hasil UI Display
- TC-PH-022: Data Perhitungan Akurat
- TC-PH-023: Elemen UI (Cards, Charts)
- TC-PH-024: Simpan & Modal Konfirmasi
- TC-PH-025: Success Message & Data Tersimpan
- TC-PH-026: Kembali dari Hasil

---

```
/perhitungan (Pilih Pasien)
    → Filter & Search
    → Klik "Pilih" pada baris pasien
    → Modal Konfirmasi "Pilih Pasien"
    → /assessment (Assessment Gizi)
    → Isi form assessment + validasi
    → Klik "Simpan & Lanjut"
    → Modal Konfirmasi "Hitung Gizi Pasien"
    → /hasil (Hasil Perhitungan)
    → Verifikasi & Simpan hasil
    → Success message
```

---

## BAGIAN 1: PILIH PASIEN (TC-PH-001 s/d TC-PH-008) - ✅ IMPLEMENTASI



Tujuan: Memastikan halaman `/perhitungan` menampilkan semua elemen antarmuka utama dengan benar setelah login.

Prasyarat: User telah login (token tersedia di `localStorage`).

Data uji: Tidak ada.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`.
3. Verifikasi judul `Perhitungan Gizi` tampil.
4. Verifikasi tombol filter `Semua` tampil.
5. Verifikasi tombol filter `Hari Ini` tampil.
6. Verifikasi tombol filter `Minggu Ini` tampil.
7. Verifikasi tombol filter `Bulan Ini` tampil.
8. Verifikasi tombol filter `Custom` tampil.
9. Verifikasi field pencarian `Cari berdasarkan Nama / No. RM` tampil.
10. Verifikasi tombol `Cari` tampil.
11. Verifikasi tombol `Reset Filter` tampil.
12. Verifikasi header kolom tabel `Nama Pasien` tampil.
13. Verifikasi tombol `Kembali ke Portal` tampil.

Hasil yang diharapkan: Seluruh elemen halaman pilih pasien tampil lengkap dan siap digunakan.

---

## TC-PH-002 - Filter Periode Data Pasien

Tujuan: Memastikan tombol filter periode dapat diklik dan mengubah status menjadi aktif (highlight biru).

Prasyarat: User berada di halaman `/perhitungan`.

Data uji: Filter = Hari Ini, kemudian Minggu Ini, kemudian Reset.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`.
3. Klik tombol filter `Hari Ini`.
4. Verifikasi tombol `Hari Ini` memiliki class aktif (background biru).
5. Klik tombol filter `Minggu Ini`.
6. Verifikasi tombol `Minggu Ini` memiliki class aktif.
7. Klik tombol `Reset Filter`.
8. Verifikasi tombol `Semua` kembali aktif setelah reset.

Hasil yang diharapkan: Filter periode berfungsi dengan benar dan dapat direset ke kondisi awal.

---

## TC-PH-003 - Filter Custom Tanpa Tanggal Menampilkan Pesan Error

Tujuan: Memastikan sistem menampilkan pesan error jika filter Custom dipilih tetapi tanggal tidak diisi saat klik Cari.

Prasyarat: User berada di halaman `/perhitungan`.

Data uji:

| Field | Nilai |
| --- | --- |
| Periode | Custom |
| Tanggal | kosong |

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`.
3. Klik tombol filter `Custom`.
4. Klik tombol `Cari` tanpa mengisi tanggal.
5. Verifikasi pesan error `Silakan pilih tanggal terlebih dahulu.` muncul.

Hasil yang diharapkan: Sistem menolak pencarian dan menampilkan pesan validasi tanggal.

---

## TC-PH-004 - Pencarian Pasien Berdasarkan Nama

Tujuan: Memastikan input pencarian dapat menerima teks dan tombol Cari dapat diklik.

Prasyarat: Backend aktif, user berada di halaman `/perhitungan`.

Data uji:

| Field | Nilai |
| --- | --- |
| Kata Kunci | Ahmad |

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`.
3. Masukkan teks `Ahmad` pada field pencarian.
4. Klik tombol `Cari`.
5. Verifikasi halaman tidak menampilkan eror fatal.
6. Verifikasi tabel pasien masih tampil di halaman.

Hasil yang diharapkan: Sistem memproses pencarian tanpa error dan tabel diperbarui.

---

## TC-PH-005 - Tombol Kembali ke Portal dari Halaman Perhitungan

Tujuan: Memastikan tombol Kembali ke Portal berhasil menavigasi user ke halaman `/portal`.

Prasyarat: User berada di halaman `/perhitungan`.

Data uji: Tidak ada.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`.
3. Klik tombol `Kembali ke Portal`.
4. Verifikasi URL berubah menjadi `/portal`.

Hasil yang diharapkan: Sistem berhasil menavigasi kembali ke halaman portal.

---

## TC-PH-006 - Menampilkan Modal Konfirmasi saat Memilih Pasien

Tujuan: Memastikan klik tombol Pilih pada baris pasien memunculkan modal konfirmasi.

Prasyarat: Backend aktif dan terdapat minimal 1 data pasien di tabel.

Data uji: Pasien pertama yang tampil di tabel.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`.
3. Tunggu baris pasien pertama muncul di tabel.
4. Klik tombol `Pilih` pada baris pasien pertama.
5. Verifikasi modal konfirmasi tampil dengan judul `Pilih Pasien`.
6. Verifikasi tombol `Batal` tersedia di dalam modal.
7. Verifikasi tombol `Pilih Pasien` (konfirmasi) tersedia di dalam modal.

Hasil yang diharapkan: Modal konfirmasi pilih pasien tampil dengan benar dan lengkap.

---

## TC-PH-007 - Membatalkan Pemilihan Pasien dari Modal

Tujuan: Memastikan tombol Batal di modal konfirmasi menutup modal tanpa berpindah ke halaman assessment.

Prasyarat: Modal konfirmasi Pilih Pasien sedang terbuka.

Data uji: Tidak ada.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`.
3. Tunggu baris pasien pertama muncul.
4. Klik tombol `Pilih` pada baris pasien pertama.
5. Tunggu modal konfirmasi muncul.
6. Klik tombol `Batal` di dalam modal.
7. Verifikasi modal tidak tampil lagi.
8. Verifikasi URL tetap di `/perhitungan`.

Hasil yang diharapkan: Modal ditutup dan user tetap berada di halaman pilih pasien.

---

## TC-PH-008 - Navigasi ke Assessment setelah Konfirmasi Pilih Pasien

Tujuan: Memastikan konfirmasi pilih pasien mengarahkan user ke halaman `/assessment`.

Prasyarat: Backend aktif, terdapat minimal 1 data pasien.

Data uji: Pasien pertama di tabel.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`.
3. Tunggu baris pasien pertama muncul.
4. Klik tombol `Pilih` pada baris pasien pertama.
5. Tunggu modal konfirmasi muncul.
6. Klik tombol `Pilih Pasien` di modal (konfirmasi).
7. Verifikasi URL berpindah ke `/assessment`.

Hasil yang diharapkan: Sistem berhasil menavigasi ke halaman assessment gizi pasien.

---

---

## APPENDIX: PROPOSAL SKENARIO FASE BERIKUTNYA (TC-PH-013 s/d TC-PH-026)

> **Status**: 📋 Documentation hanya - belum diimplementasi di file SIDE
> 
> Skenario berikut adalah proposal untuk expansion test coverage di fase implementasi berikutnya.
> Dokumentasi lengkap sudah tersedia di bawah ini untuk kemudahan implementasi.

---

## TC-PH-013 - Validasi Field Wajib Assessment: Nama & RM

Tujuan: Memastikan halaman `/assessment` menampilkan semua komponen form dengan benar setelah pasien dipilih.

Prasyarat: User telah memilih pasien dan berada di `/assessment`.

Data uji: Pasien pertama di tabel.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`, pilih pasien pertama, konfirmasi.
3. Verifikasi judul `Assessment Gizi` tampil.
4. Verifikasi bagian form `Identitas Pasien` tampil dengan data pasien.
5. Verifikasi field `Nama Pasien` pre-filled.
6. Verifikasi field `No. RM` pre-filled.
7. Verifikasi field `Umur` pre-filled.
8. Verifikasi bagian form `Antropometri` tampil.
9. Verifikasi field `Berat Badan (BB)` ada.
10. Verifikasi field `Tinggi Badan (TB)` ada.
11. Verifikasi bagian form `Jenis Perhitungan` tampil.
12. Verifikasi tombol `Simpan & Lanjut` tampil.
13. Verifikasi tombol `Kembali ke Pilih Pasien` tampil di header.

Hasil yang diharapkan: Seluruh komponen form assessment tampil lengkap dengan data pasien terpra-isi dan field-field terstruktur dengan baik.

---

## TC-PH-013 - Validasi Field Wajib Assessment: Nama & RM

Tujuan: Memastikan klik Simpan tanpa mengisi field Nama atau RM menampilkan error validasi.

Prasyarat: User berada di halaman `/assessment` dengan form kosong.

Data uji: 

| Field | Status |
| --- | --- |
| Nama Pasien | Dikosongkan |
| No. RM | Dikosongkan |
| Umur | Dikosongkan |

Langkah:

1. Suntikkan data pasien dummy (minimal) ke `localStorage`.
2. Buka halaman `/assessment` langsung.
3. Verifikasi form field ada tapi kosong.
4. Klik tombol `Simpan & Lanjut` tanpa mengisi field.
5. Verifikasi error message muncul di field Nama.
6. Verifikasi error message muncul di field RM.
7. Verifikasi halaman tetap di `/assessment`.

Hasil yang diharapkan: Sistem menampilkan validasi error dan mencegah form submission.

---

## TC-PH-014 - Validasi Antropometri: Berat Badan & Tinggi Badan

Tujuan: Memastikan field antropometri (BB, TB) tidak boleh kosong atau invalid (0, negatif, text).

Prasyarat: User berada di halaman `/assessment` dengan data pasien.

Data uji:

| Skenario | BB | TB | Expected |
| --- | --- | --- | --- |
| 1. BB kosong | (kosong) | 165 | Error: BB wajib |
| 2. TB kosong | 65 | (kosong) | Error: TB wajib |
| 3. BB zero | 0 | 165 | Error: BB > 0 |
| 4. TB zero | 65 | 0 | Error: TB > 0 |
| 5. BB text | abc | 165 | Error: BB harus angka |
| 6. TB text | 65 | xyz | Error: TB harus angka |

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`, pilih pasien, navigasi ke assessment.
3. Isi field Nama, RM, Umur dengan data valid.
4. Test Case 1: Kosongkan BB, isi TB 165, klik Simpan.
5. Verifikasi error "Berat Badan wajib diisi" tampil.
6. Test Case 2: Isi BB 65, kosongkan TB, klik Simpan.
7. Verifikasi error "Tinggi Badan wajib diisi" tampil.
8. Test Case 3: Isi BB 0, TB 165, klik Simpan.
9. Verifikasi error "Berat Badan harus > 0" tampil.
10. Test Case 4: Isi BB 65, TB 0, klik Simpan.
11. Verifikasi error "Tinggi Badan harus > 0" tampil.

Hasil yang diharapkan: Validasi antropometri bekerja dan mencegah form dengan data invalid.

---

## TC-PH-015 - Seleksi Penyakit Tunggal

Tujuan: Memastikan user dapat memilih satu penyakit dari dropdown dan form bisa disubmit.

Prasyarat: User berada di halaman `/assessment` dengan data valid.

Data uji:

| Field | Nilai |
| --- | --- |
| Penyakit | Diabetes Melitus (DM) |
| BB | 65 |
| TB | 165 |

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`, pilih pasien, navigasi ke assessment.
3. Isi field Nama, RM, Umur dengan data pasien.
4. Isi BB 65 dan TB 165.
5. Klik dropdown `Jenis Perhitungan` / Penyakit.
6. Pilih `Diabetes Melitus`.
7. Verifikasi opsi penyakit terpilih.
8. Klik tombol `Simpan & Lanjut`.
9. Tunggu modal "Hitung Gizi Pasien" muncul.
10. Verifikasi modal menampilkan data yang dipilih.

Hasil yang diharapkan: User berhasil memilih penyakit tunggal dan form dapat disubmit dengan baik.

---

## TC-PH-016 - Seleksi Multiple Penyakit

Tujuan: Memastikan user dapat memilih multiple penyakit (jika supported) atau mendapat warning untuk kombinasi tertentu.

Prasyarat: User berada di halaman `/assessment` dengan feature checkbox penyakit.

Data uji:

| Penyakit | Selected |
| --- | --- |
| Diabetes Melitus (DM) | ✓ |
| Chronic Kidney Disease (CKD) | ✓ |
| Stroke | ✗ |

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/perhitungan`, pilih pasien, navigasi ke assessment.
3. Isi field Nama, RM, Umur, BB, TB dengan data valid.
4. Cari checkbox/dropdown untuk multiple disease selection.
5. Pilih `Diabetes Melitus` dan `CKD`.
6. Verifikasi kedua penyakit terpilih (jika ada visual indicator).
7. Klik tombol `Simpan & Lanjut`.
8. Verifikasi form dapat disubmit dengan multiple diseases.

Hasil yang diharapkan: Multiple disease selection berfungsi atau system memberikan guidance jika kombinasi tidak valid.

---

## TC-PH-017 - Validasi Kombinasi Penyakit + Gender

Tujuan: Memastikan sistem menerapkan business rule untuk kombinasi penyakit + gender tertentu.

Prasyarat: Data pasien memiliki gender spesifik.

Data uji (contoh dari code):

| Gender | Penyakit | Expected Result |
| --- | --- | --- |
| Laki-laki | CKD tanpa DM | Validasi khusus CKD |
| Perempuan | Stroke | Validasi khusus Stroke |
| Laki-laki | DM + CKD | Normal calculation |

Langkah:

1. Suntikkan token dan pilih pasien dengan gender Laki-laki.
2. Navigasi ke assessment.
3. Isi data antropometri valid.
4. Pilih penyakit `CKD` (tanpa DM).
5. Verifikasi sistem menerapkan logic CKD specific.
6. Klik Simpan & Lanjut.
7. Verifikasi perhitungan sesuai CKD rules.
8. Repeat dengan Perempuan + Stroke untuk test gender-specific logic.

Hasil yang diharapkan: System menerapkan disease + gender validation rules dengan benar.

---

## TC-PH-018 - Form Submission Success - Navigasi ke Hasil

Tujuan: Memastikan form assessment yang valid berhasil disubmit dan navigasi ke halaman hasil.

Prasyarat: Semua field assessment valid dan terisii.

Data uji:

| Field | Nilai |
| --- | --- |
| Nama | Ahmad Hendra |
| RM | RM001 |
| Umur | 45 |
| BB | 75 |
| TB | 170 |
| Penyakit | Diabetes Melitus |

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka `/perhitungan`, pilih pasien, navigasi ke assessment.
3. Isi semua field assessment dengan data valid seperti tabel.
4. Klik tombol `Simpan & Lanjut`.
5. Tunggu modal konfirmasi "Hitung Gizi Pasien" muncul.
6. Klik tombol `Hitung & Lanjut` di modal.
7. Tunggu redirect ke halaman `/hasil`.
8. Verifikasi URL adalah `/hasil`.
9. Verifikasi data pasien dan perhitungan tampil di halaman.

Hasil yang diharapkan: Form submission berhasil dan system menavigasi ke halaman hasil dengan data calculation.

---

## TC-PH-019 - Modal Konfirmasi "Hitung Gizi Pasien"

Tujuan: Memastikan modal konfirmasi perhitungan muncul setelah form assessment disubmit.

Prasyarat: Form assessment sudah diisi dan Simpan diklik.

Data uji: Data assessment complete.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka `/perhitungan`, pilih pasien, navigasi ke assessment.
3. Isi semua field assessment.
4. Klik `Simpan & Lanjut`.
5. Tunggu modal muncul (timeout 3 detik).
6. Verifikasi modal title "Hitung Gizi Pasien" tampil.
7. Verifikasi modal body menampilkan ringkasan data assessment.
8. Verifikasi button `Hitung & Lanjut` ada.
9. Verifikasi button `Batal` ada.

Hasil yang diharapkan: Modal konfirmasi ditampilkan dengan lengkap sebelum proses perhitungan.

---

## TC-PH-020 - Cancel Calculation dari Modal

Tujuan: Memastikan user dapat membatalkan perhitungan dari modal konfirmasi.

Prasyarat: Modal konfirmasi "Hitung Gizi Pasien" sedang terbuka.

Data uji: Tidak ada.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Buka `/perhitungan`, pilih pasien, navigasi ke assessment.
3. Isi semua field assessment.
4. Klik `Simpan & Lanjut`.
5. Tunggu modal muncul.
6. Klik button `Batal` di modal.
7. Verifikasi modal tertutup.
8. Verifikasi halaman kembali ke assessment dengan data masih terisi.
9. Verifikasi user bisa edit form lagi dan resubmit.

Hasil yang diharapkan: Cancel button menutup modal dan user tetap di halaman assessment dengan data preserved.

---

## BAGIAN 3: HASIL PERHITUNGAN (7 SKENARIO)

---

## TC-PH-021 - Menampilkan Halaman Hasil Perhitungan

Tujuan: Memastikan halaman `/hasil` menampilkan semua komponen hasil perhitungan dengan benar.

Prasyarat: User telah menyelesaikan assessment dan sistem selesai menghitung.

Data uji: Hasil perhitungan dari assessment valid.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Navigasi flow: `/perhitungan` → pilih pasien → `/assessment` → isi & submit → `/hasil`.
3. Verifikasi halaman `/hasil` terbuka.
4. Verifikasi header/title hasil tampil.
5. Verifikasi section `Identitas Pasien` tampil dengan data pasien.
6. Verifikasi section `Ringkasan Hasil` tampil dengan summary cards.
7. Verifikasi kartu hasil (BMI, Status Gizi, Kebutuhan Kalori, dll) tampil.
8. Verifikasi ada chart/grafik visualisasi hasil.
9. Verifikasi button `Simpan` ada.
10. Verifikasi button `Kembali` ada.

Hasil yang diharapkan: Halaman hasil menampilkan semua komponen dengan format yang jelas dan terstruktur.

---

## TC-PH-022 - Verifikasi Data Perhitungan Akurat

Tujuan: Memastikan data perhitungan yang ditampilkan akurat sesuai formula yang dihitung.

Prasyarat: Halaman hasil terbuka dengan data perhitungan.

Data uji:

| Parameter Input | Hasil Expected | Formula |
| --- | --- | --- |
| BB: 75kg, TB: 170cm | BMI: 25.95 | BB / (TB/100)^2 |
| Status Gizi | Normal/Overweight | Based on BMI |
| Kebutuhan Kalori | Calculate | Based on disease + parameters |

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Navigasi ke halaman hasil dengan data: BB=75kg, TB=170cm.
3. Cari komponen yang menampilkan hasil BMI.
4. Verifikasi BMI = 75 / (1.7)^2 = 25.95.
5. Verifikasi Status Gizi sesuai range BMI.
6. Cari komponen Kebutuhan Kalori/Nutrisi.
7. Verifikasi perhitungan kalori sesuai formula (contoh: Harris-Benedict untuk gender spesifik).
8. Verifikasi semua hasil menampilkan angka yang reasonable (bukan 0 atau infinity).

Hasil yang diharapkan: Semua hasil perhitungan menunjukkan nilai yang akurat sesuai formula matematis.

---

## TC-PH-023 - Verifikasi Elemen UI Hasil: Summary Cards, Charts, Rekomendasi

Tujuan: Memastikan halaman hasil menampilkan elemen UI yang informatif dan user-friendly.

Prasyarat: Halaman hasil terbuka.

Data uji: Hasil perhitungan complete.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Navigasi ke halaman hasil.
3. Verifikasi summary card `BMI` ada dengan value dan kategori.
4. Verifikasi summary card `Status Gizi` ada dengan color indicator.
5. Verifikasi summary card `Kebutuhan Kalori` ada.
6. Verifikasi summary card `Makronutrisi` ada (Protein, Karbo, Lemak).
7. Verifikasi ada chart/grafik untuk visualisasi makronutrisi (pie chart atau bar chart).
8. Verifikasi ada section `Rekomendasi` dengan teks rekomendasi detail.
9. Verifikasi layout responsive dan elemen tidak overlap.

Hasil yang diharapkan: Semua elemen UI hasil tampil dengan visual yang clear dan informative.

---

## TC-PH-024 - Tombol Simpan & Modal Konfirmasi Simpan

Tujuan: Memastikan user dapat menyimpan hasil perhitungan dan modal konfirmasi muncul.

Prasyarat: Halaman hasil terbuka.

Data uji: Hasil perhitungan valid.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Navigasi ke halaman hasil.
3. Cari tombol `Simpan` di halaman.
4. Klik tombol `Simpan`.
5. Tunggu modal konfirmasi "Simpan Perhitungan" muncul (timeout 3 detik).
6. Verifikasi modal menampilkan data yang akan disimpan.
7. Verifikasi button `Simpan` (confirm) ada.
8. Verifikasi button `Batal` ada.
9. Klik button `Simpan` untuk confirm.
10. Tunggu API call ke backend (loading indicator).

Hasil yang diharapkan: Sistem menampilkan modal konfirmasi dan siap menerima input user untuk save.

---

## TC-PH-025 - Verifikasi Success Message - Data Tersimpan

Tujuan: Memastikan sistem menampilkan success message ketika data perhitungan berhasil disimpan ke backend.

Prasyarat: Modal konfirmasi simpan terbuka dan user click Simpan.

Data uji: Hasil perhitungan dengan data valid.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Navigasi ke halaman hasil.
3. Klik tombol `Simpan`.
4. Tunggu modal konfirmasi.
5. Klik button `Simpan` di modal.
6. Tunggu loading indicator selesai (timeout 8 detik).
7. Verifikasi success message muncul: "Perhitungan berhasil disimpan" atau similar.
8. Verifikasi toast/alert notification dengan icon success.
9. Verifikasi backend API call succeeded (check network tab atau API logs).
10. Verifikasi data tersimpan dengan ID/reference di database.

Hasil yang diharapkan: System menampilkan success confirmation dan data berhasil tersimpan di backend.

---

## TC-PH-026 - Tombol Kembali dari Hasil

Tujuan: Memastikan user dapat navigasi kembali dari halaman hasil ke daftar pasien.

Prasyarat: User berada di halaman `/hasil`.

Data uji: Tidak ada.

Langkah:

1. Suntikkan token dummy ke `localStorage`.
2. Navigasi flow lengkap ke halaman hasil.
3. Cari tombol `Kembali` atau `Kembali ke Pilih Pasien`.
4. Klik tombol tersebut.
5. Verifikasi URL berubah ke `/perhitungan`.
6. Verifikasi halaman pilih pasien tampil dengan list pasien.
7. Verifikasi user dapat melakukan perhitungan pasien berikutnya.

Hasil yang diharapkan: User berhasil navigasi kembali ke halaman pilih pasien dan workflow dapat diulang.

---

## Catatan Eksekusi

### Status Implementasi

**✅ Implemented (12 Test Cases)**
- TC-PH-001 s/d TC-PH-008: Pilih Pasien workflow (8 test)
- TC-PH-009 s/d TC-PH-011: Assessment supporting tests (3 test)
- TC-PH-012: E2E Workflow - comprehensive test covering Pilih Pasien → Assessment → Hasil → Simpan (1 test)

**📋 Proposal untuk Fase Berikutnya (14 Test Cases)**
- TC-PH-013 s/d TC-PH-026: Detailed skenario untuk Assessment dan Hasil Perhitungan
- Documentation sudah siap untuk implementasi ini

### Menjalankan Test (12 Test Cases Implementasi)

**CLI Command**:
```bash
npm run test:selenium:perhitungan:visual
```

**Expected Output**:
```
==================================================
              RINGKASAN PENGUJIAN VISUAL          
==================================================
[✓] TC-PH-001 - Menampilkan Halaman Pilih Pasien - (PASSED)
[✓] TC-PH-002 - Filter Periode Data Pasien - (PASSED)
[✓] TC-PH-003 - Filter Custom Error - (PASSED)
[✓] TC-PH-004 - Pencarian Pasien - (PASSED)
[✓] TC-PH-005 - Kembali ke Portal - (PASSED)
[✓] TC-PH-006 - Modal Konfirmasi Pilih Pasien - (PASSED)
[✓] TC-PH-007 - Batal Pemilihan Pasien - (PASSED)
[✓] TC-PH-008 - Navigasi ke Assessment - (PASSED)
[✓] TC-PH-012 - E2E Workflow (Pilih → Assessment → Hasil → Simpan) - (PASSED)
[✓] TC-PH-009 - Assessment UI Validation - (PASSED)
[✓] TC-PH-010 - Back Navigation - (PASSED)
[✓] TC-PH-011 - Cancel Modal - (PASSED)
==================================================
Total Skenario : 12
Berhasil       : 12
Gagal          : 0
Status Akhir   : SUCCESS
==================================================
```

### Setup Prasyarat

1. **Backend Running**:
   ```bash
   # Di folder backend
   npm start
   # API server berjalan di http://localhost:5000
   ```

2. **Frontend Running**:
   ```bash
   # Di folder frontend
   npm start
   # React dev server berjalan di http://localhost:3000
   ```

3. **Database**:
   - Minimal 1 data pasien di database
   - User credentials: `admin` / `admin123` aktif
   - API endpoints: `/api/auth/login`, `/api/pasien/list`, `/api/perhitungan/preview`, `/api/perhitungan/save`

### Timing & Performance

| Aspect | Value |
|--------|-------|
| Total Test Cases (Implemented) | 12 |
| Average Time per Test | 5-10 seconds |
| Total Execution Time | 2-3 minutes |
| Timeout for Navigation | 8-12 seconds |
| Browser Hold Time | 5 seconds (for inspection) |

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Test timeout on navigation | Pastikan frontend/backend responsive, tunggu loading |
| Element not found | Update selector di SIDE file, verifikasi HTML structure |
| Token validation failed | Pastikan backend login endpoint berfungsi |
| Modal tidak muncul | Check browser console untuk error, validasi form sebelumnya |
| Result calculation wrong | Verify backend calculation formula |

### Test Data Requirements

#### Pasien Data (Minimal 1)
```json
{
  "nama": "Ahmad Hendra",
  "no_rm": "RM001",
  "umur": 45,
  "gender": "Laki-laki",
  "bb": 75,
  "tb": 170
}
```

#### Disease Options (Required)
- Diabetes Melitus (DM)
- Chronic Kidney Disease (CKD)
- Stroke
- (Optional) Kombinasi DM + CKD

#### Expected Hasil Fields
- BMI
- Status Gizi
- Kebutuhan Kalori
- Makronutrisi (Protein, Karbohidrat, Lemak)
- Rekomendasi Diet

---

## Integrasi dengan Test Suite Lain

Test perhitungan dapat diintegrasikan dengan:

```bash
# Urutan eksekusi yang disarankan:
npm run test:selenium:login           # Verify login works
npm run test:selenium:portal          # Verify portal menu
npm run test:selenium:perhitungan     # Verify perhitungan workflow
npm run test:selenium:riwayat         # Verify history tracking
npm run test:selenium:ringkasan       # Verify dashboard
```

---

## Dokumentasi Tambahan

- **Backend API**: Lihat dokumentasi endpoint di backend repo
- **Assessment Formula**: Lihat `src/pages/perhitungan/hasilHelpers.js` untuk detail perhitungan
- **Component Structure**: Lihat folder `src/components/perhitungan/` untuk UI components
- **Business Rules**: Lihat `src/hooks/useAssessmentValidation.js` untuk validation logic

Langkah:

1. **Login & Dapatkan Token**
   - Script melakukan POST ke `/api/auth/login` dengan credentials `admin`/`admin123`
   - Ekstrak JWT token dari response
   - Inject token ke `localStorage['token']`

2. **Halaman Pilih Pasien**
   - Buka halaman `/perhitungan`
   - Verifikasi judul `Perhitungan Gizi` tampil
   - Tunggu elemen tabel pasien dimuat

3. **Pilih Pasien**
   - Tunggu baris pasien pertama muncul
   - Klik tombol `Pilih` pada pasien pertama
   - Tunggu modal konfirmasi muncul
   - Verifikasi modal berisi judul "Pilih Pasien"

4. **Konfirmasi Pemilihan Pasien**
   - Klik tombol `Pilih Pasien` di modal
   - Tunggu modal tertutup
   - Sistem melakukan navigasi otomatis

5. **Navigasi ke Assessment**
   - Tunggu redirect ke halaman `/assessment` (timeout: 8 detik)
   - Verifikasi URL berisi `/assessment`

6. **Verifikasi Halaman Assessment**
   - Verifikasi judul `Assessment Gizi` tampil
   - Pastikan form sections terelemenkan dengan benar

7. **Isi Data Assessment**
   - Populate field-field form dengan data dummy
   - Minimal: Pilih 1-2 dropdown options untuk validasi form
   - Tidak perlu mengisi semua field (cukup field yang required)

8. **Submit Assessment Form**
   - Klik tombol `Simpan & Lanjut` (atau `Simpan`)
   - Tunggu form submission processing

9. **Konfirmasi Modal Perhitungan**
   - Tunggu modal "Hitung Gizi Pasien" muncul (timeout: 5 detik)
   - Verifikasi modal berisi tombol `Hitung & Lanjut`
   - Klik tombol `Hitung & Lanjut`
   - Tunggu processing perhitungan (dengan indicator TensorFlow/ML processing)

10. **Navigasi ke Halaman Hasil**
    - Tunggu redirect ke halaman `/hasil` (timeout: 12 detik)
    - Verifikasi URL berisi `/hasil`
    - Tunggu komponen hasil termuat

11. **Verifikasi Halaman Hasil Perhitungan**
    - Verifikasi halaman hasil menampilkan elemen-elemen:
      - Header/Title hasil
      - Summary cards dengan data perhitungan
      - Grafik/Chart hasil
      - Button aksi (Simpan, Kembali, dll)

12. **Simpan Perhitungan**
    - Cari tombol `Simpan` di halaman hasil
    - Klik tombol `Simpan`
    - Tunggu modal konfirmasi simpan muncul (jika ada)
    - Jika ada modal: klik tombol `Simpan` untuk konfirmasi
    - Tunggu API call processing (timeout: 8 detik)

13. **Verifikasi Penyimpanan Berhasil**
    - Tunggu success message muncul (text pattern: "berhasil")
    - Verifikasi halaman tidak menampilkan error
    - Verifikasi data telah tersimpan di backend

Hasil yang diharapkan:
- ✅ User berhasil login dengan valid token
- ✅ Pasien berhasil dipilih dari daftar
- ✅ Navigasi ke assessment halaman berhasil
- ✅ Form assessment dapat diisi dan disubmit
- ✅ Perhitungan gizi diproses tanpa error
- ✅ Halaman hasil menampilkan hasil perhitungan
- ✅ Data perhitungan berhasil disimpan
- ✅ Sistem menampilkan konfirmasi keberhasilan

**Catatan Eksekusi**:
- Test ini menggunakan automation script: `scripts/run-perhitungan-complete.cjs`
- Jalankan dengan: `npm run test:selenium:perhitungan:complete`
- Total execution time: ~2-3 menit
- Browser window tetap terbuka 5 detik setelah selesai untuk review
- Detailed step-by-step reporting ditampilkan di console

**Elemen yang Diverfifikasi**:
- Page navigation dan URL changes
- Modal appearance dan button interactions
- Form input dan submission
- API call success (token, auth, perhitungan)
- Error handling dan validation
- Success confirmation messages
- Data persistence di backend
