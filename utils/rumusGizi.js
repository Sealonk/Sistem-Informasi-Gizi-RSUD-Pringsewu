// ==========================================
// UTILS: rumusGizi.js (Main Router)
// ==========================================

const { getKelompokUmur, hitungIMT } = require('./sharedRumus');

// Import semua 15 file spesifik
const hitungDM = require('./penyakit/hitungDM');
const hitungDM_CKD = require('./penyakit/hitungDM_CKD');
const hitungDM_CKD_CHF = require('./penyakit/hitungDM_CKD_CHF');
const hitungDM_CHF = require('./penyakit/hitungDM_CHF');
const hitungDM_Lambung = require('./penyakit/hitungDM_Lambung');
const hitungDM_Stroke = require('./penyakit/hitungDM_Stroke');
const hitungCHF = require('./penyakit/hitungCHF');
const hitungCHF_Lambung = require('./penyakit/hitungCHF_Lambung');
const hitungCHF_Stroke = require('./penyakit/hitungCHF_Stroke');
const hitungCKD = require('./penyakit/hitungCKD');
const hitungCKD_CHF = require('./penyakit/hitungCKD_CHF');
const hitungCKD_Lambung = require('./penyakit/hitungCKD_Lambung');
const hitungCKD_Stroke = require('./penyakit/hitungCKD_Stroke');
const hitungStroke = require('./penyakit/hitungStroke');
const hitungLambung = require('./penyakit/hitungLambung');

const kalkulasiGiziTotal = (dataInput) => {
    // 1. Normalisasi Input Penyakit menjadi Array yang Seragam
    let diagnosisArray = [];
    
    if (Array.isArray(dataInput.diagnosa_penyakit)) {
        // Jika dari Frontend masuk sebagai Array ["DM", "CKD"]
        diagnosisArray = dataInput.diagnosa_penyakit;
    } else if (typeof dataInput.diagnosa_penyakit === 'string') {
        // Jika masuk sebagai String "DM + CKD" atau "DM, CKD"
        diagnosisArray = dataInput.diagnosa_penyakit.split(/[\+,]/).map(item => item.trim());
    }

    // 2. Fungsi Pembantu: Mengecek apakah pasien memiliki penyakit tertentu
    const has = (penyakit) => diagnosisArray.includes(penyakit);

    // 3. ROUTER PENYAKIT
    // PENTING: Pengecekan wajib diurutkan dari yang komplikasi paling kompleks (3 penyakit) ke tunggal!

    // --- 3 KOMPLIKASI ---
    if (has('DM') && has('CKD') && has('CHF')) {
        return hitungDM_CKD_CHF(dataInput);
    }

    // --- 2 KOMPLIKASI ---
    if (has('DM') && has('CKD')) return hitungDM_CKD(dataInput);
    if (has('DM') && has('CHF')) return hitungDM_CHF(dataInput);
    if (has('DM') && has('Lambung')) return hitungDM_Lambung(dataInput);
    if (has('DM') && has('Stroke')) return hitungDM_Stroke(dataInput);

    if (has('CKD') && has('CHF')) return hitungCKD_CHF(dataInput);
    if (has('CKD') && has('Lambung')) return hitungCKD_Lambung(dataInput);
    if (has('CKD') && has('Stroke')) return hitungCKD_Stroke(dataInput);

    if (has('CHF') && has('Lambung')) return hitungCHF_Lambung(dataInput);
    if (has('CHF') && has('Stroke')) return hitungCHF_Stroke(dataInput);

    // --- 1 PENYAKIT (TUNGGAL) ---
    if (has('DM')) return hitungDM(dataInput);
    if (has('CKD')) return hitungCKD(dataInput);
    if (has('CHF')) return hitungCHF(dataInput);
    if (has('Stroke')) return hitungStroke(dataInput);
    if (has('Lambung')) return hitungLambung(dataInput);

    // --- JIKA TIDAK ADA YANG COCOK ---
    throw new Error(`Sistem belum mendukung perhitungan khusus untuk komplikasi: ${diagnosisArray.join(' + ')}`);
};

// Export fungsi utama agar bisa dipakai oleh Controller
module.exports = { kalkulasiGiziTotal, getKelompokUmur, hitungIMT };