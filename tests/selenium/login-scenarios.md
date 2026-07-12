# Skenario Blackbox Testing Kategori Login

File Selenium IDE: `login-blackbox.side`

Base URL default: `http://localhost:3000`

Backend API dari `.env`: `REACT_APP_API_URL`

Catatan sebelum menjalankan:

- Jalankan frontend dengan `npm start`.
- Jalankan backend API sesuai nilai `REACT_APP_API_URL`.
- Jalankan script headless dengan `npm run test:selenium:login`.
- Jalankan preview browser dengan `npm run test:selenium:login:preview`.
- Jalankan visual walkthrough dengan `npm run test:selenium:login:visual`.
- Suite default `Kategori Login` menjalankan 16 skenario stabil: semua skenario kecuali TC-LG-007, TC-LG-013, dan TC-LG-019.
- Untuk skenario valid, ubah variabel test di file `.side` sesuai data backend:
  - `validUsername`
  - `validPassword`
  - `validAdminEmail`
  - `validResetToken`
  - `newValidPassword`
- TC-LG-007, TC-LG-013, dan TC-LG-019 tetap disediakan di file `.side`, tetapi tidak dimasukkan ke suite default karena membutuhkan akun, email, dan token reset yang benar-benar valid dari backend.

## Ringkasan Skenario

| ID | Nama Skenario | Ketergantungan Backend | Suite Default |
| --- | --- | --- | --- |
| TC-LG-001 | Menampilkan halaman login | Tidak | Ya |
| TC-LG-002 | Login ditolak ketika username dan password kosong | Tidak | Ya |
| TC-LG-003 | Login ditolak ketika username kosong | Tidak | Ya |
| TC-LG-004 | Login ditolak ketika password kosong | Tidak | Ya |
| TC-LG-005 | Toggle tampil/sembunyikan password login | Tidak | Ya |
| TC-LG-006 | Login ditolak ketika kredensial salah | Ya | Ya |
| TC-LG-007 | Login berhasil dengan kredensial valid | Ya, perlu data valid | Tidak |
| TC-LG-008 | Akses portal ditolak ketika belum login | Tidak | Ya |
| TC-LG-009 | Navigasi ke halaman lupa password admin | Tidak | Ya |
| TC-LG-010 | Lupa password ditolak ketika email kosong | Tidak | Ya |
| TC-LG-011 | Lupa password ditolak ketika format email salah | Tidak | Ya |
| TC-LG-012 | Lupa password menampilkan error ketika email tidak terdaftar | Ya | Ya |
| TC-LG-013 | Lupa password berhasil mengirim tautan reset | Ya, perlu email valid | Tidak |
| TC-LG-014 | Reset password tanpa token tidak dapat dikirim | Tidak | Ya |
| TC-LG-015 | Reset password ditolak ketika password baru kurang dari 6 karakter | Tidak | Ya |
| TC-LG-016 | Reset password ditolak ketika konfirmasi tidak sama | Tidak | Ya |
| TC-LG-017 | Toggle tampil/sembunyikan password reset | Tidak | Ya |
| TC-LG-018 | Reset password menampilkan error ketika token invalid | Ya | Ya |
| TC-LG-019 | Reset password berhasil dengan token valid | Ya, perlu token valid | Tidak |

## TC-LG-001 - Menampilkan halaman login

Tujuan: Memastikan halaman login tampil dengan elemen utama.

Prasyarat: User belum login dan `localStorage` bersih.

Data uji: Tidak ada.

Langkah:

1. Bersihkan `localStorage`.
2. Buka route `/`.
3. Verifikasi judul `Login` tampil.
4. Verifikasi input `Masukkan username` tampil.
5. Verifikasi input `Masukkan password` tampil.
6. Verifikasi tombol `Login` tampil.
7. Verifikasi link `Lupa password admin?` tampil.

Hasil yang diharapkan: Halaman login tampil lengkap dan siap digunakan.

## TC-LG-002 - Login ditolak ketika username dan password kosong

Tujuan: Memastikan form login tidak terkirim ketika seluruh field kosong.

Prasyarat: User belum login dan `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | kosong |
| Password | kosong |

Langkah:

1. Bersihkan `localStorage`.
2. Buka route `/`.
3. Klik tombol `Login` tanpa mengisi form.
4. Verifikasi input username berstatus invalid.
5. Verifikasi halaman tetap berada di route `/`.
6. Verifikasi token tidak tersimpan di `localStorage`.

Hasil yang diharapkan: Login ditolak oleh validasi wajib isi, user tetap di halaman login, dan token tidak dibuat.

## TC-LG-003 - Login ditolak ketika username kosong

Tujuan: Memastikan username wajib diisi.

Prasyarat: User belum login dan `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | kosong |
| Password | password123 |

Langkah:

1. Bersihkan `localStorage`.
2. Buka route `/`.
3. Isi password dengan `password123`.
4. Klik tombol `Login`.
5. Verifikasi input username berstatus invalid.
6. Verifikasi halaman tetap berada di route `/`.
7. Verifikasi token tidak tersimpan di `localStorage`.

Hasil yang diharapkan: Login ditolak karena username kosong.

## TC-LG-004 - Login ditolak ketika password kosong

Tujuan: Memastikan password wajib diisi.

Prasyarat: User belum login dan `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | petugas_gizi |
| Password | kosong |

Langkah:

1. Bersihkan `localStorage`.
2. Buka route `/`.
3. Isi username dengan `petugas_gizi`.
4. Klik tombol `Login`.
5. Verifikasi input password berstatus invalid.
6. Verifikasi halaman tetap berada di route `/`.
7. Verifikasi token tidak tersimpan di `localStorage`.

Hasil yang diharapkan: Login ditolak karena password kosong.

## TC-LG-005 - Toggle tampil/sembunyikan password login

Tujuan: Memastikan ikon mata mengubah mode tampilan password.

Prasyarat: Halaman login dapat dibuka.

Data uji:

| Field | Nilai |
| --- | --- |
| Password | password123 |

Langkah:

1. Buka route `/`.
2. Isi field password dengan `password123`.
3. Verifikasi tipe input password adalah `password`.
4. Klik ikon mata.
5. Verifikasi tipe input berubah menjadi `text`.
6. Klik ikon mata lagi.
7. Verifikasi tipe input kembali menjadi `password`.

Hasil yang diharapkan: Password dapat ditampilkan dan disembunyikan.

## TC-LG-006 - Login ditolak ketika kredensial salah

Tujuan: Memastikan sistem menolak username dan password yang tidak valid.

Prasyarat: Backend aktif, user belum login, dan `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | username_salah |
| Password | password_salah |

Langkah:

1. Bersihkan `localStorage`.
2. Buka route `/`.
3. Isi username dengan `username_salah`.
4. Isi password dengan `password_salah`.
5. Klik tombol `Login`.
6. Tunggu pesan error login muncul.
7. Verifikasi halaman tetap berada di route `/`.
8. Verifikasi token tidak tersimpan di `localStorage`.

Hasil yang diharapkan: Sistem menampilkan pesan error, user tetap di halaman login, dan token tidak dibuat.

## TC-LG-007 - Login berhasil dengan kredensial valid

Tujuan: Memastikan user bisa login ketika username dan password valid.

Prasyarat: Backend aktif, akun valid tersedia di database, dan `localStorage` bersih.

Data uji:

| Field | Nilai |
| --- | --- |
| Username | nilai variabel `validUsername` |
| Password | nilai variabel `validPassword` |

Langkah:

1. Sesuaikan variabel `validUsername`.
2. Sesuaikan variabel `validPassword`.
3. Bersihkan `localStorage`.
4. Buka route `/`.
5. Isi username valid.
6. Isi password valid.
7. Klik tombol `Login`.
8. Verifikasi URL berpindah ke `/portal`.
9. Verifikasi token tersimpan di `localStorage`.

Hasil yang diharapkan: Login berhasil, user diarahkan ke portal, dan token autentikasi tersimpan.

## TC-LG-008 - Akses portal ditolak ketika belum login

Tujuan: Memastikan route terlindungi tidak dapat diakses tanpa token.

Prasyarat: User belum login dan `localStorage` bersih.

Data uji: Tidak ada.

Langkah:

1. Bersihkan `localStorage`.
2. Buka route `/portal`.
3. Verifikasi sistem mengarahkan kembali ke route `/`.
4. Verifikasi form login tampil.

Hasil yang diharapkan: User tanpa token tidak dapat mengakses portal dan diarahkan ke halaman login.

## TC-LG-009 - Navigasi ke halaman lupa password admin

Tujuan: Memastikan link lupa password membuka halaman pemulihan password admin.

Prasyarat: Halaman login dapat dibuka.

Data uji: Tidak ada.

Langkah:

1. Buka route `/`.
2. Klik link `Lupa password admin?`.
3. Verifikasi URL berpindah ke `/lupa-password-admin`.
4. Verifikasi judul `Lupa Password Admin` tampil.
5. Verifikasi input email admin tampil.
6. Verifikasi tombol `Kirim Tautan Reset` tampil.
7. Klik link `Kembali ke login`.
8. Verifikasi URL kembali ke `/`.

Hasil yang diharapkan: User dapat membuka halaman lupa password dan kembali ke login.

## TC-LG-010 - Lupa password ditolak ketika email kosong

Tujuan: Memastikan email admin wajib diisi sebelum meminta tautan reset.

Prasyarat: Halaman lupa password dapat dibuka.

Data uji:

| Field | Nilai |
| --- | --- |
| Email Admin | kosong |

Langkah:

1. Buka route `/lupa-password-admin`.
2. Klik tombol `Kirim Tautan Reset`.
3. Verifikasi input email berstatus invalid.
4. Verifikasi halaman tetap berada di `/lupa-password-admin`.

Hasil yang diharapkan: Form tidak terkirim karena email kosong.

## TC-LG-011 - Lupa password ditolak ketika format email salah

Tujuan: Memastikan format email divalidasi oleh input email.

Prasyarat: Halaman lupa password dapat dibuka.

Data uji:

| Field | Nilai |
| --- | --- |
| Email Admin | email-tidak-valid |

Langkah:

1. Buka route `/lupa-password-admin`.
2. Isi email dengan `email-tidak-valid`.
3. Klik tombol `Kirim Tautan Reset`.
4. Verifikasi input email berstatus invalid.
5. Verifikasi halaman tetap berada di `/lupa-password-admin`.

Hasil yang diharapkan: Form tidak terkirim karena format email salah.

## TC-LG-012 - Lupa password menampilkan error ketika email tidak terdaftar

Tujuan: Memastikan sistem menampilkan error saat email admin tidak dikenali.

Prasyarat: Backend aktif.

Data uji:

| Field | Nilai |
| --- | --- |
| Email Admin | tidak.terdaftar@example.com |

Langkah:

1. Buka route `/lupa-password-admin`.
2. Isi email dengan `tidak.terdaftar@example.com`.
3. Klik tombol `Kirim Tautan Reset`.
4. Tunggu pesan error tampil.
5. Verifikasi halaman tetap berada di `/lupa-password-admin`.

Hasil yang diharapkan: Sistem menampilkan pesan error dan tidak mengirim tautan reset.

## TC-LG-013 - Lupa password berhasil mengirim tautan reset

Tujuan: Memastikan sistem dapat mengirim tautan reset untuk email admin valid.

Prasyarat: Backend aktif dan email admin valid tersedia.

Data uji:

| Field | Nilai |
| --- | --- |
| Email Admin | nilai variabel `validAdminEmail` |

Langkah:

1. Sesuaikan variabel `validAdminEmail`.
2. Buka route `/lupa-password-admin`.
3. Isi email admin valid.
4. Klik tombol `Kirim Tautan Reset`.
5. Tunggu pesan sukses tampil.
6. Verifikasi halaman tetap berada di `/lupa-password-admin`.

Hasil yang diharapkan: Sistem menampilkan pesan sukses pengiriman tautan reset.

## TC-LG-014 - Reset password tanpa token tidak dapat dikirim

Tujuan: Memastikan halaman reset tidak dapat melakukan submit tanpa token reset.

Prasyarat: Tidak ada token reset pada query URL.

Data uji: Tidak ada.

Langkah:

1. Buka route `/reset-password`.
2. Verifikasi judul `Reset Password Admin` tampil.
3. Verifikasi tombol `Simpan Password Baru` dalam status disabled.
4. Verifikasi input password baru tampil.
5. Verifikasi input konfirmasi password tampil.

Hasil yang diharapkan: Tombol submit reset password tidak aktif karena token tidak tersedia.

## TC-LG-015 - Reset password ditolak ketika password baru kurang dari 6 karakter

Tujuan: Memastikan password baru minimal 6 karakter.

Prasyarat: Route reset dibuka dengan token dummy.

Data uji:

| Field | Nilai |
| --- | --- |
| Token | token-dummy |
| Password Baru | abc |
| Konfirmasi Password | abc |

Langkah:

1. Buka route `/reset-password?token=token-dummy`.
2. Isi password baru dengan `abc`.
3. Isi konfirmasi password dengan `abc`.
4. Klik tombol `Simpan Password Baru`.
5. Verifikasi pesan error `Password baru minimal 6 karakter.` tampil.
6. Verifikasi halaman tetap berada di route reset password.

Hasil yang diharapkan: Reset password ditolak sebelum request ke backend.

## TC-LG-016 - Reset password ditolak ketika konfirmasi tidak sama

Tujuan: Memastikan konfirmasi password harus sama dengan password baru.

Prasyarat: Route reset dibuka dengan token dummy.

Data uji:

| Field | Nilai |
| --- | --- |
| Token | token-dummy |
| Password Baru | password123 |
| Konfirmasi Password | password456 |

Langkah:

1. Buka route `/reset-password?token=token-dummy`.
2. Isi password baru dengan `password123`.
3. Isi konfirmasi password dengan `password456`.
4. Klik tombol `Simpan Password Baru`.
5. Verifikasi pesan error `Konfirmasi password belum sama.` tampil.
6. Verifikasi halaman tetap berada di route reset password.

Hasil yang diharapkan: Reset password ditolak sebelum request ke backend.

## TC-LG-017 - Toggle tampil/sembunyikan password reset

Tujuan: Memastikan ikon mata pada halaman reset mengubah tipe kedua input password.

Prasyarat: Route reset dibuka dengan token dummy.

Data uji:

| Field | Nilai |
| --- | --- |
| Password Baru | password123 |
| Konfirmasi Password | password123 |

Langkah:

1. Buka route `/reset-password?token=token-dummy`.
2. Isi password baru dan konfirmasi password.
3. Verifikasi kedua input bertipe `password`.
4. Klik ikon mata pada input password baru.
5. Verifikasi kedua input berubah menjadi tipe `text`.
6. Klik ikon mata lagi.
7. Verifikasi kedua input kembali menjadi tipe `password`.

Hasil yang diharapkan: Kedua input password dapat ditampilkan dan disembunyikan.

## TC-LG-018 - Reset password menampilkan error ketika token invalid

Tujuan: Memastikan sistem menolak token reset yang tidak valid.

Prasyarat: Backend aktif.

Data uji:

| Field | Nilai |
| --- | --- |
| Token | token-invalid |
| Password Baru | passwordBaru123 |
| Konfirmasi Password | passwordBaru123 |

Langkah:

1. Buka route `/reset-password?token=token-invalid`.
2. Isi password baru dengan `passwordBaru123`.
3. Isi konfirmasi password dengan `passwordBaru123`.
4. Klik tombol `Simpan Password Baru`.
5. Tunggu pesan error tampil.
6. Verifikasi halaman tetap berada di route reset password.

Hasil yang diharapkan: Sistem menampilkan pesan error dan password tidak diubah.

## TC-LG-019 - Reset password berhasil dengan token valid

Tujuan: Memastikan admin dapat menyimpan password baru ketika token reset valid.

Prasyarat: Backend aktif dan token reset valid tersedia.

Data uji:

| Field | Nilai |
| --- | --- |
| Token | nilai variabel `validResetToken` |
| Password Baru | nilai variabel `newValidPassword` |
| Konfirmasi Password | nilai variabel `newValidPassword` |

Langkah:

1. Sesuaikan variabel `validResetToken`.
2. Sesuaikan variabel `newValidPassword`.
3. Buka route `/reset-password?token=${validResetToken}`.
4. Isi password baru.
5. Isi konfirmasi password dengan nilai yang sama.
6. Klik tombol `Simpan Password Baru`.
7. Tunggu pesan sukses tampil.
8. Verifikasi sistem mengarahkan user ke route `/`.

Hasil yang diharapkan: Password admin berhasil diubah dan user diarahkan kembali ke halaman login.
