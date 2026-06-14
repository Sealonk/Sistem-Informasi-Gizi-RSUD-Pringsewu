# Skenario Blackbox Testing Kategori Login

File Selenium IDE: `login-blackbox.side`

Base URL default: `http://localhost:3000`

Backend API dari `.env`: `http://localhost:5000`

Catatan sebelum menjalankan:

- Jalankan frontend dengan `npm start`.
- Pastikan backend login aktif di `http://localhost:5000`.
- Import file `tests/selenium/login-blackbox.side` ke Selenium IDE.
- Untuk skenario login valid, ganti nilai `ISI_USERNAME_VALID` dan `ISI_PASSWORD_VALID` pada test `TC-LG-007` sesuai akun yang ada di database.

## TC-LG-001 - Menampilkan halaman login

Tujuan: Memastikan halaman login tampil dengan elemen utama.

Prasyarat: User belum login, `localStorage` bersih.

Data uji: Tidak ada.

Langkah:

1. Bersihkan `localStorage`.
2. Buka halaman `/`.
3. Verifikasi judul `Login` tampil.
4. Verifikasi input `Masukkan username` tampil.
5. Verifikasi input `Masukkan password` tampil.
6. Verifikasi tombol `Login` tampil.

Hasil yang diharapkan: Halaman login tampil lengkap dan siap digunakan.

## TC-LG-002 - Login ditolak ketika username dan password kosong

Tujuan: Memastikan form tidak bisa dikirim jika seluruh field kosong.

Prasyarat: User belum login, `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | kosong |
| Password | kosong |

Langkah:

1. Bersihkan `localStorage`.
2. Buka halaman `/`.
3. Klik tombol `Login` tanpa mengisi form.
4. Verifikasi input username berada dalam status invalid.
5. Verifikasi halaman tetap di `/`.
6. Verifikasi token tidak tersimpan di `localStorage`.

Hasil yang diharapkan: Login ditolak oleh validasi wajib isi, user tetap di halaman login, dan token tidak dibuat.

## TC-LG-003 - Login ditolak ketika username kosong

Tujuan: Memastikan username wajib diisi.

Prasyarat: User belum login, `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | kosong |
| Password | password123 |

Langkah:

1. Bersihkan `localStorage`.
2. Buka halaman `/`.
3. Isi password.
4. Klik tombol `Login`.
5. Verifikasi input username berada dalam status invalid.
6. Verifikasi halaman tetap di `/`.

Hasil yang diharapkan: Login ditolak karena username kosong.

## TC-LG-004 - Login ditolak ketika password kosong

Tujuan: Memastikan password wajib diisi.

Prasyarat: User belum login, `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | petugas_gizi |
| Password | kosong |

Langkah:

1. Bersihkan `localStorage`.
2. Buka halaman `/`.
3. Isi username.
4. Klik tombol `Login`.
5. Verifikasi input password berada dalam status invalid.
6. Verifikasi halaman tetap di `/`.

Hasil yang diharapkan: Login ditolak karena password kosong.

## TC-LG-005 - Toggle tampil/sembunyikan password

Tujuan: Memastikan tombol ikon mata mengubah mode tampilan password.

Prasyarat: Halaman login dapat dibuka.

Data uji:

| Field | Nilai |
| --- | --- |
| Password | password123 |

Langkah:

1. Buka halaman `/`.
2. Isi field password.
3. Verifikasi tipe input password adalah `password`.
4. Klik ikon mata.
5. Verifikasi tipe input berubah menjadi `text`.
6. Klik ikon mata lagi.
7. Verifikasi tipe input kembali menjadi `password`.

Hasil yang diharapkan: Password dapat ditampilkan dan disembunyikan sesuai klik ikon mata.

## TC-LG-006 - Login ditolak ketika kredensial salah

Tujuan: Memastikan sistem menolak username dan password yang tidak valid.

Prasyarat: Backend login aktif, user belum login, `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | username_salah |
| Password | password_salah |

Langkah:

1. Bersihkan `localStorage`.
2. Buka halaman `/`.
3. Isi username salah.
4. Isi password salah.
5. Klik tombol `Login`.
6. Tunggu pesan error muncul.
7. Verifikasi halaman tetap di `/`.
8. Verifikasi token tidak tersimpan di `localStorage`.

Hasil yang diharapkan: Sistem menampilkan pesan error, user tetap di halaman login, dan token tidak dibuat.

## TC-LG-007 - Login berhasil dengan kredensial valid

Tujuan: Memastikan user bisa login jika username dan password valid.

Prasyarat: Backend login aktif, akun valid tersedia di database, `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | sesuaikan dengan akun valid |
| Password | sesuaikan dengan akun valid |

Langkah:

1. Ubah variabel `validUsername` dari `ISI_USERNAME_VALID` menjadi username valid.
2. Ubah variabel `validPassword` dari `ISI_PASSWORD_VALID` menjadi password valid.
3. Bersihkan `localStorage`.
4. Buka halaman `/`.
5. Isi username valid.
6. Isi password valid.
7. Klik tombol `Login`.
8. Verifikasi URL berpindah ke `/portal`.
9. Verifikasi token tersimpan di `localStorage`.

Hasil yang diharapkan: Login berhasil, user diarahkan ke `/portal`, dan token autentikasi tersimpan.

## TC-LG-008 - Akses portal ditolak ketika belum login

Tujuan: Memastikan route yang dilindungi tidak dapat diakses tanpa login.

Prasyarat: User belum login, `localStorage` bersih.

Data uji: Tidak ada.

Langkah:

1. Bersihkan `localStorage`.
2. Buka halaman `/portal`.
3. Verifikasi sistem mengarahkan kembali ke `/`.
4. Verifikasi form login tampil.

Hasil yang diharapkan: User tanpa token tidak dapat mengakses portal dan diarahkan kembali ke halaman login.
