// ==========================================
// UTILS/PENYAKIT: hitungDM_CKD.js (Nefropati Diabetik)
// Pendekatan Hybrid: Energi (Cara Praktis DM) + Makro/Mikro (Buku Biru CKD)
// ==========================================

const { hitungBeratBadanIdeal } = require('../sharedRumus');

const hitungDM_CKD = (data) => {
    const { 
        jenis_kelamin, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres, 
        kategori_penambahan_energi,
        status_hemodialisa,
        volume_urine // Sangat krusial untuk Natrium, Kalium & Cairan
    } = data;

    // 1. Hitung Berat Badan Ideal (BBI)
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);

    // Status boolean untuk mempermudah logika
    const isHD = status_hemodialisa && status_hemodialisa.toLowerCase() === 'ya';

    // =========================================================================
    // 2. KEBUTUHAN ENERGI (Cara Praktis Buku Biru)
    // =========================================================================
    
    // A. Energi Basal (30 kkal Pria, 25 kkal Wanita)
    let energiBasal = 0;
    if (jenis_kelamin === 'L') {
        energiBasal = bbi * 30;
    } else {
        energiBasal = bbi * 25;
    }

    // B. Koreksi Umur (Sesuai Buku Biru: <40 thn = 0%)
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

    // C. Koreksi Aktivitas
    let persentaseAktivitas = 0.20; 
    const aktivitasNormal = aktivitas_fisik?.toLowerCase();
    switch (aktivitasNormal) {
        case 'bed rest': persentaseAktivitas = 0.10; break;
        case 'ringan': persentaseAktivitas = 0.20; break;
        case 'sedang': persentaseAktivitas = 0.30; break;
        case 'berat': persentaseAktivitas = 0.40; break;
        case 'sangat berat': persentaseAktivitas = 0.50; break;
    }
    const koreksiAktivitasNilai = energiBasal * persentaseAktivitas;

    // D. Koreksi Stres
    let persentaseStres = 0.10; 
    const parsedStress = parseFloat(faktor_stres);
    if (!isNaN(parsedStress) && parsedStress >= 1.1 && parsedStress <= 1.7) {
        persentaseStres = parsedStress - 1.0; 
    } else {
        const stressNormal = faktor_stres?.toLowerCase();
        switch (stressNormal) {
            case 'ringan': persentaseStres = 0.10; break;
            case 'sedang': persentaseStres = 0.20; break;
            case 'berat': persentaseStres = 0.30; break;
            default: persentaseStres = 0.10; break;
        }
    }
    const koreksiStresNilai = energiBasal * persentaseStres;

    // E. Penambahan Kehamilan (Sesuai Buku Biru Gestasional)
    let penambahanKaloriNilai = 0;
    if (kategori_penambahan_energi) {
        const kat = kategori_penambahan_energi.toUpperCase();
        if (kat.includes('TMSTR 1') || kat.includes('TRIMESTER 1')) {
            penambahanKaloriNilai = 180;
        } else if (kat.includes('TMSTR 2') || kat.includes('TMSTR 3') || kat.includes('TRIMESTER 2') || kat.includes('TRIMESTER 3') || kat.includes('2 & 3')) {
            penambahanKaloriNilai = 300;
        }
    }

    // TEE Total
    const kebutuhan_energi_total = energiBasal + koreksiUmurNilai + koreksiAktivitasNilai + koreksiStresNilai + penambahanKaloriNilai;

    // =========================================================================
    // 3. DISTRIBUSI MAKRONUTRIEN (Nefropati Diabetik - Buku Biru)
    // =========================================================================
    
    // PROTEIN: HD = 1.2 g/kg, Pre-HD = 0.8 g/kg
    let protein_gram = 0;
    if (isHD) {
        protein_gram = 1.2 * bbi; 
    } else {
        protein_gram = 0.8 * bbi; 
    }
    const kalori_protein = protein_gram * 4;
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // LEMAK TOTAL: 30% dari Total Kalori
    const lemak_persen = 30;
    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Rincian Lemak Nefropati Diabetik: Jenuh 7%, PUFA 10%, MUFA 13%
    const lemak_jenuh_persen = 7;
    const lemak_jenuh_gram = ((lemak_jenuh_persen / 100) * kebutuhan_energi_total) / 9;
    
    const lemak_pufa_persen = 10;
    const lemak_pufa_gram = ((lemak_pufa_persen / 100) * kebutuhan_energi_total) / 9;

    const lemak_mufa_persen = 13;
    const lemak_mufa_gram = ((lemak_mufa_persen / 100) * kebutuhan_energi_total) / 9;

    // KARBOHIDRAT: Sisa dari Total Kalori
    const kalori_karbohidrat = kebutuhan_energi_total - kalori_protein - kalori_lemak;
    const karbohidrat_gram = kalori_karbohidrat / 4;
    const karbohidrat_persen = (kalori_karbohidrat / kebutuhan_energi_total) * 100;

    // =========================================================================
    // 4. MIKRONUTRIEN & CAIRAN (Logika Ganda Sesuai Buku Biru)
    // =========================================================================
    let natrium_mg = 0;
    let kalium_mg = 0;
    let kalsium_mg = 0;
    let fosfor_mg = 0;

    // Mengolah input volume urine
    const volUrine = (volume_urine !== undefined && volume_urine !== null && volume_urine !== "") 
                        ? parseFloat(volume_urine) 
                        : null;

    if (isHD) {
        // --- ATURAN HEMODIALISA ---
        if (volUrine !== null) {
            if (volUrine === 0) {
                natrium_mg = 2000; 
                kalium_mg = 2000;  
            } else {
                natrium_mg = 1000 + ((volUrine / 500) * 1000); 
                kalium_mg = 2000 + ((volUrine / 1000) * 1000); 
            }
        } else {
            natrium_mg = 2000;    
            kalium_mg = 40 * bbi; 
        }
        kalsium_mg = 1000;    
        fosfor_mg = 17 * bbi; 
    } else {
        // --- ATURAN PRE-DIALISIS (NEFROPATI DIABETIK) ---
        natrium_mg = 2000;    // 2000 - 2300 mg
        kalium_mg = 1600;     // 1600 - 2800 mg (Batas aman terendah)
        kalsium_mg = 1200;    
        fosfor_mg = 10 * bbi; // 8 - 12 mg/kg BB
    }

    const kolesterol_mg = 300; // < 300 mg

    // Perhitungan Cairan Dinamis
    let kebutuhan_cairan = "Sesuai volume urine 24 jam + 500 ml";
    if (volUrine !== null) {
        const totalCairan = volUrine + 500;
        kebutuhan_cairan = `${totalCairan} ml`;
    }

    // 5. Return Format Data
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
                
                // Rincian Lemak & Mikro untuk UI
                lemak_jenuh_gr: parseFloat(lemak_jenuh_gram.toFixed(2)),
                lemak_pufa_gr: parseFloat(lemak_pufa_gram.toFixed(2)),
                lemak_mufa_gr: parseFloat(lemak_mufa_gram.toFixed(2)),
                kolesterol_mg: kolesterol_mg,
                natrium_mg: parseFloat(natrium_mg.toFixed(2)),
                kalium_mg: parseFloat(kalium_mg.toFixed(2)),
                kalsium_mg: parseFloat(kalsium_mg.toFixed(2)),
                fosfor_mg: parseFloat(fosfor_mg.toFixed(2)),
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
            faktor_stres_nilai: parseFloat((persentaseStres + 1).toFixed(2)), 
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
            kolesterol_mg: kolesterol_mg,
            natrium_mg: parseFloat(natrium_mg.toFixed(2)),
            kalium_mg: parseFloat(kalium_mg.toFixed(2)),
            kalsium_mg: parseFloat(kalsium_mg.toFixed(2)),
            fosfor_mg: parseFloat(fosfor_mg.toFixed(2))
        }
    };
};

module.exports = hitungDM_CKD;