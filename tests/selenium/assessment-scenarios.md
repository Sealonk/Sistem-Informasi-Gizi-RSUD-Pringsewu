# Skenario Pengujian Blackbox — Modul Assessment Gizi

Dokumen ini mendokumentasikan skenario pengujian blackbox menggunakan Selenium IDE untuk modul **Assessment Gizi** pada Sistem Informasi Gizi RSUD Pringsewu, dengan pemetaan terhadap aspek-aspek fokus pengujian wajib.

---

## 1. Pemetaan Aspek Fokus Pengujian

Setiap skenario pengujian dirancang untuk memenuhi satu atau beberapa fokus aspek pengujian berikut:

1. **Kebutuhan Fungsional (Functional Testing)**: Memastikan setiap fitur dan fungsi berjalan sesuai spesifikasi kebutuhan (requirement) perhitungan gizi klinis.
2. **Antarmuka Pengguna (User Interface/UI)**: Memeriksa apakah tampilan visual, tombol, menu, hingga formulir interaktif disajikan dengan benar.
3. **Kesalahan Fungsionalitas (Functionality Errors)**: Menemukan bug terkait fungsi yang tidak berjalan atau salah memproses data (seperti ketidaksesuaian validasi).
4. **Masukan dan Keluaran (Input/Output)**: Menguji berbagai skenario data yang dimasukkan untuk melihat apakah sistem menghasilkan keluaran yang diharapkan (seperti estimasi berat badan dari LILA & ULNA).
5. **Kesalahan Inisialisasi dan Terminasi (Initialization & Termination)**: Memeriksa apakah aplikasi dapat dimulai (pemuatan data awal) dan ditutup (keluar/kembali) dengan normal tanpa error.

---

## 2. Prasyarat Pengujian
1. **Pengguna Terautentikasi**: Pengujian disimulasikan menggunakan akun Petugas Gizi yang valid dengan menyuntikkan token JWT ke dalam `localStorage` sebelum membuka halaman.
2. **Pasien Terpilih**: Pengujian dilakukan dengan memilih pasien dari halaman `/perhitungan` agar data dasar pasien ter-populate di halaman `/assessment`.

---

## 3. Daftar Skenario Pengujian

### **TC-AS-001: Menampilkan Halaman Assessment Gizi & Identitas Pasien**
* **Fokus Pengujian**: 
  * `[UI]` Antarmuka Pengguna (UI)
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memverifikasi bahwa halaman Assessment Gizi berhasil diinisialisasi dengan memuat seluruh data dasar pasien yang dipilih dari database, dan kolom-kolom identitas pasien terkunci (read-only) untuk mencegah edit ilegal.
* **Langkah-Langkah**:
  1. Jalankan autentikasi dengan menyuntikkan token JWT ke `localStorage`.
  2. Buka halaman `/perhitungan`.
  3. Pilih pasien pertama di tabel dengan menekan tombol **"Pilih"**.
  4. Konfirmasi pilihan di modal dengan menekan tombol **"Pilih Pasien"**.
  5. Tunggu rute dialihkan ke `/assessment`.
  6. Verifikasi judul halaman adalah `"Assessment Gizi"`.
  7. Verifikasi kolom **Nama Pasien**, **Nomor Rekam Medis**, **Umur**, dan **Ruangan** berstatus `readOnly`.
  8. Verifikasi tombol pilihan **Jenis Kelamin** (Laki-laki/Perempuan) berstatus `disabled`.
* **Hasil yang Diharapkan**: Halaman terinisialisasi secara normal tanpa error dan seluruh identitas pasien terkunci secara aman.

---

### **TC-AS-002: Validasi Input Berat Badan dan Tinggi Badan**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memastikan sistem menampilkan pesan kesalahan validasi jika input Berat Badan (BB) atau Tinggi Badan (TB) bernilai kosong atau tidak valid saat disubmit.
* **Langkah-Langkah**:
  1. Jalankan alur navigasi pilih pasien hingga masuk ke halaman `/assessment`.
  2. Kosongkan nilai input pada kolom **Berat Badan (BB)**.
  3. Kosongkan nilai input pada kolom **Tinggi Badan (TB)**.
  4. Tekan tombol **"Simpan & Lanjut"** di bagian bawah halaman.
  5. Verifikasi munculnya pesan error validasi:
     * `Berat badan wajib diisi dengan benar`
     * `Tinggi badan wajib diisi dengan benar`
  6. Isi kolom BB dengan nilai `65`.
  7. Isi kolom TB dengan nilai `168`.
  8. Verifikasi pesan kesalahan validasi hilang dari layar.
* **Hasil yang Diharapkan**: Form menolak proses simpan jika berat badan dan tinggi badan kosong, serta menghapus error begitu nilai valid diisi.

---

### **TC-AS-003: Estimasi Antropometri Menggunakan LILA & ULNA**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Menguji fitur estimasi Berat Badan (BB) dan Tinggi Badan (TB) berdasarkan input Lingkar Lengan Atas (LILA) dan panjang tulang ULNA ketika toggle estimasi diaktifkan.
* **Langkah-Langkah**:
  1. Jalankan alur navigasi pilih pasien hingga masuk ke halaman `/assessment`.
  2. Klik tombol toggle **"Gunakan Estimasi Berat dan Tinggi Badan"**.
  3. Verifikasi input kolom **LILA** dan **ULNA** muncul di layar (UI Update).
  4. Kosongkan input LILA dan ULNA, lalu klik **"Simpan & Lanjut"**.
  5. Verifikasi munculnya pesan error validasi:
     * `LILA wajib diisi untuk estimasi`
     * `ULNA wajib diisi untuk estimasi`
  6. Isi kolom LILA dengan nilai `28` (cm).
  7. Isi kolom ULNA dengan nilai `24` (cm).
  8. Verifikasi bahwa kolom **Berat Badan (BB)** dan **Tinggi Badan (TB)** secara otomatis terisi oleh nilai hasil perhitungan rumus estimasi (Output).
* **Hasil yang Diharapkan**: Input LILA & ULNA mendeteksi validasi wajib jika diaktifkan, dan otomatis mengestimasi nilai BB & TB secara real-time setelah diisi.

---

### **TC-AS-004: Penyakit CKD dan Validasi Hemodialisa**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[UI]` Antarmuka Pengguna (UI)
* **Tujuan**: Memverifikasi bahwa memilih penyakit CKD (Chronic Kidney Disease) memunculkan kolom status hemodialisa dan memicu validasi wajib pilih status hemodialisa.
* **Langkah-Langkah**:
  1. Jalankan alur navigasi pilih pasien hingga masuk ke halaman `/assessment`.
  2. Centang kotak checkbox penyakit **"CKD"** (Gagal Ginjal Kronik).
  3. Verifikasi dropdown pilihan **"Status Hemodialisa"** muncul di layar (UI Dinamis).
  4. Klik tombol **"Simpan & Lanjut"** tanpa memilih status hemodialisa.
  5. Verifikasi munculnya pesan error: `Status hemodialisa wajib dipilih untuk pasien CKD`.
  6. Klik dropdown status hemodialisa dan pilih opsi **"Ya Hemodialisa"**.
  7. Verifikasi pesan error menghilang.
* **Hasil yang Diharapkan**: Status hemodialisa wajib dipilih begitu penyakit CKD diaktifkan.

---

### **TC-AS-005: Aturan Logika Penyakit Terhadap Aktivitas Fisik & Faktor Stress**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Bug]` Kesalahan Fungsionalitas
* **Tujuan**: Menguji logika bisnis di mana pasien penyakit Stroke saja (Stroke Only) dibebaskan dari input Aktivitas Fisik dan Faktor Stress, sedangkan penyakit lainnya wajib mengisi.
* **Langkah-Langkah**:
  1. Jalankan alur navigasi pilih pasien hingga masuk ke halaman `/assessment`.
  2. Centang checkbox penyakit **"Stroke"** dan matikan penyakit **"Mifflin"**.
  3. Verifikasi dropdown **Aktivitas Fisik** dan **Faktor Stress** menjadi non-aktif (`disabled`) karena sistem otomatis mem-bypass faktor ini untuk kasus stroke murni.
  4. Hapus centang penyakit Stroke, kemudian centang **"Diabetes Mellitus (DM)"**.
  5. Verifikasi dropdown **Aktivitas Fisik** dan **Faktor Stress** kembali aktif.
  6. Biarkan kedua dropdown kosong dan klik **"Simpan & Lanjut"**.
  7. Verifikasi munculnya pesan kesalahan:
     * `Aktivitas fisik wajib dipilih`
     * `Faktor stress wajib dipilih`
* **Hasil yang Diharapkan**: Logika disable/enable dropdown aktivitas & stress berfungsi tepat sesuai diagnosis penyakit terpilih, mencegah bug data kotor di database.

---

### **TC-AS-006: Validasi Sliders Makronutrien**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memverifikasi bahwa rentang persentase makronutrien (Protein, Lemak, Karbohidrat) dinilai validasinya dan menampilkan pesan kesalahan jika total melebihi rentang klinis.
* **Langkah-Langkah**:
  1. Jalankan alur navigasi pilih pasien hingga masuk ke halaman `/assessment`.
  2. Klik penyakit **"Diabetes Mellitus"** dan matikan **"Mifflin"**.
  3. Tunggu hingga slider makronutrien muncul di bagian bawah.
  4. Ubah slider **Lemak** menjadi `20%` (Protein default 10%, menghasilkan Karbohidrat otomatis 70% di mana batas maksimal DM adalah 65%).
  5. Klik tombol **"Simpan & Lanjut"**.
  6. Verifikasi munculnya pesan kesalahan: `Karbohidrat harus berada di antara 45% - 65%`.
* **Hasil yang Diharapkan**: Slider memproses input persentase dan memvalidasi proporsinya sesuai standar asuhan gizi klinis.

---

### **TC-AS-007: Tombol Kembali dari Halaman Assessment**
* **Fokus Pengujian**: 
  * `[Init/Term]` Kesalahan Inisialisasi dan Terminasi
* **Tujuan**: Memastikan tombol kembali (kembali ke pilih pasien) berfungsi mengalihkan rute ke halaman pemilihan pasien semula secara normal tanpa memicu crash aplikasi (normal termination).
* **Langkah-Langkah**:
  1. Buka halaman `/assessment` dengan data pasien ter-populate.
  2. Cari dan klik tombol **"Kembali"** (di sebelah tombol Simpan & Lanjut).
  3. Verifikasi rute URL dialihkan kembali ke `/perhitungan`.
  4. Verifikasi bahwa judul halaman yang aktif adalah `"Perhitungan Gizi"`.
* **Hasil yang Diharapkan**: Aplikasi kembali ke modul awal dengan normal tanpa memicu error memori atau crash rute.

---

### **TC-AS-008: Penambahan Energi untuk Pasien Laki-laki (Disabled)**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[UI]` Antarmuka Pengguna (UI)
* **Tujuan**: Memastikan penambahan energi (kehamilan) dinonaktifkan secara otomatis jika pasien yang dipilih berjenis kelamin laki-laki.
* **Langkah-Langkah**:
  1. Buka halaman `/perhitungan` dan pilih pasien laki-laki (baris ke-2: `M. YUSUF`).
  2. Klik konfirmasi **"Pilih Pasien"** di modal.
  3. Tunggu rute dialihkan ke `/assessment`.
  4. Cari card **"Penambahan Energi"**.
  5. Verifikasi adanya teks pemberitahuan: `Penambahan energi tidak tersedia untuk pasien laki-laki.`.
  6. Verifikasi tombol pilihan **Trimester 1**, **Trimester 2**, **Trimester 3**, dan **Tidak ada** dalam keadaan tidak aktif (`disabled`).
* **Hasil yang Diharapkan**: Fitur penambahan energi dinonaktifkan sepenuhnya untuk pasien laki-laki demi kepatuhan klinis.

---

### **TC-AS-009: Penambahan Energi untuk Pasien Perempuan (Enabled)**
* **Fokus Pengujian**: 
  * `[Fungsional]` Kebutuhan Fungsional
  * `[Input/Output]` Masukan dan Keluaran
* **Tujuan**: Memastikan fitur penambahan energi aktif untuk pasien perempuan, dan pilihan trimester memperbarui kebutuhan energi secara real-time.
* **Langkah-Langkah**:
  1. Buka halaman `/perhitungan` dan pilih pasien perempuan (baris ke-1: `RUMIYEM NY`).
  2. Klik konfirmasi **"Pilih Pasien"** di modal.
  3. Tunggu rute dialihkan ke `/assessment`.
  4. Cari card **"Penambahan Energi"**.
  5. Verifikasi tombol pilihan trimester dan tidak ada dalam keadaan aktif (`enabled`).
  6. Klik tombol **"Trimester 1"**.
  7. Verifikasi tombol Trimester 1 mendapat highlight biru (active class).
  8. Verifikasi deskripsi di bawah berubah menjadi: `Trimester 1 — Penambahan energi sebesar 300 kkal.` (atau 180 kkal untuk pasien DM).
* **Hasil yang Diharapkan**: Tombol penambahan energi dapat dipilih dengan normal dan memperbarui keterangan klinis.

---

## 4. Hasil Eksekusi Pengujian Otomatis (PASS)

Seluruh 9 skenario pengujian di atas telah dijalankan menggunakan runner Selenium IDE (`selenium-side-runner`) dengan hasil **100% SUKSES (9/9 passed)**:

```bash
PASS node_modules/selenium-side-runner/dist/main.test.js (34.26 s)
  Running project Blackbox Testing - Assessment Gizi
    Running suite Kategori Assessment Gizi
      √ Running test TC-AS-001 - Menampilkan Halaman Assessment Gizi & Identitas Pasien (4536 ms)
      √ Running test TC-AS-002 - Validasi Input Berat Badan dan Tinggi Badan (3796 ms)
      √ Running test TC-AS-003 - Estimasi Antropometri Menggunakan LILA & ULNA (3989 ms)
      √ Running test TC-AS-004 - Penyakit CKD dan Validasi Hemodialisa (3398 ms)
      √ Running test TC-AS-005 - Aturan Logika Penyakit Terhadap Aktivitas Fisik & Faktor Stress (3282 ms)
      √ Running test TC-AS-006 - Validasi Sliders Makronutrien (3415 ms)
      √ Running test TC-AS-007 - Tombol Kembali dari Halaman Assessment (3160 ms)
      √ Running test TC-AS-008 - Penambahan Energi untuk Pasien Laki-laki (Disabled) (3312 ms)
      √ Running test TC-AS-009 - Penambahan Energi untuk Pasien Perempuan (Enabled) (4136 ms)
```

