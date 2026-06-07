// ==========================================
// UTILS/PENYAKIT: hitungDM.js
// Berdasarkan: Penuntun Diet & Terapi Gizi Edisi 5 (PERSAGI)
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungDM = (data) => {
    const { jenis_kelamin, berat_badan, tinggi_badan, umur, aktivitas_fisik, faktor_stres, kategori_penambahan_energi } = data;

    // 1. Dapatkan BBI dan IMT (Berlaku untuk penimbangan aktual maupun estimasi LILA/ULNA)
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);
    const kategoriIMT = dataIMT.statusGizi;

    // 2. ENERGI BASAL (Koreksi Gender sesuai Buku Biru/PERKENI)
    let energiBasal = 0;
    if (jenis_kelamin === 'L') {
        energiBasal = bbi * 30; // Pria: 30 kkal/kg BBI
    } else {
        energiBasal = bbi * 25; // Wanita: 25 kkal/kg BBI
    }

    // 3. KOREKSI UMUR (Sesuai Buku Biru PERSAGI)
    let koreksiUmurNilai = 0;
    if (umur >= 40 && umur <= 59) {
        koreksiUmurNilai = energiBasal * -0.05; // -5%
    } else if (umur >= 60 && umur <= 69) {
        koreksiUmurNilai = energiBasal * -0.10; // -10%
    } else if (umur >= 70) {
        koreksiUmurNilai = energiBasal * -0.20; // -20%
    } else {
        koreksiUmurNilai = 0; // Usia di bawah 40 tahun tidak dikurangi (0%)
    }

    // 4. KOREKSI AKTIVITAS
    let koreksiAktivitasNilai = 0;
    let persentaseAktivitas = 0.20; // Default 20%
    const aktivitasNormal = aktivitas_fisik?.toLowerCase();
    switch (aktivitasNormal) {
        case 'bed rest':
            persentaseAktivitas = 0.10; // +10% (Keadaan istirahat)
            break;
        case 'ringan':
            persentaseAktivitas = 0.20; // +20%
            break;
        case 'sedang':
            persentaseAktivitas = 0.30; // +30%
            break;
        case 'berat':
            persentaseAktivitas = 0.40; // +40%
            break;
        case 'sangat berat':
            persentaseAktivitas = 0.50; // +50%
            break;
    }
    koreksiAktivitasNilai = energiBasal * persentaseAktivitas;

    // 5. STRES METABOLIK
    let koreksiStresNilai = 0;
    let persentaseStres = 0.10; // Default 10% 
    
    // Skenario A: Jika Frontend mengirim angka dari dropdown (1.1, 1.2, 1.3, dst)
    const parsedStress = parseFloat(faktor_stres);
    if (!isNaN(parsedStress) && parsedStress >= 1.1 && parsedStress <= 1.7) {
        // Trik Matematika: 1.1 diubah jadi 0.10 (10%), 1.2 jadi 0.20 (20%), 1.3 jadi 0.30 (30%)
        persentaseStres = parsedStress - 1.0; 
    } else {
        // Skenario B: Jika Frontend mengirim teks
        const stressNormal = faktor_stres?.toLowerCase();
        switch (stressNormal) {
            case 'ringan': 
                persentaseStres = 0.10; // 10%
                break;
            case 'sedang': 
                persentaseStres = 0.20; // 20%
                break;
            case 'berat': 
                persentaseStres = 0.30; // 30%
                break;
            case 'tidak ada': 
            default: 
                persentaseStres = 0.10; // Default 10%
                break;
        }
    }
    koreksiStresNilai = energiBasal * persentaseStres;

    // 6. PENAMBAHAN KALORI (KEHAMILAN & LAKTASI SESUAI BUKU BIRU)
    let penambahanKaloriNilai = 0;
    if (kategori_penambahan_energi) {
        const kategoriUpper = kategori_penambahan_energi.toUpperCase();
        
        // Trimester 1
        if (kategoriUpper.includes('TMSTR 1') || kategoriUpper.includes('TRIMESTER 1')) {
            penambahanKaloriNilai = 180;
        } 
        // Trimester 2 dan 3
        else if (kategoriUpper.includes('TMSTR 2') || kategoriUpper.includes('TRIMESTER 2') || kategoriUpper.includes('TMSTR 3') || kategoriUpper.includes('TRIMESTER 3') || kategoriUpper.includes('2 & 3')) {
            penambahanKaloriNilai = 300;
        }
        // Laktasi / Menyusui (Fitur proteksi masa depan)
        else if (kategoriUpper.includes('LAKTASI 6 BLN PERTAMA') || kategoriUpper.includes('MENYUSUI 0-6')) {
            penambahanKaloriNilai = 330;
        }
        else if (kategoriUpper.includes('LAKTASI 6 BLN KEDUA') || kategoriUpper.includes('MENYUSUI 7-12')) {
            penambahanKaloriNilai = 400;
        }
    }

    // 7. KEBUTUHAN ENERGI TOTAL (TEE)
    const kebutuhan_energi_total = energiBasal + koreksiUmurNilai + koreksiAktivitasNilai + koreksiStresNilai + penambahanKaloriNilai;

    // =========================================================================
    // 8. DISTRIBUSI MAKRONUTRIEN & ZAT GIZI LAIN (Sesuai Buku Biru PERSAGI)
    // =========================================================================
    
    // Hitung Protein (15%) - Memenuhi rentang DM 10-20% dan DM Gestasional 15-20%
    const protein_persen = 15;
    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4;

    // Hitung Lemak (20%) - Memenuhi batas amannya 20-25%
    const lemak_persen = 20;
    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Hitung Karbohidrat (65%)
    const karbohidrat_persen = 65;
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    // Natrium & Serat
    const natrium_mg = 2300; // < 2300 mg per hari
    const serat_gram = 25;   // 20-25 gram per hari

    // 9. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        koreksi: {
            energi_basal: parseFloat(energiBasal.toFixed(2)),
            koreksi_umur: parseFloat(koreksiUmurNilai.toFixed(2)),
            koreksi_aktivitas: parseFloat(koreksiAktivitasNilai.toFixed(2)),
            koreksi_berat_badan: 0,
            stress_metabolik: parseFloat(koreksiStresNilai.toFixed(2)),
            kehamilan: penambahanKaloriNilai
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2)),
                natrium_mg: natrium_mg,
                serat_gr: serat_gram
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
            faktor_aktivitas_nilai: parseFloat(persentaseAktivitas.toFixed(2)), 
            faktor_stres_nilai: parseFloat((persentaseStres + 1).toFixed(2)), 
            penambahan_kalori: penambahanKaloriNilai,
            kebutuhan_energi_total: parseFloat(kebutuhan_energi_total.toFixed(2)),
            protein_persen: parseFloat(protein_persen.toFixed(2)),
            lemak_persen: parseFloat(lemak_persen.toFixed(2)),
            karbohidrat_persen: parseFloat(karbohidrat_persen.toFixed(2)),
            protein_gram: parseFloat(protein_gram.toFixed(2)),
            lemak_gram: parseFloat(lemak_gram.toFixed(2)),
            karbohidrat_gram: parseFloat(karbohidrat_gram.toFixed(2)),
            natrium_mg: natrium_mg, 
            serat_gram: serat_gram
        }
    };
};

module.exports = hitungDM;