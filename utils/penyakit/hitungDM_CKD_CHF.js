// ==========================================
// UTILS/PENYAKIT: hitungDM_CKD_CHF.js
// Komplikasi Triple: Diabetes + Ginjal + Jantung
// Pendekatan: Menggunakan batas paling ketat (The Strictest Limit) dari Buku Biru Edisi 5
// Fitur: Faktor Stres Khusus DM (10,20,30) + Validasi Slider Lemak Dinamis
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
        volume_urine, // Sangat krusial untuk cairan dan kalium
        // Parameter Baru untuk Slider (Protein dikunci, hanya Lemak yang dikontrol user)
        input_persen_lemak
    } = data;

    // 1. Dapatkan BBI dan IMT
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);
    
    // Status boolean Hemodialisa
    const isHD = status_hemodialisa && status_hemodialisa.toLowerCase() === 'ya';

    // =========================================================================
    // 2. KEBUTUHAN ENERGI (Cara Praktis DM - Buku Biru)
    // =========================================================================
    
    // A. Energi Basal (30 kkal Pria, 25 kkal Wanita)
    let energiBasal = 0;
    if (jenis_kelamin === 'L') {
        energiBasal = bbi * 30;
    } else {
        energiBasal = bbi * 25;
    }

    // B. Koreksi Umur (<40 tahun = 0%)
    let koreksiUmurNilai = 0;
    if (umur >= 40 && umur <= 59) {
        koreksiUmurNilai = energiBasal * -0.05; 
    } else if (umur >= 60 && umur <= 69) {
        koreksiUmurNilai = energiBasal * -0.10; 
    } else if (umur >= 70) {
        koreksiUmurNilai = energiBasal * -0.20; 
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

    // =========================================================================
    // D. STRES METABOLIK (KHUSUS DM: 10%, 20%, 30%)
    // =========================================================================
    let persentaseStres = 0.10; 
    
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
    const koreksiStresNilai = energiBasal * persentaseStres;

    // E. Penambahan Kehamilan (Buku Biru DM Gestasional)
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
    // 3. DISTRIBUSI MAKRONUTRIEN (Irisan Ketat DM + CKD + CHF)
    // =========================================================================
    
    // 3a. PROTEIN: Mutlak bergantung pada Ginjal (HD vs Non-HD)
    let protein_gram = 0;
    if (isHD) {
        protein_gram = 1.2 * bbi; 
    } else {
        protein_gram = 0.8 * bbi; 
    }
    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // 3b. LEMAK TOTAL: Default 25% (Irisan aman untuk ketiga organ)
    let lemak_persen = 25; 

    // Validasi input slider lemak dari Frontend
    if (input_persen_lemak !== undefined) {
        const l = parseFloat(input_persen_lemak);
        
        // Pagar Aman: DM (20-25%), CHF (20-25%). Irisan paling aman adalah 20-25%
        if (l < 20 || l > 25) {
            throw new Error(`Persentase Lemak komplikasi DM+CKD+CHF harus antara 20% - 25%. Input ditolak: ${l}%`);
        }
        
        if ((protein_persen + l) >= 100) {
            throw new Error(`Total Protein (${protein_persen.toFixed(1)}%) dan Lemak (${l}%) melebih/sama dengan 100%.`);
        }

        lemak_persen = l;
    }

    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total; 
    const lemak_gram = kalori_lemak / 9;

    // Rincian Lemak (Patokan Jenuh 7% dari Nefropati Diabetik)
    const lemak_jenuh_persen = 7;
    const lemak_jenuh_gram = ((lemak_jenuh_persen / 100) * kebutuhan_energi_total) / 9;
    
    const lemak_pufa_persen = 10;
    const lemak_pufa_gram = ((lemak_pufa_persen / 100) * kebutuhan_energi_total) / 9;

    const lemak_mufa_persen = lemak_persen - lemak_jenuh_persen - lemak_pufa_persen;
    const lemak_mufa_gram = ((lemak_mufa_persen / 100) * kebutuhan_energi_total) / 9;

    // 3c. KARBOHIDRAT: Dihitung otomatis sebagai sisa agar persis 100%
    const karbohidrat_persen = 100 - protein_persen - lemak_persen;
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total; 
    const karbohidrat_gram = kalori_karbohidrat / 4; 

    // =========================================================================
    // 4. MIKRONUTRIEN & CAIRAN (Penggabungan Batas Paling Ketat)
    // =========================================================================
    
    // Natrium & Kolesterol: Diambil dari CHF (paling ketat)
    const natrium_mg = 1500;       // CHF mengharuskan < 1500 mg (meskipun HD mengizinkan lebih)
    const kolesterol_mg = 200;     // CHF mengharuskan < 200 mg

    let kalium_mg = 0;
    let kalsium_mg = 0;
    let fosfor_mg = 10 * bbi;      // CKD Nefropati (8-12 mg/kg BB)

    const volUrine = (volume_urine !== undefined && volume_urine !== null && volume_urine !== "") 
                        ? parseFloat(volume_urine) 
                        : null;

    // Kalium & Kalsium: Diambil dari CKD (HD vs Non-HD)
    if (isHD) {
        if (volUrine !== null) {
            if (volUrine === 0) {
                kalium_mg = 2000; 
            } else {
                kalium_mg = 2000 + ((volUrine / 1000) * 1000); 
            }
        } else {
            kalium_mg = 40 * bbi; 
        }
        kalsium_mg = 1000; 
        fosfor_mg = 17 * bbi;
    } else {
        kalium_mg = 1600; // Nefropati Diabetik (Batas bawah paling aman)
        kalsium_mg = 1200;
    }

    // Cairan Dinamis (Irisan CHF dan CKD)
    let kebutuhan_cairan = "Sesuai balance cairan (urine 24 jam + 500 ml)";
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
            kehamilan: penambahanKaloriNilai,
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2)),
                
                // Tambahan Rincian Gizi Khusus
                lemak_jenuh_gr: parseFloat(lemak_jenuh_gram.toFixed(2)),
                lemak_pufa_gr: parseFloat(lemak_pufa_gram.toFixed(2)),
                lemak_mufa_gr: parseFloat(lemak_mufa_gram.toFixed(2)),
                natrium_mg: natrium_mg,
                kolesterol_mg: kolesterol_mg,
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
            faktor_stres_nilai: parseFloat(persentaseStres.toFixed(2)),
            penambahan_kalori: penambahanKaloriNilai,
            kebutuhan_energi_total: parseFloat(kebutuhan_energi_total.toFixed(2)),
            protein_persen: parseFloat(protein_persen.toFixed(2)),
            lemak_persen: parseFloat(lemak_persen.toFixed(2)),
            karbohidrat_persen: parseFloat(karbohidrat_persen.toFixed(2)),
            protein_gram: parseFloat(protein_gram.toFixed(2)),
            lemak_gram: parseFloat(lemak_gram.toFixed(2)),
            karbohidrat_gram: parseFloat(karbohidrat_gram.toFixed(2)),

            // DB Support
            lemak_jenuh_gram: parseFloat(lemak_jenuh_gram.toFixed(2)),
            lemak_pufa_gram: parseFloat(lemak_pufa_gram.toFixed(2)),
            lemak_mufa_gram: parseFloat(lemak_mufa_gram.toFixed(2)),
            natrium_mg: natrium_mg,
            kolesterol_mg: kolesterol_mg,
            kalium_mg: parseFloat(kalium_mg.toFixed(2)),
            kalsium_mg: parseFloat(kalsium_mg.toFixed(2)),
            fosfor_mg: parseFloat(fosfor_mg.toFixed(2))
        }
    };
};

module.exports = hitungDM_CKD_CHF;