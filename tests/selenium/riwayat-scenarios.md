# Skenario Pengujian Blackbox — Modul Riwayat Perhitungan Gizi

Dokumen ini mendokumentasikan skenario pengujian blackbox menggunakan Selenium IDE untuk modul **Riwayat Perhitungan Gizi** pada Sistem Informasi Gizi RSUD Pringsewu, dengan pemetaan terhadap 5 aspek fokus pengujian wajib.

---

## 1. Pemetaan Aspek Fokus Pengujian

1. **Kebutuhan Fungsional (Functional Testing)**: Memastikan fitur pencarian, filter, pagination, navigasi detail, hapus riwayat, dan navigasi portal berjalan sesuai spesifikasi.
2. **Antarmuka Pengguna (User Interface/UI)**: Memeriksa tampilan header, breadcrumb, badges, tab, filter form, kolom tabel, tombol aksi, pagination, dan halaman detail tampil dengan benar.
3. **Kesalahan Fungsionalitas (Functionality Errors)**: Menemukan bug terkait filter tidak berfungsi, pencarian error, hapus gagal, atau modal tidak tampil.
4. **Masukan dan Keluaran (Input/Output)**: Menguji input pencarian nama, filter penyakit, filter tanggal, filter pembuat, dan memverifikasi keluaran tabel yang sesuai.
5. **Kesalahan Inisialisasi dan Terminasi (Initialization & Termination)**: Memeriksa apakah halaman riwayat dan detail riwayat dapat dimulai (loading data API) dan ditutup (navigasi keluar) tanpa error.

---

## 2. Prasyarat Pengujian

1. **Pengguna Terautentikasi**: Token JWT valid disuntikkan ke `localStorage` sebelum membuka halaman.
2. **Backend Aktif**: Backend berjalan di `http://localhost:5000`.
3. **Data Riwayat Tersedia**: Minimal ada 1 data riwayat perhitungan tersimpan di database.
4. **Frontend Aktif**: Frontend berjalan di `http://localhost:3000`.

---

## 3. Daftar Skenario Pengujian

### **TC-RW-001: Inisialisasi & Tampilan Antarmuka Halaman Riwayat**
* **Fokus Pengujian**:
  * `[UI]` Antarmuka Pengguna
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memverifikasi bahwa halaman Riwayat berhasil diinisialisasi dari API dan menampilkan seluruh elemen antarmuka utama secara lengkap.
* **Langkah-Langkah**:
  1. Suntikkan token JWT ke `localStorage`.
  2. Buka halaman `/riwayat`.
  3. Tunggu judul `"Riwayat Perhitungan"` tampil (bukti loading API selesai).
  4. Verifikasi breadcrumb `"Beranda > Riwayat"` tampil.
  5. Verifikasi deskripsi halaman tampil.
  6. Verifikasi badge `"Database Sinkron"` tampil.
  7. Verifikasi badge `"Tersimpan Otomatis"` tampil.
  8. Verifikasi badge nama petugas tampil (mengandung `"Petugas:"`).
  9. Verifikasi tab `"Perhitungan Gizi"` tampil dan aktif.
  10. Verifikasi tombol `"Kembali ke Portal"` tampil di header.
* **Hasil yang Diharapkan**: Seluruh elemen antarmuka dimuat secara lengkap tanpa error inisialisasi.

---

### **TC-RW-002: Tampilan Filter & Form Pencarian**
* **Fokus Pengujian**:
  * `[UI]` Antarmuka Pengguna
* **Tujuan**: Memverifikasi seluruh elemen filter dan form pencarian tampil dengan benar.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Verifikasi label `"Cari Pasien"` tampil.
  3. Verifikasi input pencarian dengan placeholder `"Nama pasien atau No. RM..."` tampil.
  4. Verifikasi label `"Filter Penyakit"` tampil.
  5. Verifikasi dropdown penyakit tampil (default: `"Semua Penyakit"`).
  6. Verifikasi label `"Filter Tanggal"` tampil.
  7. Verifikasi input tanggal (type=date) tampil.
  8. Verifikasi label `"Filter Pembuat"` tampil.
  9. Verifikasi dropdown pembuat tampil (default: `"Semua User"`).
* **Hasil yang Diharapkan**: Seluruh elemen filter dan form pencarian tampil lengkap.

---

### **TC-RW-003: Tampilan Tabel Riwayat & Kolom Header**
* **Fokus Pengujian**:
  * `[UI]` Antarmuka Pengguna
  * `[Fungsional]` Kebutuhan Fungsional
* **Tujuan**: Memverifikasi tabel riwayat menampilkan data dan kolom header sesuai spesifikasi.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu tabel riwayat dimuat (baris pertama muncul).
  3. Verifikasi judul tabel `"Riwayat Perhitungan Gizi"` tampil.
  4. Verifikasi kolom header `"Pasien"` tampil.
  5. Verifikasi kolom header `"JK"` tampil.
  6. Verifikasi kolom header `"Kode Penyakit"` tampil.
  7. Verifikasi kolom header `"Energi & Makronutrien"` tampil.
  8. Verifikasi kolom header `"Tanggal"` tampil.
  9. Verifikasi kolom header `"Pembuat"` tampil.
  10. Verifikasi kolom header `"Aksi"` tampil.
  11. Verifikasi baris pertama tabel berisi data pasien (nama dan No. RM).
* **Hasil yang Diharapkan**: Tabel menampilkan 7 kolom header dan data riwayat dari API.

---

### **TC-RW-004: Pencarian Riwayat (Input/Output)**
* **Fokus Pengujian**:
  * `[Input/Output]` Masukan dan Keluaran
  * `[Bug]` Kesalahan Fungsionalitas
* **Tujuan**: Memastikan field pencarian dapat diisi dan memicu pembaruan tabel tanpa error.
* **Data Uji**: Kata kunci `"Pasien"`
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu tabel dimuat.
  3. Masukkan teks `"Pasien"` pada field pencarian.
  4. Tunggu sejenak (debounce).
  5. Verifikasi tabel diperbarui tanpa error (halaman tidak crash).
  6. Bersihkan field pencarian.
  7. Verifikasi tabel kembali menampilkan data awal.
* **Hasil yang Diharapkan**: Pencarian memfilter data tabel dan reset berhasil tanpa bug.

---

### **TC-RW-005: Filter Riwayat Berdasarkan Penyakit (Input/Output)**
* **Fokus Pengujian**:
  * `[Input/Output]` Masukan dan Keluaran
  * `[Fungsional]` Kebutuhan Fungsional
* **Tujuan**: Memastikan dropdown filter penyakit memperbarui daftar data sesuai pilihan.
* **Data Uji**: Penyakit `"DM"`
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu tabel dimuat.
  3. Pilih opsi `"DM"` pada dropdown filter penyakit.
  4. Tunggu tabel diperbarui.
  5. Verifikasi filter aktif dan tabel tidak crash.
  6. Kembalikan filter ke `"Semua Penyakit"`.
  7. Verifikasi tabel kembali menampilkan semua data.
* **Hasil yang Diharapkan**: Filter penyakit berfungsi dengan benar.

---

### **TC-RW-006: Filter Riwayat Berdasarkan Tanggal (Input/Output)**
* **Fokus Pengujian**:
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memastikan input tanggal memfilter data sesuai nilai.
* **Data Uji**: Tanggal `"2026-06-28"`
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu tabel dimuat.
  3. Isi field filter tanggal dengan `"2026-06-28"`.
  4. Tunggu tabel diperbarui.
  5. Verifikasi halaman tidak crash setelah filter tanggal.
* **Hasil yang Diharapkan**: Filter tanggal berfungsi tanpa error.

---

### **TC-RW-007: Filter Riwayat Berdasarkan Pembuat (Input/Output)**
* **Fokus Pengujian**:
  * `[Input/Output]` Masukan dan Keluaran
  * `[Fungsional]` Kebutuhan Fungsional
* **Tujuan**: Memastikan dropdown filter pembuat ("Semua User" / "Hanya Saya") berfungsi.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu tabel dimuat.
  3. Pilih opsi `"Hanya Saya"` (value="me") pada dropdown filter pembuat.
  4. Tunggu tabel diperbarui.
  5. Verifikasi tabel tidak crash.
  6. Kembalikan ke `"Semua User"` (value="all").
* **Hasil yang Diharapkan**: Filter pembuat berfungsi dan memicu pembaruan tabel.

---

### **TC-RW-008: Navigasi ke Detail Riwayat**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tombol Detail (ikon Eye) pada tabel mengarahkan ke halaman detail riwayat.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu baris pertama tabel muncul.
  3. Klik tombol Detail (ikon Eye, tombol pertama di kolom Aksi) pada baris pertama.
  4. Verifikasi URL berubah ke pattern `/riwayat/:id`.
  5. Verifikasi halaman detail memuat elemen-elemen utama (loading selesai).
* **Hasil yang Diharapkan**: Navigasi ke detail riwayat berhasil tanpa error.

---

### **TC-RW-009: Tampilan Halaman Detail Riwayat**
* **Fokus Pengujian**:
  * `[UI]` Antarmuka Pengguna
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memverifikasi halaman detail riwayat menampilkan seluruh informasi dengan benar.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`, klik Detail pada baris pertama.
  2. Tunggu halaman detail dimuat sepenuhnya.
  3. Verifikasi bagian `"Status Gizi"` tampil.
  4. Verifikasi bagian `"Ringkasan Kebutuhan Harian"` tampil.
  5. Verifikasi bagian `"Komposisi Makronutrien"` tampil.
  6. Verifikasi bagian `"Faktor Perhitungan"` tampil.
  7. Verifikasi tombol `"Kembali ke Portal"` tampil.
  8. Verifikasi tombol `"Kembali ke Riwayat"` tampil.
* **Hasil yang Diharapkan**: Seluruh data detail riwayat ditampilkan dari API dengan benar.

---

### **TC-RW-010: Navigasi Kembali dari Detail ke Riwayat**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tombol "Kembali ke Riwayat" di halaman detail berfungsi.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`, navigasi ke halaman detail.
  2. Tunggu halaman detail dimuat.
  3. Klik tombol `"Kembali ke Riwayat"`.
  4. Verifikasi URL berubah ke `/riwayat`.
  5. Verifikasi halaman riwayat dimuat kembali tanpa error.
* **Hasil yang Diharapkan**: Navigasi kembali ke daftar riwayat berhasil.

---

### **TC-RW-011: Navigasi Kembali dari Detail ke Portal**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tombol "Kembali ke Portal" di halaman detail berfungsi.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`, navigasi ke halaman detail.
  2. Tunggu halaman detail dimuat.
  3. Klik tombol `"Kembali ke Portal"`.
  4. Verifikasi URL berubah ke `/portal`.
* **Hasil yang Diharapkan**: Navigasi ke portal berhasil tanpa error.

---

### **TC-RW-012: Tombol Kembali ke Portal dari Halaman Riwayat**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tombol "Kembali ke Portal" di header halaman riwayat berfungsi.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu halaman dimuat.
  3. Klik tombol `"Kembali ke Portal"` di header.
  4. Verifikasi URL berubah ke `/portal`.
* **Hasil yang Diharapkan**: Terminasi halaman riwayat ke portal berhasil.

---

### **TC-RW-013: Membatalkan Penghapusan Riwayat (Modal Cancel)**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[UI]` Antarmuka Pengguna
  * `[Bug]` Kesalahan Fungsionalitas
* **Tujuan**: Memastikan modal konfirmasi hapus tampil dan tombol Batal berfungsi tanpa menghapus data.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu baris pertama tabel muncul.
  3. Klik tombol Hapus (ikon Trash) pada baris pertama.
  4. Verifikasi modal konfirmasi `"Hapus Riwayat Perhitungan"` tampil.
  5. Verifikasi teks pesan konfirmasi tampil.
  6. Verifikasi tombol `"Batal"` tampil di modal.
  7. Verifikasi tombol `"Ya, Hapus"` tampil di modal.
  8. Klik tombol `"Batal"`.
  9. Verifikasi modal tertutup dan halaman tetap di `/riwayat`.
  10. Verifikasi data tabel tidak berubah (baris pertama masih ada).
* **Hasil yang Diharapkan**: Pembatalan hapus berhasil, data tetap utuh.

---

### **TC-RW-014: Tombol Aksi pada Tabel (Detail, Edit, Hapus)**
* **Fokus Pengujian**:
  * `[UI]` Antarmuka Pengguna
  * `[Fungsional]` Kebutuhan Fungsional
* **Tujuan**: Memverifikasi keberadaan dan atribut tombol-tombol aksi pada setiap baris tabel.
* **Langkah-Langkah**:
  1. Buka halaman `/riwayat`.
  2. Tunggu baris pertama tabel muncul.
  3. Verifikasi tombol Detail (title="Lihat Detail") ada di baris pertama.
  4. Verifikasi tombol Edit (title="Edit Perhitungan") ada di baris pertama.
  5. Verifikasi tombol Hapus (title="Hapus Perhitungan") ada di baris pertama.
* **Hasil yang Diharapkan**: Ketiga tombol aksi tampil pada setiap baris data.
