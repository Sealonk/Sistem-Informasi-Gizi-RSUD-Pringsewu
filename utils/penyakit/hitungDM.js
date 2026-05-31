// ==========================================
// UTILS/PENYAKIT: hitungDM.js
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungDM = (data) => {
    const { jenis_kelamin, berat_badan, tinggi_badan, umur, aktivitas_fisik, faktor_stres, kategori_penambahan_energi } = data;

    // 1. Dapatkan BBI dan IMT (Berlaku untuk penimbangan aktual maupun estimasi LILA/ULNA)
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
        koreksiUmurNilai = energiBasal * -0.05; // -5%
    } else if (umur >= 60 && umur <= 69) {
        koreksiUmurNilai = energiBasal * -0.10; // -10%
    } else if (umur >= 70) {
        koreksiUmurNilai = energiBasal * -0.20; // -20%
    }

    // 4. KOREKSI BERAT BADAN / IMT
    let koreksiBBNilai = 0;
    if (kategoriIMT.includes('KURUS') || kategoriIMT.includes('KEKURANGAN')) {
        koreksiBBNilai = energiBasal * 0.20;  // Kurus (+20%)
    } else if (kategoriIMT.includes('GEMUK') || kategoriIMT.includes('KELEBIHAN') || kategoriIMT.includes('OBESITAS')) {
        koreksiBBNilai = energiBasal * -0.20; // Gemuk (-20%)
    }

    // 5. KOREKSI AKTIVITAS
    let koreksiAktivitasNilai = 0;
    const aktivitasNormal = aktivitas_fisik?.toLowerCase();
    switch (aktivitasNormal) {
        case 'bed rest':
            koreksiAktivitasNilai = energiBasal * 0.10; // +10%
            break;
        case 'ringan':
            koreksiAktivitasNilai = energiBasal * 0.20; // +20%
            break;
        case 'sedang':
            koreksiAktivitasNilai = energiBasal * 0.30; // +30%
            break;
        case 'berat':
            koreksiAktivitasNilai = energiBasal * 0.40; // +40%
            break;
        case 'sangat berat':
            koreksiAktivitasNilai = energiBasal * 0.50; // +50%
            break;
    }

    // 6. STRES METABOLIK
    let koreksiStresNilai = 0;
    const stressNormal = faktor_stres?.toLowerCase();
    switch (stressNormal) {
        case 'ringan':
            koreksiStresNilai = energiBasal * 0.10; // +10%
            break;
        case 'sedang':
            koreksiStresNilai = energiBasal * 0.20; // +20%
            break;
        case 'berat':
            koreksiStresNilai = energiBasal * 0.30; // +30%
            break;
    }

    // 7. PENAMBAHAN KALORI (KEHAMILAN)
    // Berlaku untuk sel I23 (Perempuan). Untuk laki-laki, nilainya akan tetap 0.
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
    // Sesuai rumus L9 (Laki-laki) atau L18 (Perempuan)
    const kebutuhan_energi_total = energiBasal + koreksiUmurNilai + koreksiAktivitasNilai + koreksiBBNilai + koreksiStresNilai + penambahanKaloriNilai;

    // =========================================================================
    // 9. DISTRIBUSI MAKRONUTRIEN DM (Sama untuk Laki-laki & Perempuan)
    // =========================================================================
    
    // Hitung Protein
    const protein_gram = 1 * bbi;
    const kalori_protein = protein_gram * 4; // M10 / M19
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100; // N10 / N19

    // Hitung Lemak
    const lemak_gram = (25 / 100 * kebutuhan_energi_total) / 9; // L11 / L20
    const kalori_lemak = lemak_gram * 9; // M11 / M20
    const lemak_persen = (kalori_lemak / kebutuhan_energi_total) * 100;

    // Hitung Karbohidrat
    const karbohidrat_gram = (kebutuhan_energi_total - kalori_protein - kalori_lemak) / 4; // L12 / L21
    const kalori_karbohidrat = karbohidrat_gram * 4; // M12 / M21
    const karbohidrat_persen = (kalori_karbohidrat / kebutuhan_energi_total) * 100; // N12 / N21

    // 10. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        // KELOMPOK 1: KOREKSI (Sesuai Struktur Excel)
        koreksi: {
            energi_basal: parseFloat(energiBasal.toFixed(2)),
            koreksi_umur: parseFloat(koreksiUmurNilai.toFixed(2)),
            koreksi_aktivitas: parseFloat(koreksiAktivitasNilai.toFixed(2)),
            koreksi_berat_badan: parseFloat(koreksiBBNilai.toFixed(2)),
            stress_metabolik: parseFloat(koreksiStresNilai.toFixed(2)),
            kehamilan: penambahanKaloriNilai
        },

        // KELOMPOK 2: PERHITUNGAN (Sesuai Struktur Excel)
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

        // ====================================================================
        // KELOMPOK 3: DATA SIMPAN (Bonus untuk mempermudah Frontend ke Database)
        // Frontend cukup mengambil object ini saat POST ke /api/perhitungan/simpan
        // ====================================================================
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

module.exports = hitungDM;