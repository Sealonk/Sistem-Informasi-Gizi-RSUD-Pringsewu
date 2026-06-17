// ==========================================
// UTILS/PENYAKIT: hitungDM.js
// Berdasarkan: Penuntun Diet & Terapi Gizi Edisi 5 (PERSAGI)
// Fitur: Dukungan Slider Makronutrien + Faktor Stres Khusus DM (10%, 20%, 30%)
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungDM = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres, 
        kategori_penambahan_energi,
        // Parameter Baru untuk Slider Persentase Makronutrien (Opsional)
        input_persen_protein,
        input_persen_lemak,
        input_persen_karbo 
    } = data;

    // 1. Dapatkan BBI dan IMT
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

    // =========================================================================
    // 5. STRES METABOLIK (KHUSUS DM: 10%, 20%, 30%)
    // =========================================================================
    let koreksiStresNilai = 0;
    let persentaseStres = 0.10; // Default 10% 
    
    const parsedStress = parseFloat(faktor_stres);
    if (!isNaN(parsedStress)) {
        // Jika frontend mengirim angka bulat (10, 20, 30)
        if (parsedStress === 10 || parsedStress === 20 || parsedStress === 30) {
            persentaseStres = parsedStress / 100;
        } 
        // Jika frontend mengirim format desimal (0.1, 0.2, 0.3)
        else if (parsedStress === 0.1 || parsedStress === 0.2 || parsedStress === 0.3) {
            persentaseStres = parsedStress;
        }
    } else {
        // Fallback jika Frontend mengirim teks
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
        
        if (kategoriUpper.includes('TMSTR 1') || kategoriUpper.includes('TRIMESTER 1')) {
            penambahanKaloriNilai = 180;
        } else if (kategoriUpper.includes('TMSTR 2') || kategoriUpper.includes('TRIMESTER 2') || kategoriUpper.includes('TMSTR 3') || kategoriUpper.includes('TRIMESTER 3') || kategoriUpper.includes('2 & 3')) {
            penambahanKaloriNilai = 300;
        } else if (kategoriUpper.includes('LAKTASI 6 BLN PERTAMA') || kategoriUpper.includes('MENYUSUI 0-6')) {
            penambahanKaloriNilai = 330;
        } else if (kategoriUpper.includes('LAKTASI 6 BLN KEDUA') || kategoriUpper.includes('MENYUSUI 7-12')) {
            penambahanKaloriNilai = 400;
        }
    }

    // 7. KEBUTUHAN ENERGI TOTAL (TEE)
    const kebutuhan_energi_total = energiBasal + koreksiUmurNilai + koreksiAktivitasNilai + koreksiStresNilai + penambahanKaloriNilai;

    // =========================================================================
    // 8. DISTRIBUSI MAKRONUTRIEN (DENGAN VALIDASI SLIDER FRONTEND)
    // =========================================================================
    
    let protein_persen = 10; // Default
    let lemak_persen = 25;   // Default

    // Jika Frontend mengirim nilai slider, lakukan validasi ketat
    if (input_persen_protein !== undefined && input_persen_lemak !== undefined) {
        const p = parseFloat(input_persen_protein);
        const l = parseFloat(input_persen_lemak);

        // Validasi 1: Harus masuk rentang ("Pagar Aman") Buku Biru untuk DM murni
        if (p < 10 || p > 20) {
            throw new Error(`Persentase Protein DM harus antara 10% - 20%. Input ditolak: ${p}%`);
        }
        if (l < 20 || l > 25) {
            throw new Error(`Persentase Lemak DM harus antara 20% - 25%. Input ditolak: ${l}%`);
        }

        // Validasi 2: Pastikan sisa karbohidrat tidak negatif
        if ((protein_persen + l) >= 100) {
            throw new Error(`Total Protein (${protein_persen.toFixed(1)}%) dan Lemak (${l}%) melebih/sama dengan 100%.`);
        }

        // Jika lolos validasi, timpa nilai default
        protein_persen = p;
        lemak_persen = l;
    }

    // Eksekusi Perhitungan Kalori ke Gram
    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4;

    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    const karbohidrat_persen = 100 - protein_persen - lemak_persen;
    if (karbohidrat_persen < 45 || karbohidrat_persen > 65) {
        throw new Error(`Kalkulasi ditolak: Sisa Karbohidrat mencapai ${karbohidrat_persen.toFixed(1)}%. Persentase Karbohidrat DM harus antara 45% - 65%.`);
    }
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    const natrium_mg = 2300; 
    const serat_gram = 25;   

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
            faktor_stres_nilai: parseFloat(persentaseStres.toFixed(2)), 
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