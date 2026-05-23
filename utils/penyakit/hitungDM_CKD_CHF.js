// ==========================================
// UTILS/PENYAKIT: hitungDM_CKD_CHF.js
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungDM_CKD_CHF = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres, 
        kategori_penambahan_energi,
        status_hemodialisa,
        is_estimasi // Tambahan krusial untuk mendeteksi penggunaan LILA/ULNA
    } = data;

    // 1. Dapatkan BBI dan IMT
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);
    const kategoriIMT = dataIMT.statusGizi;

    // 2. ENERGI BASAL (Koreksi Gender)
    let energiBasal = 0;
    if (jenis_kelamin === 'L') {
        energiBasal = bbi * 30;
    } else {
        energiBasal = bbi * 25;
    }

    // 3. KOREKSI UMUR 
    let koreksiUmurNilai = 0;
    if (umur >= 40 && umur <= 59) {
        koreksiUmurNilai = energiBasal * -0.05; 
    } else if (umur >= 60 && umur <= 69) {
        koreksiUmurNilai = energiBasal * -0.10; 
    } else if (umur >= 70) {
        koreksiUmurNilai = energiBasal * -0.20; 
    }

    // 4. KOREKSI BERAT BADAN / IMT
    let koreksiBBNilai = 0;
    if (kategoriIMT.includes('KURUS') || kategoriIMT.includes('KEKURANGAN')) {
        koreksiBBNilai = energiBasal * 0.20;  
    } else if (kategoriIMT.includes('GEMUK') || kategoriIMT.includes('KELEBIHAN') || kategoriIMT.includes('OBESITAS')) {
        koreksiBBNilai = energiBasal * -0.20; 
    }

    // 5. KOREKSI AKTIVITAS
    let koreksiAktivitasNilai = 0;
    switch (aktivitas_fisik) {
        case 'Bed rest':
            koreksiAktivitasNilai = energiBasal * 0.10; 
            break;
        case 'Ringan':
            koreksiAktivitasNilai = energiBasal * 0.20; 
            break;
        case 'Sedang':
            koreksiAktivitasNilai = energiBasal * 0.30; 
            break;
        case 'Berat':
            koreksiAktivitasNilai = energiBasal * 0.40; 
            break;
        case 'Sangat Berat':
            koreksiAktivitasNilai = energiBasal * 0.50; 
            break;
    }

    // 6. STRES METABOLIK
    let koreksiStresNilai = 0;
    switch (faktor_stres) {
        case 'Ringan':
            koreksiStresNilai = energiBasal * 0.10; 
            break;
        case 'Sedang':
            koreksiStresNilai = energiBasal * 0.20; 
            break;
        case 'Berat':
            koreksiStresNilai = energiBasal * 0.30; 
            break;
    }

    // 7. PENAMBAHAN KALORI (KEHAMILAN)
    let penambahanKaloriNilai = 0;
    if (kategori_penambahan_energi) {
        const kategoriUpper = kategori_penambahan_energi.toUpperCase();
        if (kategoriUpper.includes('TMSTR 1') || kategoriUpper.includes('TRIMESTER 1') || kategoriUpper.includes('TRIMESTER 2') || kategoriUpper.includes('1 & 2')) {
            penambahanKaloriNilai = 300;
        } else if (kategoriUpper.includes('TMSTR 3') || kategoriUpper.includes('TRIMESTER 3')) {
            penambahanKaloriNilai = 500;
        }
    }

    // 8. KEBUTUHAN ENERGI TOTAL (TEE)
    const kebutuhan_energi_total = energiBasal + koreksiUmurNilai + koreksiAktivitasNilai + koreksiBBNilai + koreksiStresNilai + penambahanKaloriNilai;

    // =========================================================================
    // 9. DISTRIBUSI MAKRONUTRIEN (DM + CKD + CHF)
    // =========================================================================
    
    // Hitung Protein (Aturan CKD: Bergantung pada Hemodialisa)
    let protein_gram = 0;
    if (status_hemodialisa && status_hemodialisa.toLowerCase() === 'ya') {
        protein_gram = 1.2 * bbi; 
    } else {
        protein_gram = 0.8 * bbi; 
    }

    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // Hitung Lemak (Aturan DM+CKD+CHF: Pengecekan Estimasi LILA/ULNA Perempuan)
    let persentaseLemak = 25; // Nilai standar 25%

    // Jika Perempuan (P) DAN diukur menggunakan estimasi LILA/ULNA, lemak jadi 20%
    if (jenis_kelamin === 'P' && is_estimasi === true) {
        persentaseLemak = 20;
    }

    const lemak_gram = (persentaseLemak / 100 * kebutuhan_energi_total) / 9; 
    const kalori_lemak = lemak_gram * 9; 
    const lemak_persen = (kalori_lemak / kebutuhan_energi_total) * 100;

    // Hitung Karbohidrat (Sisa kalori)
    const karbohidrat_gram = (kebutuhan_energi_total - kalori_protein - kalori_lemak) / 4; 
    const kalori_karbohidrat = karbohidrat_gram * 4; 
    const karbohidrat_persen = (kalori_karbohidrat / kebutuhan_energi_total) * 100;

    // 10. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        koreksi: {
            energi_basal: parseFloat(energiBasal.toFixed(2)),
            koreksi_umur: parseFloat(koreksiUmurNilai.toFixed(2)),
            koreksi_aktivitas: parseFloat(koreksiAktivitasNilai.toFixed(2)),
            koreksi_berat_badan: parseFloat(koreksiBBNilai.toFixed(2)),
            stress_metabolik: parseFloat(koreksiStresNilai.toFixed(2)),
            kehamilan: penambahanKaloriNilai
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2))
            },
            dalam_kkal: {
                protein: parseFloat(kalori_protein.toFixed(2)),
                lemak: parseFloat(kalori_lemak.toFixed(2)),
                karbohidrat: parseFloat(kalori_karbohidrat.toFixed(2))
            },
            persen: {
                protein: parseFloat(protein_persen.toFixed(2)),
                lemak: parseFloat(lemak_persen.toFixed(2)),
                karbohidrat: parseFloat(karbohidrat_persen.toFixed(2))
            }
        },

        data_simpan: {
            berat_badan_ideal: parseFloat(bbi.toFixed(2)),
            bmr: parseFloat(energiBasal.toFixed(2)),
            faktor_aktivitas_nilai: parseFloat(koreksiAktivitasNilai.toFixed(2)), 
            faktor_stres_nilai: parseFloat(koreksiStresNilai.toFixed(2)),
            penambahan_kalori: penambahanKaloriNilai,
            kebutuhan_energi_total: parseFloat(kebutuhan_energi_total.toFixed(2)),
            protein_persen: parseFloat(protein_persen.toFixed(2)),
            lemak_persen: parseFloat(lemak_persen.toFixed(2)),
            karbohidrat_persen: parseFloat(karbohidrat_persen.toFixed(2)),
            protein_gram: parseFloat(protein_gram.toFixed(2)),
            lemak_gram: parseFloat(lemak_gram.toFixed(2)),
            karbohidrat_gram: parseFloat(karbohidrat_gram.toFixed(2))
        }
    };
};

module.exports = hitungDM_CKD_CHF;