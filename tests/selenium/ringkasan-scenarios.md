# Skenario Pengujian Blackbox — Modul Ringkasan Sistem

Dokumen ini mendokumentasikan skenario pengujian blackbox menggunakan Selenium IDE untuk modul **Ringkasan Sistem** pada Sistem Informasi Gizi RSUD Pringsewu, dengan pemetaan terhadap aspek-aspek fokus pengujian wajib.

---

## 1. Pemetaan Aspek Fokus Pengujian

1. **Kebutuhan Fungsional (Functional Testing)**: Memastikan setiap fitur dan fungsi berjalan sesuai spesifikasi kebutuhan (requirement) dashboard ringkasan.
2. **Antarmuka Pengguna (User Interface/UI)**: Memeriksa apakah tampilan visual, tombol, menu, kartu statistik, grafik donut, dan tabel riwayat disajikan dengan benar.
3. **Kesalahan Fungsionalitas (Functionality Errors)**: Menemukan bug terkait fungsi yang tidak berjalan atau salah memproses data (misalnya data statistik tidak sinkron dengan database).
4. **Masukan dan Keluaran (Input/Output)**: Menguji apakah data dari API dashboard ditampilkan secara akurat sebagai keluaran visual di halaman ringkasan.
5. **Kesalahan Inisialisasi dan Terminasi (Initialization & Termination)**: Memeriksa apakah halaman dapat dimulai (loading data API) dan ditutup (navigasi keluar) dengan normal tanpa error.

---

## 2. Prasyarat Pengujian
1. **Pengguna Terautentikasi**: Token JWT valid disuntikkan ke `localStorage` sebelum membuka halaman.
2. **Backend Aktif**: Backend berjalan di `http://localhost:5000` karena halaman ini memuat data statistik dari Dashboard API.
3. **Data Riwayat Tersedia**: Minimal ada 1 data riwayat perhitungan di database.

---

## 3. Daftar Skenario Pengujian

### **TC-RS-001: Inisialisasi & Tampilan Antarmuka Halaman Ringkasan Sistem**
* **Fokus Pengujian**: 
  * `[UI]` Antarmuka Pengguna
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memverifikasi bahwa halaman Ringkasan Sistem berhasil diinisialisasi dari Dashboard API dan menampilkan seluruh elemen antarmuka utama secara lengkap.
* **Langkah-Langkah**:
  1. Suntikkan token JWT ke `localStorage`.
  2. Buka halaman `/ringkasan-sistem`.
  3. Tunggu judul `"Ringkasan Sistem"` tampil (bukti loading API selesai).
  4. Verifikasi breadcrumb `"Beranda > Ringkasan Sistem"` tampil.
  5. Verifikasi badge `"Live Dashboard"` tampil.
  6. Verifikasi tanggal dan jam aktif tampil di header.
  7. Verifikasi bagian `"Aksi Cepat Pelayanan"` tampil.
  8. Verifikasi bagian `"Ringkasan Status Gizi"` tampil.
  9. Verifikasi bagian `"Rata-rata Hasil Perhitungan"` tampil.
  10. Verifikasi bagian `"Distribusi Penyakit"` tampil.
  11. Verifikasi bagian `"Riwayat Perhitungan Terakhir"` tampil.
  12. Verifikasi tombol `"Kembali ke Portal"` tampil di header.
* **Hasil yang Diharapkan**: Seluruh elemen antarmuka dimuat secara lengkap tanpa error inisialisasi.

---

### **TC-RS-002: Kartu Statistik Dashboard (Total Perhitungan, Hari Ini, Total Riwayat)**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
  * `[Bug]` Kesalahan Fungsionalitas
* **Tujuan**: Memastikan 3 kartu statistik dashboard (Total Perhitungan, Perhitungan Hari Ini, Total Riwayat) menampilkan data numerik yang valid dari API.
* **Langkah-Langkah**:
  1. Buka halaman `/ringkasan-sistem`.
  2. Tunggu data dimuat (kartu statistik muncul).
  3. Verifikasi kartu `"Total Perhitungan"` tampil dengan label `"Selama 1 bulan terakhir"`.
  4. Verifikasi kartu `"Perhitungan Hari Ini"` tampil dengan label `"Data hari ini"`.
  5. Verifikasi kartu `"Total Riwayat"` tampil dengan label `"Data tersimpan"`.
* **Hasil yang Diharapkan**: Ketiga kartu statistik menampilkan data numerik valid yang disinkronkan dari API dashboard tanpa bug nilai kosong atau NaN.

---

### **TC-RS-003: Rata-rata Nutrisi & Distribusi Penyakit**
* **Fokus Pengujian**: 
  * `[Input/Output]` Masukan dan Keluaran
  * `[Bug]` Kesalahan Fungsionalitas
* **Tujuan**: Memastikan panel Rata-rata Hasil Perhitungan (Energi, Protein, Lemak, Karbohidrat) dan panel Distribusi Penyakit menampilkan data keluaran yang sesuai dari API.
* **Langkah-Langkah**:
  1. Buka halaman `/ringkasan-sistem`.
  2. Tunggu data dimuat.
  3. Verifikasi label `"Energi"` tampil di panel Rata-rata.
  4. Verifikasi label `"Protein"` tampil di panel Rata-rata.
  5. Verifikasi label `"Lemak"` tampil di panel Rata-rata.
  6. Verifikasi label `"Karbohidrat"` tampil di panel Rata-rata.
  7. Verifikasi panel `"Distribusi Penyakit"` menampilkan catatan `"Distribusi berdasarkan penyakit utama pasien."`.
* **Hasil yang Diharapkan**: Seluruh data rata-rata nutrisi dan distribusi penyakit dari API tervisualisasi dengan benar.

---

### **TC-RS-004: Navigasi Aksi Cepat (Perhitungan & Riwayat)**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tombol aksi cepat "Mulai Perhitungan Gizi" dan "Lihat Riwayat Asuhan" berfungsi mengalihkan rute ke halaman yang sesuai tanpa error.
* **Langkah-Langkah**:
  1. Buka halaman `/ringkasan-sistem`.
  2. Klik tombol `"Mulai Perhitungan Gizi"`.
  3. Verifikasi rute berubah ke `/perhitungan`.
  4. Kembali ke `/ringkasan-sistem`.
  5. Klik tombol `"Lihat Riwayat Asuhan"`.
  6. Verifikasi rute berubah ke `/riwayat`.
* **Hasil yang Diharapkan**: Kedua navigasi aksi cepat bekerja lancar tanpa crash.

---

### **TC-RS-005: Tabel Riwayat Terakhir & Navigasi Detail**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[UI]` Antarmuka Pengguna
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tabel Riwayat Perhitungan Terakhir menampilkan data pasien dan tombol detail berfungsi mengalihkan ke halaman riwayat detail.
* **Langkah-Langkah**:
  1. Buka halaman `/ringkasan-sistem`.
  2. Tunggu tabel riwayat terakhir muncul (baris pertama tabel ter-render).
  3. Verifikasi kolom header tabel ("Pasien", "Tgl Masuk", "Energi", dll.) tampil.
  4. Klik tombol Detail (ikon panah) pada baris pertama tabel.
  5. Verifikasi rute berubah ke `/riwayat/:id` (pattern `glob:*/riwayat/*`).
* **Hasil yang Diharapkan**: Navigasi ke detail riwayat dari tabel ringkasan berhasil tanpa error.

---

### **TC-RS-006: Tombol Kembali ke Portal & Lihat Semua Riwayat**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tombol "Kembali ke Portal" dan "Lihat Semua" berfungsi dengan benar untuk terminasi halaman ringkasan.
* **Langkah-Langkah**:
  1. Buka halaman `/ringkasan-sistem`.
  2. Klik tombol `"Kembali ke Portal"` di header.
  3. Verifikasi rute berubah ke `/portal`.
  4. Kembali ke `/ringkasan-sistem`.
  5. Klik tombol `"Lihat Semua"` di bagian riwayat.
  6. Verifikasi rute berubah ke `/riwayat`.
* **Hasil yang Diharapkan**: Kedua tombol terminasi/navigasi berfungsi normal.

---

## 4. Hasil Eksekusi Pengujian Otomatis (PASS)

Seluruh 6 skenario pengujian di atas telah dijalankan menggunakan runner Selenium IDE (`selenium-side-runner`) dengan hasil **100% SUKSES (6/6 passed)**:

```bash
PASS node_modules/selenium-side-runner/dist/main.test.js (48.229 s)
  Running project Blackbox Testing - Ringkasan Sistem
    Running suite Suite Ringkasan Sistem
      √ Running test TC-RS-001 - Inisialisasi & Tampilan Antarmuka Halaman Ringkasan Sistem (6740 ms)
      √ Running test TC-RS-002 - Kartu Statistik Dashboard (Total Perhitungan, Hari Ini, Total Riwayat) (4595 ms)
      √ Running test TC-RS-003 - Rata-rata Nutrisi & Distribusi Penyakit (6846 ms)
      √ Running test TC-RS-004 - Navigasi Aksi Cepat (Perhitungan & Riwayat) (17284 ms)
      √ Running test TC-RS-005 - Tabel Riwayat Terakhir & Navigasi Detail (5332 ms)
      √ Running test TC-RS-006 - Tombol Kembali ke Portal & Lihat Semua Riwayat (3928 ms)
```

