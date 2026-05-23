// ==========================================
// UTILS: sharedRumus.js
// ==========================================

const getKelompokUmur = (umurTahun) => {
    if (umurTahun < 1) return 'Bayi';
    if (umurTahun <= 3) return 'Batita';
    if (umurTahun <= 5) return 'Balita';
    if (umurTahun <= 12) return 'Anak-anak';
    if (umurTahun <= 18) return 'Remaja';
    if (umurTahun <= 59) return 'Dewasa';
    return 'Lansia';
};

/**
 * Rumus Berat Badan Ideal (BBI) standar Broca Modifikasi RSUD Pringsewu
 * Laki-laki: threshold 160 cm | Perempuan: threshold 150 cm
 */
const hitungBeratBadanIdeal = (jk, tinggiCm) => {
    if (!tinggiCm) return 0;
    
    let bbi = 0;
    if (jk === 'L') {
        bbi = tinggiCm >= 160 ? 0.90 * (tinggiCm - 100) : (tinggiCm - 100);
    } else {
        // Untuk perempuan ('P')
        bbi = tinggiCm >= 150 ? 0.90 * (tinggiCm - 100) : (tinggiCm - 100);
    }
    
    return parseFloat(bbi.toFixed(2));
};

/**
 * Rumus IMT & Kategori Status Gizi standar RSUD Pringsewu
 */
const hitungIMT = (beratKg, tinggiCm) => {
    if (!beratKg || !tinggiCm) return { nilaiIMT: 0, statusGizi: 'Tidak diketahui' };
    
    const tinggiM = tinggiCm / 100;
    const imt = beratKg / Math.pow(tinggiM, 2); 
    
    let status = '';
    
    if (imt < 17) {
        status = 'KEKURANGAN BB TINGKAT BERAT';
    } else if (imt < 18.5) { 
        status = 'KEKURANGAN BB TINGKAT RINGAN';
    } else if (imt <= 25) {  
        status = 'NORMAL';
    } else if (imt <= 27) {  
        status = 'KELEBIHAN BB TINGKAT RINGAN';
    } else {                 
        status = 'KELEBIHAN BB TINGKAT BERAT';
    }

    return { nilaiIMT: parseFloat(imt.toFixed(2)), statusGizi: status };
};

/**
 * Rumus BMR (Basal Metabolic Rate) Mifflin-St Jeor
 */
const hitungBMRMifflin = (jk, beratKg, tinggiCm, umurTahun) => {
    if (jk === 'L') {
        return (10 * beratKg) + (6.25 * tinggiCm) - (5 * umurTahun) + 5;
    } else {
        return (10 * beratKg) + (6.25 * tinggiCm) - (5 * umurTahun) - 161;
    }
};

/**
 * ----------------------------------------------------
 * FUNGSI DATA ESTIMASI (Jika Pasien Tidak Bisa Ditimbang)
 * ----------------------------------------------------
 */

/**
 * Estimasi Tinggi Badan (TB) berdasarkan panjang Ulna
 */
const estimasiTinggiUlna = (jk, ulnaCm) => {
    if (!ulnaCm) return 0;
    let tb = 0;
    if (jk === 'L') {
        tb = 97.252 + (2.645 * ulnaCm);
    } else {
        tb = 68.777 + (3.536 * ulnaCm);
    }
    return parseFloat(tb.toFixed(2));
};

/**
 * Estimasi Berat Badan (BB) berdasarkan LILA dan Tinggi Badan (Bisa TB Asli atau TB Estimasi)
 */
const estimasiBeratLILA = (jk, lilaCm, tinggiCm) => {
    if (!lilaCm || !tinggiCm) return 0;
    let bb = 0;
    if (jk === 'L') {
        bb = (lilaCm / 29) * (tinggiCm - 100);
    } else {
        bb = (lilaCm / 28.5) * (tinggiCm - 100);
    }
    return parseFloat(bb.toFixed(2));
};

/**
 * Menghitung Persentase LILA (%LILA)
 */
const hitungPersenLILA = (jk, lilaCm) => {
    if (!lilaCm) return 0;
    const standarLila = jk === 'L' ? 29 : 28.5;
    const persen = (lilaCm / standarLila) * 100;
    return parseFloat(persen.toFixed(2));
};

module.exports = { 
    getKelompokUmur, 
    hitungBeratBadanIdeal, 
    hitungIMT, 
    hitungBMRMifflin,
    estimasiTinggiUlna,
    estimasiBeratLILA,
    hitungPersenLILA
};