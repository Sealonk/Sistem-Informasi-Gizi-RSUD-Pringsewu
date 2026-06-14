# Skenario Blackbox Testing Kategori Riwayat

File Selenium IDE: `riwayat-blackbox.side`

Base URL default: `http://localhost:3000`

Backend API dari `.env`: `http://localhost:5000`

Catatan sebelum menjalankan:
- Jalankan frontend dengan `npm start`.
- Pastikan backend aktif di `http://localhost:5000`.
- Import file `tests/selenium/riwayat-blackbox.side` ke Selenium IDE.
- Skenario TC-RW-005 s/d TC-RW-010 membutuhkan minimal ada 1 data riwayat tersimpan di sistem.
- Token dummy digunakan untuk bypass autentikasi pada setiap skenario.

---

## TC-RW-001 - Menampilkan Halaman Riwayat Perhitungan

Tujuan: Memastikan halaman `/riwayat` menampilkan semua elemen antarmuka utama dengan benar setelah login.

Prasyarat: User telah login (token tersedia di `localStorage`).

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Verifikasi judul `Riwayat Perhitungan` tampil.
4. Verifikasi teks penjelasan di bawah judul tampil.
5. Verifikasi tab `Perhitungan Gizi` tampil.
6. Verifikasi field pencarian `Cari Pasien` tampil.
7. Verifikasi dropdown `Filter Penyakit` tampil.
8. Verifikasi input date `Filter Tanggal` tampil.
9. Verifikasi tombol `Kembali ke Portal` tampil.

Hasil yang diharapkan: Seluruh elemen halaman utama riwayat tampil lengkap dan siap digunakan.

---

## TC-RW-002 - Pencarian Riwayat Berdasarkan Nama

Tujuan: Memastikan field pencarian dapat diisi kata kunci pencarian tanpa mengalami error fatal.

Prasyarat: User berada di halaman `/riwayat`.

Data Uji:
- Kata kunci: `Pasien`

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Masukkan teks `Pasien` pada field pencarian "Cari Pasien".
4. Verifikasi tabel diperbarui tanpa error (tidak ada crash).

Hasil yang diharapkan: Pencarian dieksekusi oleh sistem tanpa error visual.

---

## TC-RW-003 - Filter Riwayat Berdasarkan Penyakit

Tujuan: Memastikan dropdown filter penyakit dapat dipilih untuk memperbarui daftar data.

Prasyarat: User berada di halaman `/riwayat`.

Data Uji:
- Penyakit: `DM`

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Pilih opsi `DM` pada dropdown "Filter Penyakit".
4. Verifikasi pilihan dropdown berubah menjadi `DM`.
5. Verifikasi tabel diperbarui tanpa crash.

Hasil yang diharapkan: Filter penyakit berhasil dipilih dan memicu pembaruan tabel.

---

## TC-RW-004 - Filter Riwayat Berdasarkan Tanggal

Tujuan: Memastikan input tanggal filter dapat diubah nilainya.

Prasyarat: User berada di halaman `/riwayat`.

Data Uji:
- Tanggal: `2026-06-08`

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Isi field "Filter Tanggal" dengan tanggal `2026-06-08`.
4. Verifikasi nilai tanggal diubah dengan benar.
5. Verifikasi tabel diperbarui tanpa crash.

Hasil yang diharapkan: Filter tanggal berfungsi dan memicu penyaringan data.

---

## TC-RW-005 - Navigasi ke Detail Riwayat

Tujuan: Memastikan user dapat masuk ke halaman detail riwayat dengan mengeklik tombol Detail (ikon Eye) pada tabel.

Prasyarat: Terdapat minimal 1 data riwayat di tabel.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Tunggu baris pertama tabel data riwayat muncul.
4. Klik tombol `Detail` (tombol pertama di kolom Action, ikon Eye).
5. Verifikasi URL berubah mencocokkan pattern `glob:*/riwayat/*`.
6. Verifikasi elemen detail riwayat (Hasil Perhitungan, Kebutuhan Energi, Antropometri) tampil.

Hasil yang diharapkan: Halaman detail riwayat dimuat dengan sukses.

---

## TC-RW-006 - Tombol Kembali ke Riwayat dari Halaman Detail

Tujuan: Memastikan tombol "Kembali ke Riwayat" di halaman detail mengarahkan kembali ke daftar riwayat.

Prasyarat: User berada di halaman detail riwayat `/riwayat/:id`.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Tunggu baris pertama tabel muncul, lalu klik tombol `Detail` untuk masuk ke halaman detail.
4. Tunggu halaman detail riwayat selesai dimuat.
5. Klik tombol `Kembali ke Riwayat` di bagian bawah halaman detail.
6. Verifikasi URL berubah menjadi `/riwayat`.

Hasil yang diharapkan: User berhasil diarahkan kembali ke halaman daftar riwayat.

---

## TC-RW-007 - Tombol Kembali ke Portal dari Halaman Detail

Tujuan: Memastikan tombol "Kembali ke Portal" di halaman detail mengarahkan kembali ke halaman portal utama.

Prasyarat: User berada di halaman detail riwayat `/riwayat/:id`.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Tunggu baris pertama tabel muncul, lalu klik tombol `Detail` untuk masuk ke halaman detail.
4. Tunggu halaman detail riwayat selesai dimuat.
5. Klik tombol `Kembali ke Portal` di bagian bawah halaman detail.
6. Verifikasi URL berubah menjadi `/portal`.

Hasil yang diharapkan: User berhasil diarahkan kembali ke halaman portal utama.

---

## TC-RW-008 - Tombol Kembali ke Portal dari Halaman Riwayat

Tujuan: Memastikan tombol "Kembali ke Portal" di halaman utama riwayat mengarahkan kembali ke portal utama.

Prasyarat: User berada di halaman `/riwayat`.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Klik tombol `Kembali ke Portal` di bagian header.
4. Verifikasi URL berubah menjadi `/portal`.

Hasil yang diharapkan: User berhasil dialihkan kembali ke portal.

---

## TC-RW-009 - Membatalkan Penghapusan Riwayat

Tujuan: Memastikan dialog konfirmasi hapus riwayat dapat dibatalkan (Cancel) dan data tidak terhapus.

Prasyarat: Terdapat minimal 1 data riwayat di tabel.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Tunggu baris pertama tabel data riwayat muncul.
4. Klik tombol `Hapus` (tombol kedua di kolom Action, ikon Trash).
5. Sistem akan menampilkan dialog konfirmasi browser (`window.confirm`).
6. Batalkan konfirmasi (pilih `Cancel` / dismiss dialog).
7. Verifikasi modal konfirmasi tertutup dan URL tetap `/riwayat`.

Hasil yang diharapkan: Penghapusan dibatalkan dan data tetap utuh.

---

## TC-RW-010 - Menghapus Riwayat

Tujuan: Memastikan data riwayat dapat dihapus dari tabel dengan menyetujui (OK) dialog konfirmasi.

Prasyarat: Terdapat minimal 1 data riwayat di tabel.

Langkah:
1. Suntikkan token dummy ke `localStorage`.
2. Buka halaman `/riwayat`.
3. Tunggu baris pertama tabel data riwayat muncul.
4. Klik tombol `Hapus` (tombol kedua di kolom Action, ikon Trash).
5. Sistem akan menampilkan dialog konfirmasi browser (`window.confirm`).
6. Setujui konfirmasi (pilih `OK` / accept dialog).
7. Verifikasi baris riwayat berhasil dihapus atau tabel dimuat ulang.

Hasil yang diharapkan: Riwayat berhasil dihapus dari sistem.
