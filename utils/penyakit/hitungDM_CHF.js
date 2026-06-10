// ==========================================
// UTILS/PENYAKIT: hitungDM_CHF.js
// Komplikasi Ganda: Diabetes Melitus + Penyakit Jantung (CHF)
// Pendekatan: Menggunakan batas paling ketat dari Buku Biru Edisi 5
// Fitur: Faktor Stres Khusus DM (10, 20, 30) + Validasi Slider Dinamis
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungDM_CHF = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres, 
        kategori_penambahan_energi,
        // Parameter Baru untuk Slider Persentase Makronutrien
        input_persen_protein,
        input_persen_lemak,
        input_persen_karbo 
    } = data;

    // 1. Dapatkan BBI dan IMT 
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);

    // =========================================================================
    // 2. KEBUTUHAN ENERGI BASAL (Cara Praktis DM)
    // =========================================================================
    let energiBasal = 0;
    if (jenis_kelamin === 'L') {
        energiBasal = bbi * 30;
    } else {
        energiBasal = bbi * 25;
    }

    // 3. KOREKSI UMUR (Usia < 40 tahun = 0%)
    let koreksiUmurNilai = 0;
    if (umur >= 40 && umur <= 59) {
        koreksiUmurNilai = energiBasal * -0.05; // -5%
    } else if (umur >= 60 && umur <= 69) {
        koreksiUmurNilai = energiBasal * -0.10; // -10%
    } else if (umur >= 70) {
        koreksiUmurNilai = energiBasal * -0.20; // -20%
    } else {
        koreksiUmurNilai = 0;
    }

    // 4. KOREKSI AKTIVITAS
    let koreksiAktivitasNilai = 0;
    let persentaseAktivitas = 0.20; 
    const aktivitasNormal = aktivitas_fisik?.toLowerCase();
    switch (aktivitasNormal) {
        case 'bed rest': persentaseAktivitas = 0.10; break;
        case 'ringan': persentaseAktivitas = 0.20; break;
        case 'sedang': persentaseAktivitas = 0.30; break;
        case 'berat': persentaseAktivitas = 0.40; break;
        case 'sangat berat': persentaseAktivitas = 0.50; break;
    }
    koreksiAktivitasNilai = energiBasal * persentaseAktivitas;

    // =========================================================================
    // 5. STRES METABOLIK (KHUSUS DM: 10%, 20%, 30%)
    // =========================================================================
    let koreksiStresNilai = 0;
    let persentaseStres = 0.10; // Default 10% 
    
    const parsedStress = parseFloat(faktor_stres);
    if (!isNaN(parsedStress)) {
        if (parsedStress === 10 || parsedStress === 20 || parsedStress === 30) {
            persentaseStres = parsedStress / 100;
        } else if (parsedStress === 0.1 || parsedStress === 0.2 || parsedStress === 0.3) {
            persentaseStres = parsedStress;
        }
    } else {
        const stressNormal = faktor_stres?.toLowerCase();
        switch (stressNormal) {
            case 'ringan': persentaseStres = 0.10; break;
            case 'sedang': persentaseStres = 0.20; break;
            case 'berat': persentaseStres = 0.30; break;
            default: persentaseStres = 0.10; break;
        }
    }
    koreksiStresNilai = energiBasal * persentaseStres;

    // 6. PENAMBAHAN KALORI (KEHAMILAN DM GESTASIONAL)
    let penambahanKaloriNilai = 0;
    if (kategori_penambahan_energi) {
        const kat = kategori_penambahan_energi.toUpperCase();
        if (kat.includes('TMSTR 1') || kat.includes('TRIMESTER 1')) {
            penambahanKaloriNilai = 180;
        } else if (kat.includes('TMSTR 2') || kat.includes('TMSTR 3') || kat.includes('TRIMESTER 2') || kat.includes('TRIMESTER 3') || kat.includes('2 & 3')) {
            penambahanKaloriNilai = 300;
        } else if (kat.includes('LAKTASI 6 BLN PERTAMA') || kat.includes('MENYUSUI 0-6')) {
            penambahanKaloriNilai = 330;
        } else if (kat.includes('LAKTASI 6 BLN KEDUA') || kat.includes('MENYUSUI 7-12')) {
            penambahanKaloriNilai = 400;
        }
    }

    // 7. KEBUTUHAN ENERGI TOTAL (TEE)
    const kebutuhan_energi_total = energiBasal + koreksiUmurNilai + koreksiAktivitasNilai + koreksiStresNilai + penambahanKaloriNilai;

    // =========================================================================
    // 8. DISTRIBUSI MAKRONUTRIEN DM + CHF (Validasi Slider Dinamis)
    // =========================================================================
    
    // Nilai Default (Irisan Paling Aman)
    let protein_persen = 15;
    let lemak_persen = 25;
    let karbohidrat_persen = 60;

    // Jika Frontend mengirim nilai slider, lakukan validasi ketat
    if (input_persen_protein !== undefined && input_persen_lemak !== undefined && input_persen_karbo !== undefined) {
        const p = parseFloat(input_persen_protein);
        const l = parseFloat(input_persen_lemak);
        const k = parseFloat(input_persen_karbo);

        // Validasi 1: Total harus tepat 100%
        if (Math.round(p + l + k) !== 100) {
            throw new Error(`Total persentase makronutrien harus 100%. Saat ini: ${p + l + k}%`);
        }

        // Validasi 2: Pagar Aman Irisan DM + CHF
        if (p < 15 || p > 20) {
            throw new Error(`Persentase Protein DM+CHF harus antara 15% - 20%. Input ditolak: ${p}%`);
        }
        if (l < 20 || l > 25) {
            throw new Error(`Persentase Lemak DM+CHF harus antara 20% - 25%. Input ditolak: ${l}%`);
        }
        if (k < 50 || k > 60) {
            throw new Error(`Persentase Karbohidrat DM+CHF harus antara 50% - 60%. Input ditolak: ${k}%`);
        }

        // Lolos validasi, timpa nilai default
        protein_persen = p;
        lemak_persen = l;
        karbohidrat_persen = k;
    }

    // Eksekusi Kalori ke Gram
    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4;

    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    // Rincian Lemak (Lemak Jenuh DM lebih ketat yaitu < 7%)
    const lemak_jenuh_persen = 7;
    const lemak_jenuh_gram = ((lemak_jenuh_persen / 100) * kebutuhan_energi_total) / 9;
    
    const lemak_pufa_persen = 10;
    const lemak_pufa_gram = ((lemak_pufa_persen / 100) * kebutuhan_energi_total) / 9;

    const lemak_mufa_persen = lemak_persen - lemak_jenuh_persen - lemak_pufa_persen; // Sisa (antara 3% - 8%)
    const lemak_mufa_gram = ((lemak_mufa_persen / 100) * kebutuhan_energi_total) / 9;

    // =========================================================================
    // 9. MIKRONUTRIEN & CAIRAN (Penggabungan Batas Paling Ketat)
    // =========================================================================
    
    // Natrium CHF (< 1500 mg) menimpa Natrium DM (< 2300 mg)
    const natrium_mg = 1500; 
    const kolesterol_mg = 200; 
    const serat_gram = 25; // Sesuai aturan DM
    const kebutuhan_cairan = "Sesuai balance cairan (urine 24 jam + IWL)"; 

    // 10. Return Format Data ke Controller
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
                
                // Tambahan Rincian Khusus
                lemak_jenuh_gr: parseFloat(lemak_jenuh_gram.toFixed(2)),
                lemak_pufa_gr: parseFloat(lemak_pufa_gram.toFixed(2)),
                lemak_mufa_gr: parseFloat(lemak_mufa_gram.toFixed(2)),
                natrium_mg: natrium_mg,
                kolesterol_mg: kolesterol_mg,
                serat_gr: serat_gram,
                kebutuhan_cairan: kebutuhan_cairan
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
            faktor_stres_nilai: parseFloat(persentaseStres.toFixed(2)),
            penambahan_kalori: penambahanKaloriNilai,
            kebutuhan_energi_total: parseFloat(kebutuhan_energi_total.toFixed(2)),
            protein_persen: parseFloat(protein_persen.toFixed(2)),
            lemak_persen: parseFloat(lemak_persen.toFixed(2)),
            karbohidrat_persen: parseFloat(karbohidrat_persen.toFixed(2)),
            protein_gram: parseFloat(protein_gram.toFixed(2)),
            lemak_gram: parseFloat(lemak_gram.toFixed(2)),
            karbohidrat_gram: parseFloat(karbohidrat_gram.toFixed(2)),

            lemak_jenuh_gram: parseFloat(lemak_jenuh_gram.toFixed(2)),
            lemak_pufa_gram: parseFloat(lemak_pufa_gram.toFixed(2)),
            lemak_mufa_gram: parseFloat(lemak_mufa_gram.toFixed(2)),
            natrium_mg: natrium_mg,
            kolesterol_mg: kolesterol_mg,
            serat_gram: serat_gram
        }
    };
};

module.exports = hitungDM_CHF;