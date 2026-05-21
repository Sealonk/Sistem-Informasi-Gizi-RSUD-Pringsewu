// ==========================================
// UTILS: rumusGizi.js (Pembaruan Assessment Lengkap)
// ==========================================

const hitungIMT = (beratBadanKg, tinggiBadanCm) => {
    const tinggiBadanM = tinggiBadanCm / 100;
    const imt = beratBadanKg / (tinggiBadanM * tinggiBadanM);
    const nilaiIMT = parseFloat(imt.toFixed(2));

    let statusGizi = '';
    if (nilaiIMT < 18.5) statusGizi = 'Kurang Gizi';
    else if (nilaiIMT >= 18.5 && nilaiIMT <= 25.0) statusGizi = 'Normal';
    else statusGizi = 'Obesitas';

    return { nilaiIMT, statusGizi };
};

const getKelompokUmur = (umur) => {
    if (umur >= 0 && umur <= 5) return 'Balita (0-5 Tahun)';
    if (umur >= 6 && umur <= 11) return 'Anak-anak (6-11 Tahun)';
    if (umur >= 12 && umur <= 18) return 'Remaja (12-18 Tahun)';
    if (umur >= 19 && umur <= 59) return 'Dewasa (19-59 Tahun)';
    if (umur >= 60) return 'Lansia (>= 60 Tahun)';
    return 'Tidak Diketahui';
};

// --- Rumus BMR Mifflin ---
const hitungBMR_Mifflin = (jenisKelamin, beratBadan, tinggiBadan, umur) => {
    if (jenisKelamin === 'L') return (10 * beratBadan) + (6.25 * tinggiBadan) - (5 * umur) + 5;
    return (10 * beratBadan) + (6.25 * tinggiBadan) - (5 * umur) - 161;
};

// --- Rumus BMR WHO (Standar Umum) ---
const hitungBMR_WHO = (jenisKelamin, beratBadan, umur) => {
    let bmr = 0;
    if (jenisKelamin === 'L') {
        if (umur >= 18 && umur <= 30) bmr = (15.3 * beratBadan) + 679;
        else if (umur >= 31 && umur <= 60) bmr = (11.6 * beratBadan) + 879;
        else if (umur > 60) bmr = (13.5 * beratBadan) + 487;
    } else {
        if (umur >= 18 && umur <= 30) bmr = (14.7 * beratBadan) + 496;
        else if (umur >= 31 && umur <= 60) bmr = (8.7 * beratBadan) + 829;
        else if (umur > 60) bmr = (10.5 * beratBadan) + 596;
    }
    return bmr;
};

const getNilaiAktivitasFisik = (aktivitas) => {
    switch (aktivitas) {
        case 'Bed rest': return 1.2;
        case 'Ringan': return 1.3;
        case 'Sedang': return 1.4;
        case 'Berat': return 1.5;
        default: return 1.2;
    }
};

const getNilaiFaktorStres = (stres) => {
    switch (stres) {
        case 'Ringan': return 1.2; 
        case 'Sedang': return 1.4; 
        case 'Berat': return 1.6;  
        default: return 1.0; // Normal       
    }
};

const dapatkanPenambahanEnergi = (kategori, jenis_kelamin) => {
    if (jenis_kelamin === 'L') return 0;
    
    switch (kategori) {
        case 'Kehamilan': return 300; // Standar penambahan Trimester 2/3
        case 'Menyusui': return 500;
        default: return 0;
    }
};

const kalkulasiGiziTotal = (data) => {
    const {
        umur, jenis_kelamin, berat_badan, tinggi_badan, diagnosa_penyakit, 
        aktivitas_fisik, faktor_stres, status_hemodialisa, 
        kategori_penambahan_energi, metode_perhitungan
    } = data;

    // 1. Pemilihan Metode BMR
    let bmr = 0;
    if (metode_perhitungan === 'WHO') {
        bmr = hitungBMR_WHO(jenis_kelamin, berat_badan, umur);
    } else {
        bmr = hitungBMR_Mifflin(jenis_kelamin, berat_badan, tinggi_badan, umur);
    }

    // 2. Faktor Pengali & Penambahan Energi
    const f_aktivitas = getNilaiAktivitasFisik(aktivitas_fisik);
    const f_stres = getNilaiFaktorStres(faktor_stres);
    const penambahan_kalori = dapatkanPenambahanEnergi(kategori_penambahan_energi, jenis_kelamin);

    // 3. Total Energi
    let totalEnergi = (bmr * f_aktivitas * f_stres) + penambahan_kalori;

    // 4. Hitung Makronutrien (Menggunakan By Difference)
    let proteinGram = 0;
    const isCKD = diagnosa_penyakit.includes('CKD (Ginjal)') || diagnosa_penyakit.includes('CKD');
    
    if (isCKD && status_hemodialisa === 'Tidak') proteinGram = 0.6 * berat_badan;
    else if (isCKD && status_hemodialisa === 'Iya') proteinGram = 1.2 * berat_badan;
    else if (faktor_stres === 'Berat' || faktor_stres === 'Sedang') proteinGram = 1.5 * berat_badan;
    else proteinGram = 1.0 * berat_badan;

    const kaloriProtein = proteinGram * 4;

    const isStrokeAtauJantung = diagnosa_penyakit.includes('Stroke') || diagnosa_penyakit.includes('CHF');
    let persentaseLemak = isStrokeAtauJantung ? 0.20 : 0.25;
    
    const kaloriLemak = totalEnergi * persentaseLemak;
    const lemakGram = kaloriLemak / 9; 

    const sisaKaloriUntukKarbo = totalEnergi - kaloriProtein - kaloriLemak;
    const karbohidratGram = sisaKaloriUntukKarbo / 4; 

    return {
        bmr: parseFloat(bmr.toFixed(2)),
        faktor_aktivitas_nilai: f_aktivitas,
        faktor_stres_nilai: f_stres,
        penambahan_kalori: penambahan_kalori,
        kebutuhan_energi_total: parseFloat(totalEnergi.toFixed(2)),
        protein_gram: parseFloat(proteinGram.toFixed(2)),
        lemak_gram: parseFloat(lemakGram.toFixed(2)),
        karbohidrat_gram: parseFloat(karbohidratGram.toFixed(2))
    };
};

module.exports = { hitungIMT, getKelompokUmur, kalkulasiGiziTotal };