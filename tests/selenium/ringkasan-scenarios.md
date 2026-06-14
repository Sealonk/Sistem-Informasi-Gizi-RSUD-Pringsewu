# Skenario Blackbox Testing Kategori Ringkasan Sistem

File Selenium IDE: `ringkasan-blackbox.side`

Base URL default: `http://localhost:3000`

Backend API dari `.env`: `http://localhost:5000`

Catatan sebelum menjalankan:
- Jalankan frontend dengan `npm start`.
- Pastikan backend aktif di `http://localhost:5000` karena Ringkasan Sistem memerlukan sinkronisasi data statistik dari dashboard API.
- Import file `tests/selenium/ringkasan-blackbox.side` ke Selenium IDE.
- Skenario TC-RS-005 membutuhkan minimal ada 1 data riwayat terakhir di dashboard.
- Token dummy digunakan untuk bypass autentikasi pada setiap skenario.

---

## TC-RS-001 - Menampilkan Halaman Ringkasan Sistem

Tujuan: Memastikan halaman `/ringkasan-sistem` menampilkan semua elemen antarmuka utama dengan benar setelah login.

Prasyarat: User telah login (token tersedia di `localStorage`).

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/ringkasan-sistem`.
3. Verifikasi judul `Ringkasan Sistem` tampil di header.
4. Verifikasi teks penjelasan "Ringkasan informasi perhitungan gizi pasien." tampil.
5. Verifikasi bagian `Aksi Cepat Pelayanan` tampil.
6. Verifikasi bagian `Riwayat Perhitungan Terakhir` tampil.
7. Verifikasi tombol `Kembali ke Portal` tampil di header.

Hasil yang diharapkan: Seluruh elemen utama Ringkasan Sistem berhasil dimuat secara visual.

---

## TC-RS-002 - Tombol Kembali ke Portal dari Ringkasan Sistem

Tujuan: Memastikan tombol "Kembali ke Portal" di header berhasil mengalihkan user ke halaman portal utama.

Prasyarat: User berada di halaman `/ringkasan-sistem`.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/ringkasan-sistem`.
3. Klik tombol `Kembali ke Portal` di header.
4. Verifikasi URL berubah menjadi `/portal`.

Hasil yang diharapkan: User dialihkan kembali ke portal utama.

---

## TC-RS-003 - Aksi Cepat: Mulai Perhitungan Gizi

Tujuan: Memastikan tombol "Mulai Perhitungan Gizi" di kartu Aksi Cepat mengarahkan user ke halaman daftar pasien kalkulasi.

Prasyarat: User berada di halaman `/ringkasan-sistem`.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/ringkasan-sistem`.
3. Klik tombol/kartu `Mulai Perhitungan Gizi` (mengandung teks "Mulai Perhitungan Gizi").
4. Verifikasi URL berubah menjadi `/perhitungan`.

Hasil yang diharapkan: User diarahkan ke halaman pilih pasien perhitungan gizi.

---

## TC-RS-004 - Aksi Cepat: Lihat Riwayat Asuhan

Tujuan: Memastikan tombol "Lihat Riwayat Asuhan" di kartu Aksi Cepat mengarahkan user ke halaman riwayat perhitungan.

Prasyarat: User berada di halaman `/ringkasan-sistem`.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/ringkasan-sistem`.
3. Klik tombol/kartu `Lihat Riwayat Asuhan` (mengandung teks "Lihat Riwayat Asuhan").
4. Verifikasi URL berubah menjadi `/riwayat`.

Hasil yang diharapkan: User diarahkan ke halaman riwayat.

---

## TC-RS-005 - Navigasi ke Detail Riwayat Terakhir

Tujuan: Memastikan tombol Detail (ikon ArrowRight) pada tabel riwayat terakhir di halaman ringkasan mengarahkan ke halaman detail perhitungan terkait.

Prasyarat: Terdapat minimal 1 riwayat terakhir pada tabel.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/ringkasan-sistem`.
3. Tunggu tabel "Riwayat Perhitungan Terakhir" muncul.
4. Klik tombol detail pada baris pertama (tombol `ArrowRight` di kolom paling kanan tabel).
5. Verifikasi URL berubah mencocokkan pattern `glob:*/riwayat/*`.
6. Verifikasi elemen detail riwayat tampil di halaman tujuan.

Hasil yang diharapkan: User diarahkan ke halaman detail riwayat pasien tersebut.

---

## TC-RS-006 - Navigasi ke Semua Riwayat

Tujuan: Memastikan tombol "Lihat Semua" di bagian header Riwayat Perhitungan Terakhir mengarahkan ke halaman `/riwayat`.

Prasyarat: User berada di halaman `/ringkasan-sistem`.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/ringkasan-sistem`.
3. Klik tombol `Lihat Semua` di samping judul "Riwayat Perhitungan Terakhir".
4. Verifikasi URL berubah menjadi `/riwayat`.

Hasil yang diharapkan: User dialihkan ke daftar seluruh riwayat perhitungan gizi.
