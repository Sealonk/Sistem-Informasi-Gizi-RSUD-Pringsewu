# Skenario Pengujian Blackbox — Modul Manajemen User

Dokumen ini mendokumentasikan skenario pengujian blackbox menggunakan Selenium IDE untuk modul **Manajemen User** pada Sistem Informasi Gizi RSUD Pringsewu, dengan pemetaan terhadap 5 aspek fokus pengujian wajib.

---

## 1. Pemetaan Aspek Fokus Pengujian

1. **Kebutuhan Fungsional (Functional Testing)**: Memastikan fitur mengambil data user, tambah user baru, reset password user, hapus user, dan batasan hak akses (hanya admin yang boleh masuk) berjalan dengan baik.
2. **Antarmuka Pengguna (User Interface/UI)**: Memeriksa elemen visual seperti header, tabel user, tombol aksi (Reset, Hapus, Tambah, Refresh), form input, serta tampilan denied access untuk non-admin.
3. **Kesalahan Fungsionalitas (Functionality Errors)**: Menemukan bug terkait input tidak valid, reset password tanpa target ID, atau pembatalan aksi modal yang tidak menutup modal secara benar.
4. **Masukan dan Keluaran (Input/Output)**: Menguji masukan form tambah user (Nama Lengkap, Username, Email, Password, Role) dan modal reset password untuk memastikan sistem memberikan respons output (alert sukses/error) yang sesuai.
5. **Kesalahan Inisialisasi dan Terminasi (Initialization & Termination)**: Memeriksa apakah halaman Manajemen User dapat dimuat dengan lancar (inisialisasi API) dan tombol kembali ke portal (terminasi halaman) berfungsi normal.

---

## 2. Prasyarat Pengujian

1. **Pengguna Terautentikasi (Admin)**: Token JWT admin valid disuntikkan ke `localStorage` bersama dengan objek user ber-role `admin`.
2. **Pengguna Terautentikasi (Non-Admin)**: Token JWT petugas gizi disuntikkan untuk menguji penolakan akses.
3. **Backend & Frontend Aktif**: Backend berjalan di `http://localhost:5000` dan Frontend di `http://localhost:3000`.

---

## 3. Daftar Skenario Pengujian

### **TC-MU-001: Inisialisasi & Tampilan Antarmuka Halaman Manajemen User (Role Admin)**
* **Fokus Pengujian**: 
  * `[UI]` Antarmuka Pengguna
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memverifikasi halaman Manajemen User dimuat dengan benar dan menampilkan elemen khusus admin.
* **Langkah-Langkah**:
  1. Suntikkan token admin dan data user admin ke `localStorage`.
  2. Buka halaman `/manajemen-user`.
  3. Tunggu judul `"Manajemen User"` tampil.
  4. Verifikasi teks badge `"Administrator"` dan status login `"Login sebagai Administrator"` tampil.
  5. Verifikasi ringkasan panel summary `"Kelola akses petugas gizi"` tampil.
* **Hasil yang Diharapkan**: Halaman dimuat secara lengkap tanpa error akses.

---

### **TC-MU-002: Penolakan Akses Halaman Manajemen User (Role Non-Admin / Petugas Gizi)**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[UI]` Antarmuka Pengguna
* **Tujuan**: Memastikan pengguna non-admin diblokir dan diarahkan ke tampilan Access Denied.
* **Langkah-Langkah**:
  1. Suntikkan token petugas gizi dan data user petugas gizi ke `localStorage`.
  2. Buka halaman `/manajemen-user`.
  3. Tunggu elemen penolakan akses muncul.
  4. Verifikasi teks `"Akses khusus admin"` dan penjelasan penolakan akses tampil di layar.
* **Hasil yang Diharapkan**: Pengguna non-admin tidak dapat melihat tabel user dan hanya melihat pesan access denied.

---

### **TC-MU-003: Tampilan Tabel User & Kolom Header**
* **Fokus Pengujian**:
  * `[UI]` Antarmuka Pengguna
* **Tujuan**: Memeriksa visualisasi tabel data user beserta kolom header lengkapnya.
* **Langkah-Langkah**:
  1. Login sebagai admin, buka `/manajemen-user`.
  2. Tunggu tabel dimuat (baris pertama ter-render).
  3. Verifikasi kolom header: `"ID"`, `"Nama"`, `"Username"`, `"Email"`, `"Dibuat"`, `"Role"`, dan `"Action"`.
  4. Verifikasi tombol `"Tambah User"` dan `"Refresh"` tampil di atas tabel.
* **Hasil yang Diharapkan**: Tabel user ter-render sempurna dengan seluruh kolom header.

---

### **TC-MU-004: Tambah User Baru (Input/Output & Fungsional)**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Menguji pendaftaran user baru dengan data valid.
* **Langkah-Langkah**:
  1. Login sebagai admin, buka `/manajemen-user`.
  2. Klik tombol `"Tambah User"`.
  3. Tunggu modal tambah user muncul.
  4. Isi field: Nama Lengkap (`"Tester Baru"`), Username (`"testerbaru"`), Email (`"tester@rsudpringsewu.id"`), Password (`"tester123"`), dan pilih Role (`"Petugas Gizi"`).
  5. Klik tombol `"Simpan"`.
  6. Verifikasi alert/feedback sukses `"User baru berhasil ditambahkan"` muncul.
  7. Tutup modal (Klik `"Batal"`).
* **Hasil yang Diharapkan**: User baru berhasil disimpan ke database dan visual feedback sukses ditampilkan.

---

### **TC-MU-005: Reset Password User (Input/Output & Fungsional)**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Menguji reset password untuk salah satu user petugas gizi.
* **Langkah-Langkah**:
  1. Login sebagai admin, buka `/manajemen-user`.
  2. Cari baris user petugas gizi, klik tombol `"Reset"` (ikon kunci).
  3. Tunggu modal reset password muncul.
  4. Masukkan password baru (`"passwordbaru123"`).
  5. Klik tombol `"Reset"`.
  6. Verifikasi alert/feedback sukses `"Password user berhasil direset"` muncul.
  7. Tutup modal reset.
* **Hasil yang Diharapkan**: Password target berhasil diperbarui dan feedback sukses muncul.

---

### **TC-MU-006: Batalkan Penghapusan User (Modal Cancel)**
* **Fokus Pengujian**:
  * `[Fungsional]` Kebutuhan Fungsional
  * `[UI]` Antarmuka Pengguna
* **Tujuan**: Memastikan penghapusan user dapat dibatalkan dengan aman melalui modal.
* **Langkah-Langkah**:
  1. Login sebagai admin, buka `/manajemen-user`.
  2. Cari baris user petugas gizi, klik tombol `"Hapus"` (ikon tempat sampah).
  3. Tunggu modal konfirmasi hapus muncul.
  4. Verifikasi teks konfirmasi: `"Apakah Anda yakin ingin menghapus user"` tampil.
  5. Klik tombol `"Batal"`.
  6. Verifikasi modal tertutup dan data user tidak terhapus dari tabel.
* **Hasil yang Diharapkan**: Penghapusan dibatalkan tanpa error.

---

### **TC-MU-007: Navigasi Kembali ke Portal**
* **Fokus Pengujian**:
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memverifikasi tombol navigasi kembali berfungsi normal mengembalikan admin ke portal utama.
* **Langkah-Langkah**:
  1. Login sebagai admin, buka `/manajemen-user`.
  2. Klik tombol `"Portal"` di header.
  3. Verifikasi rute berubah ke `/portal`.
* **Hasil yang Diharapkan**: Pengguna dialihkan kembali ke portal utama.

---

## 4. Hasil Eksekusi Pengujian Otomatis (PASS)

Semua skenario pengujian telah dijalankan menggunakan runner Selenium IDE (`selenium-side-runner`) dengan hasil **100% SUKSES (7/7 passed)**:

```bash
PASS node_modules/selenium-side-runner/dist/main.test.js (19.316 s)
  Running project Blackbox Testing - Manajemen User
    Running suite Suite Manajemen User
      √ Running test TC-MU-001 - Inisialisasi & Tampilan Antarmuka Halaman Manajemen User (Role Admin) (2484 ms)
      √ Running test TC-MU-002 - Penolakan Akses Halaman Manajemen User (Role Non-Admin / Petugas Gizi) (2236 ms)
      √ Running test TC-MU-003 - Tampilan Tabel User & Kolom Header (2244 ms)
      √ Running test TC-MU-004 - Tambah User Baru (Input/Output & Fungsional) (3648 ms)
      √ Running test TC-MU-005 - Reset Password User (Input/Output & Fungsional) (2929 ms)
      √ Running test TC-MU-006 - Batalkan Penghapusan User (Modal Cancel) (2487 ms)
      √ Running test TC-MU-007 - Navigasi Kembali ke Portal (2224 ms)
```

