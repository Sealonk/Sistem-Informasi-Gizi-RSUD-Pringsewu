# Skenario Blackbox Testing Kategori Portal

File Selenium IDE: `portal-blackbox.side`

Base URL default: `http://localhost:3000`

Backend API dari `.env`: `http://localhost:5000`

Catatan sebelum menjalankan:

- Jalankan frontend dengan `npm start` (atau dev server di port 3000).
- Pastikan backend aktif di `http://localhost:5000`.
- Import file `tests/selenium/portal-blackbox.side` ke Selenium IDE.
- Pengujian kategori portal memerlukan status login. Agar efisien, setiap test case akan melakukan bypass dengan menyuntikkan token dummy/valid ke `localStorage` atau melakukan login otomatis terlebih dahulu.

---

## TC-PT-001 - Menampilkan Halaman Portal dengan Elemen Utama

Tujuan: Memastikan halaman portal (`/portal`) menampilkan seluruh elemen antarmuka utama dengan benar setelah login berhasil.

Prasyarat: User telah login (token ada di `localStorage`).

Data uji: Tidak ada.

Langkah:
1. Suntikkan token valid/dummy ke `localStorage`.
2. Buka halaman `/portal`.
3. Verifikasi badge selamat datang `"Akses Portal Aktif"` tampil.
4. Verifikasi teks greeting utama mengandung kata `"Petugas Gizi"`.
5. Verifikasi tersedianya widget "Waktu Server" di sebelah kanan atas konten.
6. Verifikasi 3 card menu utama tampil ("Ringkasan Sistem", "Perhitungan Gizi", "Riwayat").
7. Verifikasi widget "Edukasi Klinis Hari Ini" tampil.
8. Verifikasi footer memuat info "Terintegrasi SIMRS RSUD Pringsewu".

Hasil yang diharapkan: Seluruh komponen utama pada dashboard portal tampil lengkap dan presisi secara visual.

---

## TC-PT-002 - Navigasi ke Modul Ringkasan Sistem

Tujuan: Memastikan ketika pengguna memilih menu "Ringkasan Sistem", aplikasi mengarahkan ke halaman ringkasan sistem.

Prasyarat: User telah login dan berada di halaman `/portal`.

Data uji: Tidak ada.

Langkah:
1. Suntikkan token ke `localStorage`.
2. Buka halaman `/portal`.
3. Cari card menu yang memiliki judul `"Ringkasan Sistem"`.
4. Klik pada card menu "Ringkasan Sistem" tersebut.
5. Verifikasi URL berubah menjadi `/ringkasan-sistem`.

Hasil yang diharapkan: Sistem berhasil mengalihkan rute halaman ke `/ringkasan-sistem`.

---

## TC-PT-003 - Navigasi ke Modul Perhitungan Gizi

Tujuan: Memastikan ketika pengguna memilih menu "Perhitungan Gizi", aplikasi mengarahkan ke halaman pemilihan pasien untuk perhitungan kebutuhan gizi.

Prasyarat: User telah login dan berada di halaman `/portal`.

Data uji: Tidak ada.

Langkah:
1. Suntikkan token ke `localStorage`.
2. Buka halaman `/portal`.
3. Cari card menu yang memiliki judul `"Perhitungan Gizi"`.
4. Klik pada card menu "Perhitungan Gizi" tersebut.
5. Verifikasi URL berubah menjadi `/perhitungan`.

Hasil yang diharapkan: Sistem berhasil mengalihkan rute halaman ke `/perhitungan`.

---

## TC-PT-004 - Navigasi ke Modul Riwayat

Tujuan: Memastikan ketika pengguna memilih menu "Riwayat", aplikasi mengarahkan ke halaman daftar riwayat perhitungan gizi pasien.

Prasyarat: User telah login dan berada di halaman `/portal`.

Data uji: Tidak ada.

Langkah:
1. Suntikkan token ke `localStorage`.
2. Buka halaman `/portal`.
3. Cari card menu yang memiliki judul `"Riwayat"`.
4. Klik pada card menu "Riwayat" tersebut.
5. Verifikasi URL berubah menjadi `/riwayat`.

Hasil yang diharapkan: Sistem berhasil mengalihkan rute halaman ke `/riwayat`.

---

## TC-PT-005 - Mengubah Slide Tips Edukasi Klinis Hari Ini

Tujuan: Memastikan indikator navigasi tips (dots) berfungsi dan dapat menampilkan tips edukasi gizi klinis berikutnya.

Prasyarat: User telah login dan berada di halaman `/portal`.

Data uji: Pilihan dot indeks ke-1 (dot kedua).

Langkah:
1. Suntikkan token ke `localStorage`.
2. Buka halaman `/portal`.
3. Pastikan widget tips edukasi klinis tampil.
4. Klik dot navigasi kedua (indeks 1) pada bagian bawah widget tips.
5. Verifikasi teks tips berubah sesuai dengan konten tips indeks ke-1.
6. Verifikasi dot kedua menjadi berstatus aktif (berubah warna/ukuran sesuai class Tailwind).

Hasil yang diharapkan: Tips edukasi gizi berganti sesuai dengan dot indikator yang diklik oleh user.

---

## TC-PT-006 - Membuka/Menutup Dropdown Menu User

Tujuan: Memastikan tombol profil pengguna di header dapat membuka dan menutup menu dropdown user secara dinamis.

Prasyarat: User telah login dan berada di halaman `/portal`.

Data uji: Tidak ada.

Langkah:
1. Suntikkan token ke `localStorage`.
2. Buka halaman `/portal`.
3. Klik tombol profil user (bertuliskan "Petugas Gizi" di kanan atas).
4. Verifikasi menu dropdown muncul dan menampilkan opsi "Logout".
5. Klik kembali tombol profil user "Petugas Gizi".
6. Verifikasi menu dropdown tersebut tertutup (tidak terlihat lagi di halaman).

Hasil yang diharapkan: Dropdown profil user dapat dibuka-tutup dengan lancar melalui trigger klik.

---

## TC-PT-007 - Proses Logout Melalui Menu User

Tujuan: Memastikan fungsionalitas logout berhasil menghapus token sesi pengguna dan mengarahkan kembali ke halaman login utama.

Prasyarat: User telah login dan berada di halaman `/portal`.

Data uji: Tidak ada.

Langkah:
1. Suntikkan token ke `localStorage`.
2. Buka halaman `/portal`.
3. Klik tombol profil user di header untuk memunculkan dropdown menu.
4. Klik tombol "Logout" di dalam menu dropdown tersebut.
5. Verifikasi URL berpindah kembali ke `/` (halaman login).
6. Verifikasi token di `localStorage` telah dihapus (bernilai `null`).

Hasil yang diharapkan: Pengguna berhasil logout, token dihapus dari penyimpanan lokal, dan akses ke halaman portal ditutup (diarahkan kembali ke login).
