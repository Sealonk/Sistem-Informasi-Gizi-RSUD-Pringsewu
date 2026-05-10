/**
 * Menghitung Indeks Massa Tubuh (IMT) dan Status Gizi
 * Berdasarkan tabel batas ambang IMT untuk Indonesia
 */
const hitungIMT = (beratBadanKg, tinggiBadanCm) => {
    // Konversi tinggi badan ke meter
    const tinggiBadanM = tinggiBadanCm / 100;
    
    // Rumus IMT = BB / (TB * TB)
    const imt = beratBadanKg / (tinggiBadanM * tinggiBadanM);
    // Membulatkan 2 angka di belakang koma
    const nilaiIMT = parseFloat(imt.toFixed(2));

    let statusGizi = '';
    // Mengacu pada tabel ambang batas IMT Indonesia (Modifikasi untuk simplifikasi UI)
    if (nilaiIMT < 18.5) {
        statusGizi = 'Kurang Gizi';
    } else if (nilaiIMT >= 18.5 && nilaiIMT <= 25.0) {
        statusGizi = 'Normal';
    } else {
        statusGizi = 'Obesitas';
    }

    return { nilaiIMT, statusGizi };
};

/**
 * Menentukan Kelompok Umur
 */
const getKelompokUmur = (umur) => {
    if (umur >= 0 && umur <= 5) return 'Balita (0-5 Tahun)';
    if (umur >= 6 && umur <= 11) return 'Anak-anak (6-11 Tahun)';
    if (umur >= 12 && umur <= 18) return 'Remaja (12-18 Tahun)';
    if (umur >= 19 && umur <= 59) return 'Dewasa (19-59 Tahun)';
    if (umur >= 60) return 'Lansia (>= 60 Tahun)';
    return 'Tidak Diketahui';
};

/**
 * Menghitung Basal Metabolic Rate (BMR) menggunakan persamaan Mifflin-St. Jeor
 * Rumus Laki-laki: (10 x BB) + (6.25 x TB) - (5 x Umur) + 5
 * Rumus Perempuan: (10 x BB) + (6.25 x TB) - (5 x Umur) - 161
 */
const hitungBMR = (jenisKelamin, beratBadan, tinggiBadan, umur) => {
    let bmr = 0;
    if (jenisKelamin === 'L') {
        bmr = (10 * beratBadan) + (6.25 * tinggiBadan) - (5 * umur) + 5;
    } else if (jenisKelamin === 'P') {
        bmr = (10 * beratBadan) + (6.25 * tinggiBadan) - (5 * umur) - 161;
    }
    return bmr;
};

/**
 * Mengambil nilai multiplier (pengali) untuk Aktivitas Fisik
 */
const getNilaiAktivitasFisik = (aktivitas) => {
    switch (aktivitas) {
        case 'Istirahat Total': return 1.2;
        case 'Ringan': return 1.3;
        case 'Sedang': return 1.4;
        case 'Berat': return 1.5;
        default: return 1.2;
    }
};

/**
 * Mengambil nilai multiplier (pengali) untuk Faktor Stres
 */
const getNilaiFaktorStres = (stres) => {
    switch (stres) {
        case 'Ringan': return 1.2; // Bedah Minor / Infeksi Ringan
        case 'Sedang': return 1.4; // Sepsis / Bedah Mayor
        case 'Berat': return 1.6;  // Trauma / Kritis
        default: return 1.0;       // Tidak ada stress (default)
    }
};

/**
 * FUNGSI UTAMA: Kalkulasi Total Kebutuhan Gizi & Makronutrien
 * Memproses semua parameter dari Step 1 - 7 menjadi hasil di Step 8
 */
const kalkulasiGiziTotal = (data) => {
    const {
        umur,
        jenis_kelamin,
        berat_badan,
        tinggi_badan,
        diagnosa_penyakit, // Array string, misal: ['Diabetes Melitus', 'CKD (Ginjal)']
        aktivitas_fisik,
        status_hemodialisa,
        penambahan_kalori, // angka: 0, 300, 500
        faktor_stres
    } = data;

    // 1. Hitung BMR (Mifflin)
    const bmr = hitungBMR(jenis_kelamin, berat_badan, tinggi_badan, umur);

    // 2. Dapatkan nilai pengali
    const f_aktivitas = getNilaiAktivitasFisik(aktivitas_fisik);
    const f_stres = getNilaiFaktorStres(faktor_stres);

    // 3. Hitung Total Energy Expenditure (TEE)
    // Rumus TEE = BMR * Faktor Aktivitas * Faktor Stres + Penambahan Kalori
    let totalEnergi = (bmr * f_aktivitas * f_stres) + Number(penambahan_kalori);

    // 4. Hitung Makronutrien (Protein, Lemak, Karbohidrat)
    let proteinGram = 0;
    let lemakGram = 0;
    let karbohidratGram = 0;

    // A. Logika Perhitungan Protein
    // Cek apakah ada penyakit Ginjal (CKD)
    const isCKD = diagnosa_penyakit.includes('CKD (Ginjal)');
    
    if (isCKD && status_hemodialisa === 'Tidak') {
        // CKD Pradialisis: Restriksi Protein (Rendah Protein) = 0.6 g/kg BB
        proteinGram = 0.6 * berat_badan;
    } else if (isCKD && status_hemodialisa === 'Iya') {
        // CKD Hemodialisis: Tinggi Protein untuk mengganti yang hilang = 1.2 g/kg BB
        proteinGram = 1.2 * berat_badan;
    } else if (faktor_stres === 'Berat' || faktor_stres === 'Sedang') {
        // Kondisi Pasca Bedah / Stres Tinggi / Kanker: Tinggi Protein (TKTP) = 1.5 g/kg BB
        proteinGram = 1.5 * berat_badan;
    } else {
        // Kondisi Normal / Diabetes / Lambung: Standar Dewasa Sehat = 1.0 g/kg BB
        proteinGram = 1.0 * berat_badan;
    }

    // Hitung kalori dari protein (1 gram = 4 kkal)
    const kaloriProtein = proteinGram * 4;

    // B. Logika Perhitungan Lemak
    // Secara standar lemak adalah 20% - 25% dari Total Energi
    const isStrokeAtauJantung = diagnosa_penyakit.includes('Stroke') || diagnosa_penyakit.includes('CHF (Jantung)');
    
    let persentaseLemak = 0.25; // Default 25%
    if (isStrokeAtauJantung) {
        persentaseLemak = 0.20; // Diet rendah kolesterol/lemak untuk Kardiovaskular & Stroke (20%)
    }
    
    const kaloriLemak = totalEnergi * persentaseLemak;
    lemakGram = kaloriLemak / 9; // 1 gram lemak = 9 kkal

    // C. Logika Perhitungan Karbohidrat (By Difference)
    // Sesuai Tinjauan Pustaka: Sisa energi total dikurangi energi protein dan lemak
    const sisaKaloriUntukKarbo = totalEnergi - kaloriProtein - kaloriLemak;
    karbohidratGram = sisaKaloriUntukKarbo / 4; // 1 gram karbohidrat = 4 kkal

    // Pembulatan hasil akhir
    return {
        bmr: parseFloat(bmr.toFixed(2)),
        faktor_aktivitas_nilai: f_aktivitas,
        faktor_stres_nilai: f_stres,
        kebutuhan_energi_total: parseFloat(totalEnergi.toFixed(2)),
        protein_gram: parseFloat(proteinGram.toFixed(2)),
        lemak_gram: parseFloat(lemakGram.toFixed(2)),
        karbohidrat_gram: parseFloat(karbohidratGram.toFixed(2))
    };
};

module.exports = {
    hitungIMT,
    getKelompokUmur,
    kalkulasiGiziTotal
};