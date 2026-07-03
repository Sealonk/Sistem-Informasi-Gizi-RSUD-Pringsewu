# Skenario Pengujian Blackbox — Modul Pilih Pasien

Dokumen ini mendokumentasikan skenario pengujian blackbox menggunakan Selenium IDE untuk modul **Pilih Pasien** pada Sistem Informasi Gizi RSUD Pringsewu, dengan pemetaan terhadap aspek-aspek fokus pengujian wajib.

File Selenium IDE: `pilih-pasien-blackbox.side`
Base URL: `http://localhost:3000`

---

## 1. Pemetaan Aspek Fokus Pengujian

1. **Kebutuhan Fungsional (Functional Testing)**: Memastikan filter periode, pencarian nama, modifikasi limit baris, pagination, reload, dan modal konfirmasi berjalan sesuai kebutuhan fungsional sistem.
2. **Antarmuka Pengguna (User Interface/UI)**: Memeriksa elemen tabel data pasien, tombol filter periode, search bar, dropdown limit, dan navigasi halaman disajikan dengan benar.
3. **Kesalahan Fungsionalitas (Functionality Errors)**: Menemukan bug atau ketidakstabilan pada aksi pembatalan modal, limitasi data dinamis, dan pergeseran halaman data.
4. **Masukan dan Keluaran (Input/Output)**: Memastikan filter pencarian (nama) membatasi keluaran baris tabel secara akurat, dan modifikasi limit (10 baris) menghasilkan visualisasi data yang sesuai.
5. **Kesalahan Inisialisasi dan Terminasi (Initialization & Termination)**: Memastikan halaman dimuat dengan sukses (fetching list pasien dari API) dan navigasi keluar (ke portal atau asessment) berterminasi dengan normal tanpa crash.

---

## 2. Prasyarat Pengujian
1. **Pengguna Terautentikasi**: Token JWT yang valid disuntikkan ke `localStorage` sebelum membuka halaman.
2. **Backend & DB Aktif**: Database berisi data pasien SIMRS (reg_periksa & pasien) minimal 50 record agar pengujian pagination 10 data per halaman dapat diuji secara riil.

---

## 3. Daftar Skenario Pengujian

### **TC-PH-001: Menampilkan Halaman Pilih Pasien**
* **Fokus Pengujian**: 
  * `[UI]` Antarmuka Pengguna
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan halaman `/perhitungan` terinisialisasi secara normal dan merender tabel data pasien serta filter utama secara utuh.
* **Langkah-Langkah**:
  1. Suntikkan token JWT ke `localStorage`.
  2. Buka halaman `/perhitungan`.
  3. Verifikasi judul halaman `"Perhitungan Gizi"` tampil.
  4. Verifikasi tombol filter `"Semua"`, `"Hari Ini"`, `"Minggu Ini"`, dan `"Bulan Ini"` tampil di antarmuka.
* **Hasil yang Diharapkan**: Halaman berhasil dimuat lengkap dengan tabel data pasien.

---

### **TC-PH-002: Filter Periode Data Pasien**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memverifikasi fungsionalitas tombol filter periode cepat dan tombol reset filter.
* **Langkah-Langkah**:
  1. Klik tombol filter `"Hari Ini"`.
  2. Verifikasi state tombol Hari Ini terpilih (active class).
  3. Klik tombol `"Reset"` di panel pencarian.
  4. Verifikasi filter periode kembali ke keadaan semula.
* **Hasil yang Diharapkan**: Sistem mengubah filter periode data dan memicu reloading tabel secara fungsional.

---

### **TC-PH-003: Filter Custom Tanpa Tanggal Menampilkan Pesan Error**
* **Fokus Pengujian**: 
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memastikan validasi filter custom menolak eksekusi tanpa masukan rentang tanggal yang lengkap.
* **Langkah-Langkah**:
  1. Klik dropdown periode filter lalu pilih opsi `"Custom"`.
  2. Biarkan input tanggal kosong.
  3. Klik tombol `"Cari"`.
  4. Verifikasi munculnya pesan error: `"Pilih tanggal untuk filter custom"`.
* **Hasil yang Diharapkan**: Sistem mendeteksi ketiadaan input tanggal dan menolak memproses query.

---

### **TC-PH-004: Pencarian Pasien Berdasarkan Nama**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memastikan pencarian nama menyaring list data pasien pada tabel.
* **Langkah-Langkah**:
  1. Ketik kata kunci `"Ahmad"` pada input pencarian.
  2. Klik tombol `"Cari"`.
  3. Verifikasi header kolom `"Nama Pasien"` tetap tampil dan data tersaring normal.
* **Hasil yang Diharapkan**: Pencarian memperbarui query parameter API pasien dan memuat data yang sesuai.

---

### **TC-PH-005: Tombol Kembali ke Portal dari Halaman Perhitungan**
* **Fokus Pengujian**: 
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tombol kembali ke portal berterminasi dengan normal dan memindahkan navigasi rute ke `/portal`.
* **Langkah-Langkah**:
  1. Klik tombol `"Kembali ke Portal"`.
  2. Verifikasi rute URL berganti ke `/portal`.
  3. Verifikasi badge `"Akses Portal Aktif"` tampil di halaman baru.
* **Hasil yang Diharapkan**: Navigasi keluar halaman perhitungan gizi berjalan normal tanpa crash rute.

---

### **TC-PH-006: Menampilkan Modal Konfirmasi saat Memilih Pasien**
* **Fokus Pengujian**: 
  * `[UI]` Antarmuka Pengguna
  * `[Fungsional]` Kebutuhan Fungsional
* **Tujuan**: Memverifikasi klik tombol "Pilih" membuka modal konfirmasi beserta detail nama pasien.
* **Langkah-Langkah**:
  1. Buka kembali halaman `/perhitungan`.
  2. Cari baris pasien pertama dan klik tombol `"Pilih"`.
  3. Verifikasi modal konfirmasi terbuka dengan judul `"Pilih Pasien"`.
  4. Verifikasi teks pesan memuat konfirmasi pilihan untuk pasien target.
* **Hasil yang Diharapkan**: Modal konfirmasi interaktif muncul di tengah layar secara terpusat.

---

### **TC-PH-007: Membatalkan Pemilihan Pasien dari Modal**
* **Fokus Pengujian**: 
  * `[Bug]` Kesalahan Fungsionalitas
* **Tujuan**: Memastikan tombol cancel ("Batal") pada modal menutup modal konfirmasi tanpa mengalihkan rute.
* **Langkah-Langkah**:
  1. Klik tombol `"Pilih"` pada baris pasien pertama untuk memicu modal.
  2. Klik tombol `"Batal"` di dalam modal konfirmasi.
  3. Verifikasi modal konfirmasi tertutup.
  4. Verifikasi URL browser tetap berada di `/perhitungan`.
* **Hasil yang Diharapkan**: Pengguna membatalkan pemilihan dengan aman dan modal ditutup dari layer atas DOM.

---

### **TC-PH-008: Navigasi ke Assessment setelah Konfirmasi Pilih Pasien**
* **Fokus Pengujian**: 
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
  * `[Fungsional]` Kebutuhan Fungsional
* **Tujuan**: Memastikan klik tombol konfirmasi "Pilih Pasien" pada modal mengalihkan navigasi ke form assessment `/assessment`.
* **Langkah-Langkah**:
  1. Klik tombol `"Pilih"` pada baris pasien pertama.
  2. Klik tombol `"Pilih Pasien"` (konfirmasi) di dalam modal.
  3. Verifikasi rute dialihkan secara dinamis ke `/assessment`.
  4. Verifikasi form `"Identitas Pasien"` muncul di halaman baru.
* **Hasil yang Diharapkan**: Navigasi antarmuka sukses mengarahkan pengguna ke halaman kelanjutan asuhan gizi.

---

### **TC-PH-008a: Mengubah Jumlah Tampilan Pasien (10, 25, 50)**
* **Fokus Pengujian**: 
  * `[Input/Output]` Masukan dan Keluaran
  * `[UI]` Antarmuka Pengguna
* **Tujuan**: Memverifikasi bahwa dropdown limit jumlah baris mengubah jumlah tampilan baris data di tabel.
* **Langkah-Langkah**:
  1. Cari select dropdown limit baris data di bagian bawah tabel.
  2. Pilih nilai `"10"`.
  3. Berikan jeda pause `1500ms` untuk stabilisasi reload.
  4. Verifikasi jumlah baris data yang tampil di tabel maksimal 10 baris.
* **Hasil yang Diharapkan**: Limitasi baris data berjalan responsif membatasi muatan tabel.

---

### **TC-PH-008b: Navigasi Halaman Pasien (Pagination)**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Bug]` Kesalahan Fungsionalitas
* **Tujuan**: Memastikan tombol navigasi pagination (Selanjutnya & Sebelumnya) memuat set data halaman berikutnya.
* **Langkah-Langkah**:
  1. Ubah select dropdown limit baris data ke `"10"`.
  2. Berikan jeda pause `1500ms`.
  3. Klik tombol `"Selanjutnya"`.
  4. Berikan jeda pause `1500ms`.
  5. Verifikasi tabel memuat data pasien halaman ke-2.
  6. Klik tombol `"Sebelumnya"`.
  7. Berikan jeda pause `1500ms`.
  8. Verifikasi tabel memuat data pasien halaman ke-1 kembali.
* **Hasil yang Diharapkan**: Navigasi antar halaman data pasien berjalan sinkron dengan server-side pagination.

---

### **TC-PH-008c: Memuat Ulang Data Pasien (Reload/Refresh)**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
* **Tujuan**: Memastikan tombol refresh/muat ulang memanggil ulang API data pasien terbaru dengan normal.
* **Langkah-Langkah**:
  1. Klik tombol `"Muat Ulang"` (ikon refresh di dekat select limit).
  2. Berikan jeda pause `1500ms` untuk sinkronisasi state.
  3. Verifikasi data pasien pada tabel kembali termuat utuh.
* **Hasil yang Diharapkan**: Proses reloading data berhasil diselesaikan tanpa memicu error atau freeze aplikasi.

---

## 4. Hasil Eksekusi Pengujian Otomatis (PASS)

Seluruh 11 skenario pengujian di atas telah dijalankan menggunakan runner Selenium IDE (`selenium-side-runner`) dengan hasil **100% SUKSES (11/11 passed)**:

```bash
PASS node_modules/selenium-side-runner/dist/main.test.js (31.411 s)
  Running project Blackbox Testing - Pilih Pasien
    Running suite Kategori Pilih Pasien
      √ Running test TC-PH-001 - Menampilkan Halaman Pilih Pasien (2766 ms)
      √ Running test TC-PH-002 - Filter Periode Data Pasien (3141 ms)
      √ Running test TC-PH-003 - Filter Custom Tanpa Tanggal Menampilkan Pesan Error (2572 ms)
      √ Running test TC-PH-004 - Pencarian Pasien Berdasarkan Nama (2480 ms)
      √ Running test TC-PH-005 - Tombol Kembali ke Portal dari Halaman Perhitungan (2308 ms)
      √ Running test TC-PH-006 - Menampilkan Modal Konfirmasi saat Memilih Pasien (2525 ms)
      √ Running test TC-PH-007 - Membatalkan Pemilihan Pasien dari Modal (2911 ms)
      √ Running test TC-PH-008 - Navigasi ke Assessment setelah Konfirmasi Pilih Pasien (2863 ms)
      √ Running test TC-PH-008a - Mengubah Jumlah Tampilan Pasien (10, 25, 50) (2640 ms)
      √ Running test TC-PH-008b - Navigasi Halaman Pasien (Pagination) (2674 ms)
      √ Running test TC-PH-008c - Memuat Ulang Data Pasien (Reload/Refresh) (2777 ms)
```
