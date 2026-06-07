// ==========================================
// UTILS/PENYAKIT: hitungCHF.js (Penyakit Jantung / Gagal Jantung)
// Pendekatan Hybrid: Energi (Excel RS/Mifflin) + Makro/Mikro (Buku Biru)
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCHF = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres 
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
            faktorAktivitas = 1.3; // Dapat turun dari tempat tidur
            break;
        case 'sedang':
            faktorAktivitas = 1.6; // Kerja banyak duduk
            break;
        case 'berat':
            faktorAktivitas = 1.8; // Kerja banyak berdiri
            break;
        case 'sangat berat':
            faktorAktivitas = 2.0; // Pekerjaan berat / Olahraga aktif
            break;
    }

    // =========================================================================
    // 4. FAKTOR STRES METABOLIK (Menggunakan sistem Pengali/Multiplier dari Excel)
    // =========================================================================
    let faktorStres = 1.1; // Default: Tidak ada stress
    const parsedStress = parseFloat(faktor_stres);
    
    if (!isNaN(parsedStress) && parsedStress >= 1.1 && parsedStress <= 1.7) {
        faktorStres = parsedStress;
    } else {
        const stresNormal = faktor_stres?.toLowerCase();
        switch (stresNormal) {
            case 'ringan':
                faktorStres = 1.3; // Representasi range 1.2 - 1.4
                break;
            case 'ringan sepsis':
                faktorStres = 1.5; // Representasi range 1.4 - 1.5
                break;
            case 'berat':
                faktorStres = 1.6; // Representasi range 1.5 - 1.6
                break;
            case 'sangat berat':
                faktorStres = 1.7; // Representasi khusus nilai 1.7
                break;
            case 'tidak ada':
            default:
                faktorStres = 1.1; // Tidak ada stress
                break;
        }
    }

    // =========================================================================
    // 5. KEBUTUHAN ENERGI TOTAL (TEE)
    // = BMR * Aktivitas * Stress (Tanpa Penambahan Kehamilan sesuai larangan medis CHF)
    // =========================================================================
    const kebutuhan_energi_total = bmr * faktorAktivitas * faktorStres;

    // =========================================================================
    // 6. DISTRIBUSI MAKRONUTRIEN CHF (Buku Biru Edisi 5)
    // Protein: 15%, Lemak Total: 25%, Karbohidrat: 60%
    // =========================================================================
    
    // Protein (15%)
    const protein_persen = 15;
    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4;

    // Lemak Total (25%)
    const lemak_persen = 25;
    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Pemecahan Komposisi Lemak sesuai Buku Biru:
    // Lemak Jenuh: 10% | Lemak Tidak Jenuh (Ganda+Tunggal): 15%
    const lemak_jenuh_persen = 10;
    const kalori_lemak_jenuh = (lemak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_jenuh_gram = kalori_lemak_jenuh / 9;

    const lemak_tidak_jenuh_persen = 15;
    const kalori_lemak_tidak_jenuh = (lemak_tidak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_tidak_jenuh_gram = kalori_lemak_tidak_jenuh / 9;

    // Karbohidrat (60% sisa dari Protein dan Lemak)
    const karbohidrat_persen = 60;
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

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
            kehamilan: 0 // Dinolkan
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
            
            // Siap jika nanti ingin dimasukkan ke database gizi RS
            lemak_jenuh_gram: parseFloat(lemak_jenuh_gram.toFixed(2)),
            lemak_tidak_jenuh_gram: parseFloat(lemak_tidak_jenuh_gram.toFixed(2)),
            natrium_mg: natrium_mg,
            kolesterol_mg: kolesterol_mg
        }
    };
};

module.exports = hitungCHF;