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

// Import file Universal Mifflin
const hitungMifflin = require('./penyakit/hitungMifflin');

const kalkulasiGiziTotal = (dataInput) => {
    // 1. Normalisasi Input Penyakit menjadi Array yang Seragam
    let diagnosisArray = [];
    
    if (Array.isArray(dataInput.diagnosa_penyakit)) {
        diagnosisArray = [...dataInput.diagnosa_penyakit]; // Cloning array agar aman
    } else if (typeof dataInput.diagnosa_penyakit === 'string') {
        diagnosisArray = dataInput.diagnosa_penyakit.split(/[\+,]/).map(item => item.trim());
    }

    // =====================================================================
    // FITUR EKSKLUSIF: CRITICAL ILL (PASIEN ICU)
    // =====================================================================
    // Mengecek apakah Frontend mengirimkan 'Critical Ill' di dalam array penyakit
    const hasCriticalIll = diagnosisArray.some(p => p.toLowerCase() === 'critical ill' || p.toLowerCase() === 'icu');
    
    if (hasCriticalIll) {
        // ATURAN 1: Aktivitas fisik WAJIB dikunci ke "Bed rest" untuk pasien ICU
        dataInput.aktivitas_fisik = 'Bed rest';
        
        // ATURAN 2: Keluarkan 'Critical Ill' sementara dari array agar 
        // tidak mengacaukan router penyakit utama (DM, CKD, dll) di bawah.
        diagnosisArray = diagnosisArray.filter(p => p.toLowerCase() !== 'critical ill' && p.toLowerCase() !== 'icu');
    }

    // =====================================================================
    // ATURAN PRIORITAS GIZI KLINIS (Penyakit Khusus menang atas Mifflin)
    // =====================================================================
    if (diagnosisArray.length > 1 && diagnosisArray.includes('Mifflin')) {
        diagnosisArray = diagnosisArray.filter(p => p !== 'Mifflin');
    }

    // Fungsi Pembantu
    const has = (penyakit) => diagnosisArray.includes(penyakit);

    // Variabel penampung hasil rumus murni (Sebelum dipotong 80%)
    let hasil; 

    // ROUTER PENYAKIT
    if (has('DM') && has('CKD') && has('CHF')) hasil = hitungDM_CKD_CHF(dataInput);
    
    else if (has('DM') && has('CKD')) hasil = hitungDM_CKD(dataInput);
    else if (has('DM') && has('CHF')) hasil = hitungDM_CHF(dataInput);
    else if (has('DM') && has('Lambung')) hasil = hitungDM_Lambung(dataInput);
    else if (has('DM') && has('Stroke')) hasil = hitungDM_Stroke(dataInput);
    
    else if (has('CKD') && has('CHF')) hasil = hitungCKD_CHF(dataInput);
    else if (has('CKD') && has('Lambung')) hasil = hitungCKD_Lambung(dataInput);
    else if (has('CKD') && has('Stroke')) hasil = hitungCKD_Stroke(dataInput);
    
    else if (has('CHF') && has('Lambung')) hasil = hitungCHF_Lambung(dataInput);
    else if (has('CHF') && has('Stroke')) hasil = hitungCHF_Stroke(dataInput);
    
    else if (has('DM')) hasil = hitungDM(dataInput);
    else if (has('CKD')) hasil = hitungCKD(dataInput);
    else if (has('CHF')) hasil = hitungCHF(dataInput);
    else if (has('Stroke')) hasil = hitungStroke(dataInput);
    else if (has('Lambung')) hasil = hitungLambung(dataInput);
    
    else if (has('Mifflin')) hasil = hitungMifflin(dataInput);
    else hasil = hitungMifflin(dataInput);

    // KALKULASI AKHIR: PEMOTONGAN 80% CRITICAL ILL & HITUNG ULANG MAKRO
    if (hasCriticalIll) {
        // Ambil energi normal, lalu kalikan 80% (0.8)
        const oldTee = hasil.data_simpan.kebutuhan_energi_total;
        const newTee = oldTee * 0.8;

        // Ambil persentase makronutrien asli dari rumus penyakitnya
        const p_persen = hasil.data_simpan.protein_persen;
        const l_persen = hasil.data_simpan.lemak_persen;
        const k_persen = hasil.data_simpan.karbohidrat_persen;

        // Kalkulasi ulang gramasi berdasarkan energi (kalori) yang baru (80%)
        const kalori_protein = (p_persen / 100) * newTee;
        const protein_gram = kalori_protein / 4;

        const kalori_lemak = (l_persen / 100) * newTee;
        const lemak_gram = kalori_lemak / 9;

        const kalori_karbo = (k_persen / 100) * newTee;
        const karbo_gram = kalori_karbo / 4;

        // Timpa hasil di objek data_simpan (Untuk di-save ke Database)
        hasil.data_simpan.kebutuhan_energi_total = parseFloat(newTee.toFixed(2));
        hasil.data_simpan.protein_gram = parseFloat(protein_gram.toFixed(2));
        hasil.data_simpan.lemak_gram = parseFloat(lemak_gram.toFixed(2));
        hasil.data_simpan.karbohidrat_gram = parseFloat(karbo_gram.toFixed(2));

        // Timpa hasil di objek perhitungan (Untuk ditampilkan di UI Frontend)
        hasil.perhitungan.hasil.energi_kkal = parseFloat(newTee.toFixed(2));
        hasil.perhitungan.hasil.protein_gr = parseFloat(protein_gram.toFixed(2));
        hasil.perhitungan.hasil.lemak_gr = parseFloat(lemak_gram.toFixed(2));
        hasil.perhitungan.hasil.karbohidrat_gr = parseFloat(karbo_gram.toFixed(2));

        hasil.perhitungan.dalam_kkal.protein = parseFloat(kalori_protein.toFixed(2));
        hasil.perhitungan.dalam_kkal.lemak = parseFloat(kalori_lemak.toFixed(2));
        hasil.perhitungan.dalam_kkal.karbohidrat = parseFloat(kalori_karbo.toFixed(2));

        // Tambahkan label penanda untuk UI bahwa mode ICU diaktifkan
        hasil.koreksi.critical_ill = "Aktif (Total Energi x 80%)";
    }

    return hasil;
};

module.exports = { kalkulasiGiziTotal, getKelompokUmur, hitungIMT };