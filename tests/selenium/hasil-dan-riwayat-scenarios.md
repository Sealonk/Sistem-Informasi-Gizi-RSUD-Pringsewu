# Skenario Pengujian Blackbox — Modul Hasil & Simpan Riwayat

Dokumen ini mendokumentasikan skenario pengujian blackbox menggunakan Selenium IDE untuk modul **Hasil Perhitungan** dan **Simpan Riwayat** pada Sistem Informasi Gizi RSUD Pringsewu, dengan pemetaan terhadap aspek-aspek fokus pengujian wajib.

---

## 1. Pemetaan Aspek Fokus Pengujian

Setiap skenario pengujian dirancang untuk memenuhi satu atau beberapa fokus aspek pengujian berikut:

1. **Kebutuhan Fungsional (Functional Testing)**: Memastikan setiap fitur dan fungsi berjalan sesuai spesifikasi kebutuhan (requirement) perhitungan gizi klinis.
2. **Antarmuka Pengguna (User Interface/UI)**: Memeriksa apakah tampilan visual, tombol, menu, hingga formulir interaktif disajikan dengan benar.
3. **Kesalahan Fungsionalitas (Functionality Errors)**: Menemukan bug terkait fungsi yang tidak berjalan atau salah memproses data (seperti ketidaksesuaian data hasil simpan).
4. **Masukan dan Keluaran (Input/Output)**: Menguji berbagai skenario data yang dimasukkan untuk melihat apakah sistem menghasilkan keluaran yang diharapkan (seperti kecocokan nilai BMR dan TEE).
5. **Kesalahan Inisialisasi dan Terminasi (Initialization & Termination)**: Memeriksa apakah aplikasi dapat dimulai (pemuatan data awal) dan ditutup (keluar/kembali/simpan) dengan normal tanpa error.

---

## 2. Prasyarat Pengujian
1. **Pengguna Terautentikasi**: Pengujian disimulasikan menggunakan akun Petugas Gizi yang valid dengan menyuntikkan token JWT ke dalam `localStorage` sebelum membuka halaman.
2. **Pasien Terpilih**: Pengujian dilakukan dengan memilih pasien dari halaman `/perhitungan` agar data dasar pasien ter-populate di halaman `/assessment`.

---

## 3. Daftar Skenario Pengujian

### **TC-HR-001: Menampilkan Halaman Hasil Perhitungan & Antarmuka UI**
* **Fokus Pengujian**: 
  * `[UI]` Antarmuka Pengguna (UI)
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memverifikasi bahwa halaman Hasil Perhitungan berhasil diinisialisasi setelah menekan tombol Hitung di Assessment, dan menampilkan data gizi klinis pasien secara rinci.
* **Langkah-Langkah**:
  1. Buka halaman `/perhitungan` dan pilih pasien pertama (`FATIMAH`).
  2. Isi BB=60 kg, TB=160 cm, select Aktivitas="Berbaring di tempat tidur", select Stress="Tidak ada stress".
  3. Tekan **"Simpan & Lanjut"** -> konfirmasi modal **"Hitung & Lanjut"**.
  4. Tunggu dialihkan ke `/hasil`.
  5. Verifikasi judul halaman / sub-header adalah `"Rincian Informasi Medis Pasien"`.
  6. Verifikasi kartu status gizi menampilkan kategori `"NORMAL"`.
  7. Verifikasi kartu summary menampilkan energi, protein, lemak, dan karbohidrat.
* **Hasil yang Diharapkan**: Halaman Hasil Perhitungan dimuat secara sempurna dengan UI yang bersih tanpa error.

---

### **TC-HR-002: Verifikasi Detail Faktor Perhitungan Gizi**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memastikan nilai keluaran perhitungan (BMR, Berat Badan Ideal, TEE, Faktor Aktivitas, dan Faktor Stress) sesuai dengan data masukan.
* **Langkah-Langkah**:
  1. Dari halaman `/hasil` yang aktif pada **TC-HR-001**.
  2. Cari panel **"Faktor Perhitungan"** di bagian bawah.
  3. Verifikasi nilai **BBI (Berat Badan Ideal)** terhitung (Output dari TB=160 cm adalah 54 kg).
  4. Verifikasi nilai pengali aktivitas menampilkan nilai `1.2` (sesuai Berbaring di tempat tidur).
  5. Verifikasi nilai pengali stress menampilkan nilai `1.1` (sesuai Tidak ada stress).
* **Hasil yang Diharapkan**: Seluruh angka faktor perhitungan kalkulasi klinis cocok dengan parameter asuhan gizi yang dikirim dari assessment.

---

### **TC-HR-003: Simpan Perhitungan & Verifikasi Modul Riwayat**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Bug]` Kesalahan Fungsionalitas
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Menguji fungsionalitas penyimpanan data hasil perhitungan gizi ke database, menampilkan Success Modal, mengalihkan rute ke Riwayat, serta memvalidasi data tersebut tampil di tabel riwayat.
* **Langkah-Langkah**:
  1. Dari halaman `/hasil`, klik tombol **"Simpan Hasil"**.
  2. Tunggu konfirmasi modal simpan muncul, lalu klik tombol **"Simpan"**.
  3. Tunggu 2.5 detik untuk transisi dan verifikasi **Success Modal** dengan judul `"Riwayat Berhasil Disimpan"` muncul.
  4. Klik tombol **"Riwayat"** di Success Modal.
  5. Tunggu dialihkan ke `/riwayat`.
  6. Tunggu data riwayat dimuat (loading selesai).
  7. Verifikasi nama pasien `"FATIMAH"` tercatat di baris teratas tabel riwayat.
* **Hasil yang Diharapkan**: Proses simpan sukses hingga masuk ke halaman riwayat, membuktikan integrasi penuh frontend ke database tanpa bug.

---

### **TC-HR-004: Tombol Kembali Ke Assessment dari Halaman Hasil**
* **Fokus Pengujian**: 
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
  * `[Fungsional]` Kebutuhan Fungsional
* **Tujuan**: Memastikan tombol kembali berfungsi mengalihkan rute dari `/hasil` kembali ke `/assessment` dengan tetap mempertahankan (restore) data masukan form sebelumnya.
* **Langkah-Langkah**:
  1. Buka halaman `/hasil` hasil kalkulasi.
  2. Klik tombol **"Kembali"** (di sebelah kiri tombol Simpan Hasil).
  3. Tunggu rute dialihkan kembali ke `/assessment`.
  4. Verifikasi input **Berat Badan (BB)** tetap terisi nilai `60`.
  5. Verifikasi input **Tinggi Badan (TB)** tetap terisi nilai `160`.
* **Hasil yang Diharapkan**: Rute kembali bekerja lancar tanpa crash dan memori form (state) berhasil di-restore.
