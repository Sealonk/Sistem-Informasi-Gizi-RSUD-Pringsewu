// ==========================================
// UTILS/PENYAKIT: hitungCHF.js (Penyakit Jantung / Gagal Jantung)
// Pendekatan Hybrid: Energi (Excel RS/Mifflin) + Makro/Mikro (Buku Biru)
// Fitur: Validasi Slider Makronutrien Dinamis + Custom Stres Multiplier
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCHF = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres,
        // Parameter Baru untuk Slider Persentase Makronutrien
        input_persen_protein,
        input_persen_lemak,
        input_persen_karbo 
    } = data;

    // 1. Dapatkan BBI dan IMT
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);

    // =========================================================================
    // 2. ENERGI BASAL (BMR) - Menggunakan Rumus Mifflin-St Jeor dengan BBI
    // Sesuai format Excel CHF Rumah Sakit Pringsewu
    // =========================================================================
    let bmr = 0;
    if (jenis_kelamin === 'L') {
        bmr = (10 * bbi) + (6.25 * tinggi_badan) - (5 * umur) + 5;
    } else {
        bmr = (10 * bbi) + (6.25 * tinggi_badan) - (5 * umur) - 161; 
    }

    // =========================================================================
    // 3. FAKTOR AKTIVITAS (Menggunakan sistem Pengali/Multiplier dari Excel)
    // =========================================================================
    let faktorAktivitas = 1.2; // Default: Berbaring di tempat tidur
    const aktivitasNormal = aktivitas_fisik?.toLowerCase();
    switch (aktivitasNormal) {
        case 'bed rest':
            faktorAktivitas = 1.2;
            break;
        case 'ringan':
            faktorAktivitas = 1.3; 
            break;
        case 'sedang':
            faktorAktivitas = 1.6; 
            break;
        case 'berat':
            faktorAktivitas = 1.8; 
            break;
        case 'sangat berat':
            faktorAktivitas = 2.0; 
            break;
    }

    // =========================================================================
    // 4. FAKTOR STRES METABOLIK (Mendukung Custom Input Angka Desimal 1.1 - 1.7)
    // =========================================================================
    let faktorStres = 1.1; // Default: Tidak ada stress
    const parsedStress = parseFloat(faktor_stres);
    
    if (!isNaN(parsedStress) && parsedStress >= 1.1 && parsedStress <= 1.7) {
        faktorStres = parsedStress;
    } else {
        const stresNormal = faktor_stres?.toLowerCase();
        switch (stresNormal) {
            case 'ringan':
                faktorStres = 1.3; 
                break;
            case 'ringan sepsis':
                faktorStres = 1.5; 
                break;
            case 'berat':
                faktorStres = 1.6; 
                break;
            case 'sangat berat':
                faktorStres = 1.7; 
                break;
            case 'tidak ada':
            default:
                faktorStres = 1.1; 
                break;
        }
    }

    // =========================================================================
    // 5. KEBUTUHAN ENERGI TOTAL (TEE)
    // = BMR * Aktivitas * Stress (Tanpa Penambahan Kehamilan sesuai larangan medis CHF)
    // =========================================================================
    const kebutuhan_energi_total = bmr * faktorAktivitas * faktorStres;

    // =========================================================================
    // 6. DISTRIBUSI MAKRONUTRIEN CHF (Validasi Slider Dinamis Buku Biru Edisi 5)
    // =========================================================================
    
    // Nilai Default Aman untuk CHF
    let protein_persen = 15;
    let lemak_persen = 25;

    // Jika Frontend mengirim nilai slider, lakukan validasi ketat
    if (input_persen_protein !== undefined && input_persen_lemak !== undefined) {
        const p = parseFloat(input_persen_protein);
        const l = parseFloat(input_persen_lemak);

        // Validasi 1: Pagar Aman Buku Biru CHF
        if (p < 15 || p > 25) {
            throw new Error(`Persentase Protein CHF harus antara 15% - 25%. Input ditolak: ${p}%`);
        }
        if (l < 20 || l > 25) {
            throw new Error(`Persentase Lemak CHF harus antara 20% - 25%. Input ditolak: ${l}%`);
        }

        // Validasi 2: Pastikan sisa karbohidrat tidak negatif
        if ((protein_persen + l) >= 100) {
            throw new Error(`Total Protein (${protein_persen.toFixed(1)}%) dan Lemak (${l}%) melebih/sama dengan 100%.`);
        }

        // Lolos validasi, timpa nilai default
        protein_persen = p;
        lemak_persen = l;
    }

    // Eksekusi Kalori ke Gram
    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4;

    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    const karbohidrat_persen = 100 - protein_persen - lemak_persen;
    if (karbohidrat_persen < 50 || karbohidrat_persen > 60) {
        throw new Error(`Kalkulasi ditolak: Sisa Karbohidrat mencapai ${karbohidrat_persen.toFixed(1)}%. Persentase Karbohidrat CHF harus antara 50% - 60%.`);
    }
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    // Pemecahan Komposisi Lemak Dinamis menyesuaikan input user
    // Lemak Jenuh dikunci di rasio aman maksimal 10% (sesuai Buku Biru)
    const lemak_jenuh_persen = Math.floor(lemak_persen * (10/25));
    const kalori_lemak_jenuh = (lemak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_jenuh_gram = kalori_lemak_jenuh / 9;

    const lemak_tidak_jenuh_persen = lemak_persen - lemak_jenuh_persen;
    const kalori_lemak_tidak_jenuh = (lemak_tidak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_tidak_jenuh_gram = kalori_lemak_tidak_jenuh / 9;

    // =========================================================================
    // 7. MIKRONUTRIEN & CAIRAN (Spesifik Jantung - Buku Biru)
    // =========================================================================
    const natrium_mg = 1500;       // Sangat dibatasi < 1500 mg/hari
    const kolesterol_mg = 200;     // Dibatasi maksimal 200 mg/hari
    const kebutuhan_cairan = "Sesuai balance cairan (urine 24 jam + IWL)"; 

    // 8. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        koreksi: {
            energi_basal: parseFloat(bmr.toFixed(2)),
            koreksi_umur: 0, 
            koreksi_aktivitas: parseFloat(faktorAktivitas.toFixed(2)),
            koreksi_berat_badan: 0,
            stress_metabolik: parseFloat(faktorStres.toFixed(2)),
            kehamilan: 0 
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2)),
                
                // Tambahan Buku Biru
                lemak_jenuh_gr: parseFloat(lemak_jenuh_gram.toFixed(2)),
                lemak_tidak_jenuh_gr: parseFloat(lemak_tidak_jenuh_gram.toFixed(2)),
                natrium_mg: natrium_mg,
                kolesterol_mg: kolesterol_mg,
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
            bmr: parseFloat(bmr.toFixed(2)),
            faktor_aktivitas_nilai: parseFloat(faktorAktivitas.toFixed(2)), 
            faktor_stres_nilai: parseFloat(faktorStres.toFixed(2)), 
            penambahan_kalori: 0,
            kebutuhan_energi_total: parseFloat(kebutuhan_energi_total.toFixed(2)),
            protein_persen: parseFloat(protein_persen.toFixed(2)),
            lemak_persen: parseFloat(lemak_persen.toFixed(2)),
            karbohidrat_persen: parseFloat(karbohidrat_persen.toFixed(2)),
            protein_gram: parseFloat(protein_gram.toFixed(2)),
            lemak_gram: parseFloat(lemak_gram.toFixed(2)),
            karbohidrat_gram: parseFloat(karbohidrat_gram.toFixed(2)),
            
            lemak_jenuh_gram: parseFloat(lemak_jenuh_gram.toFixed(2)),
            lemak_tidak_jenuh_gram: parseFloat(lemak_tidak_jenuh_gram.toFixed(2)),
            natrium_mg: natrium_mg,
            kolesterol_mg: kolesterol_mg
        }
    };
};

module.exports = hitungCHF;