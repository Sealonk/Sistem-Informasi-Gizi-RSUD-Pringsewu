// ==========================================
// UTILS/PENYAKIT: hitungCHF_Stroke.js
// Komplikasi Ganda: Penyakit Jantung (CHF) + Stroke
// Pendekatan Hybrid: Energi (Excel RS/Mifflin) + Makro/Mikro (Buku Biru)
// Fitur: Validasi Slider Lemak (Titik Temu Paksa 25%) + Custom Stres Multiplier
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCHF_Stroke = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres,
        // Parameter Baru untuk Slider (Protein dikunci, hanya Lemak yang dikontrol user)
        input_persen_lemak 
    } = data;

    // 1. Dapatkan BBI dan IMT
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);

    // =========================================================================
    // 2. ENERGI BASAL (BMR) - Rumus Mifflin-St Jeor dengan BBI (Format Excel)
    // =========================================================================
    let bmr = 0;
    if (jenis_kelamin === 'L') {
        bmr = (10 * bbi) + (6.25 * tinggi_badan) - (5 * umur) + 5;
    } else {
        bmr = (10 * bbi) + (6.25 * tinggi_badan) - (5 * umur) - 161; 
    }

    // =========================================================================
    // 3. FAKTOR AKTIVITAS (Menggunakan sistem Pengali/Multiplier Excel)
    // =========================================================================
    let faktorAktivitas = 1.2; 
    const aktivitasNormal = aktivitas_fisik?.toLowerCase();
    switch (aktivitasNormal) {
        case 'bed rest': faktorAktivitas = 1.2; break;
        case 'ringan': faktorAktivitas = 1.3; break;
        case 'sedang': faktorAktivitas = 1.6; break;
        case 'berat': faktorAktivitas = 1.8; break;
        case 'sangat berat': faktorAktivitas = 2.0; break;
    }

    // =========================================================================
    // 4. FAKTOR STRES METABOLIK (Mendukung Custom Input Angka Desimal 1.1 - 1.7)
    // =========================================================================
    let faktorStres = 1.1; 
    const parsedStress = parseFloat(faktor_stres);
    
    if (!isNaN(parsedStress) && parsedStress >= 1.1 && parsedStress <= 1.7) {
        faktorStres = parsedStress;
    } else {
        const stresNormal = faktor_stres?.toLowerCase();
        switch (stresNormal) {
            case 'ringan': faktorStres = 1.3; break;
            case 'ringan sepsis': faktorStres = 1.5; break;
            case 'berat': faktorStres = 1.6; break;
            case 'sangat berat': faktorStres = 1.7; break;
            case 'tidak ada': default: faktorStres = 1.1; break;
        }
    }

    // =========================================================================
    // 5. KEBUTUHAN ENERGI TOTAL (TEE)
    // = BMR * Aktivitas * Stress (Kehamilan dinolkan karena berisiko pada CHF)
    // =========================================================================
    const kebutuhan_energi_total = bmr * faktorAktivitas * faktorStres;

    // =========================================================================
    // 6. DISTRIBUSI MAKRONUTRIEN CHF + STROKE (Validasi Slider & Batas Ketat)
    // =========================================================================
    
    // 6a. PROTEIN: Mutlak 1.2 g/kg BBI (Syarat neurologis Stroke untuk cegah katabolisme)
    // Protein dikunci (lock), tidak ada slider untuk protein.
    const protein_gram = 1.2 * bbi;
    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // 6b. LEMAK: Default 25% (Irisan emas antara CHF 20-25% dan Stroke 25-35%)
    let lemak_persen = 25;

    // Validasi input slider lemak dari Frontend
    if (input_persen_lemak !== undefined) {
        const l = parseFloat(input_persen_lemak);
        
        // Pagar Aman Lemak (Satu-satunya titik temu CHF dan Stroke adalah 25%)
        // Kita kunci ketat validasinya di angka 25 agar user tidak bisa input di luar irisan aman
        if (l !== 25) {
            throw new Error(`Persentase Lemak CHF+Stroke mutlak harus 25% untuk mengakomodir kedua penyakit. Input ditolak: ${l}%`);
        }
        
        if ((protein_persen + l) >= 100) {
            throw new Error(`Total Protein (${protein_persen.toFixed(1)}%) dan Lemak (${l}%) melebih/sama dengan 100%.`);
        }

        lemak_persen = l;
    }

    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // 6c. KARBOHIDRAT: Sisa TEE agar persis 100%
    const karbohidrat_persen = 100 - protein_persen - lemak_persen;
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    // Rincian Lemak (Diatur proporsional terhadap persentase lemak)
    // Lemak Jenuh < 7% mengikuti aturan Stroke yang lebih ketat
    const lemak_jenuh_persen = Math.floor(lemak_persen * (7/25));
    const kalori_lemak_jenuh = (lemak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_jenuh_gram = kalori_lemak_jenuh / 9;

    const lemak_pufa_persen = Math.floor(lemak_persen * (10/25));
    const kalori_lemak_pufa = (lemak_pufa_persen / 100) * kebutuhan_energi_total;
    const lemak_pufa_gram = kalori_lemak_pufa / 9;

    const lemak_mufa_persen = lemak_persen - lemak_jenuh_persen - lemak_pufa_persen; 
    const kalori_lemak_mufa = (lemak_mufa_persen / 100) * kebutuhan_energi_total;
    const lemak_mufa_gram = kalori_lemak_mufa / 9;

    // =========================================================================
    // 7. MIKRONUTRIEN, CAIRAN, DAN PEDOMAN KLINIS (Buku Biru)
    // =========================================================================
    const natrium_mg = 1500;       // Sangat dibatasi < 1500 mg/hari (Syarat ketat CHF)
    const kolesterol_mg = 200;     // Maksimal 200 mg/hari (Keduanya sepakat)
    const serat_gram = 25;         // Syarat Stroke (25-30g)
    
    // Gabungan peringatan klinis Cairan
    const kebutuhan_cairan = "Sesuai balance cairan (Perhatikan pembatasan CHF & cegah edema Stroke)"; 

    // 8. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        koreksi: {
            energi_basal: parseFloat(bmr.toFixed(2)),
            koreksi_aktivitas: parseFloat(faktorAktivitas.toFixed(2)),
            stress_metabolik: parseFloat(faktorStres.toFixed(2)),
            koreksi_umur: 0,
            kehamilan: 0 // Dinolkan
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2)),
                
                // Rincian Lemak & Mikro untuk UI Frontend
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
            lemak_pufa_gram: parseFloat(lemak_pufa_gram.toFixed(2)),
            lemak_mufa_gram: parseFloat(lemak_mufa_gram.toFixed(2)),
            natrium_mg: natrium_mg,
            kolesterol_mg: kolesterol_mg,
            serat_gram: serat_gram
        }
    };
};

module.exports = hitungCHF_Stroke;