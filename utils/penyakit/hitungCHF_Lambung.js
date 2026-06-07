// ==========================================
// UTILS/PENYAKIT: hitungCHF_Lambung.js
// Komplikasi Ganda: Penyakit Jantung (CHF) + Lambung/Dispepsia
// Pendekatan Hybrid: Energi (Excel RS/Mifflin) + Makro/Mikro (Buku Biru)
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCHF_Lambung = (data) => {
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
    // 4. FAKTOR STRES METABOLIK (Menggunakan sistem Pengali/Multiplier Excel)
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
    // = BMR * Aktivitas * Stress (Kehamilan = 0 karena berisiko tinggi pada CHF)
    // =========================================================================
    const kebutuhan_energi_total = bmr * faktorAktivitas * faktorStres;

    // =========================================================================
    // 6. DISTRIBUSI MAKRONUTRIEN CHF + LAMBUNG (Buku Biru)
    // Irisan: Protein 15%, Lemak 15%, Karbohidrat 70%
    // =========================================================================
    
    // Protein (15% dari TEE)
    const protein_persen = 15;
    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4;

    // Lemak (15% - Batas mutlak teratas untuk Lambung agar tidak mual)
    const lemak_persen = 15;
    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Rincian Lemak (Menyesuaikan batas Jantung <10% Jenuh, kita pakai 7% agar sangat aman)
    const lemak_jenuh_persen = 7;
    const lemak_jenuh_gram = ((lemak_jenuh_persen / 100) * kebutuhan_energi_total) / 9;

    const lemak_pufa_persen = 5;
    const lemak_pufa_gram = ((lemak_pufa_persen / 100) * kebutuhan_energi_total) / 9;

    const lemak_mufa_persen = 3; // Sisa dari 15%
    const lemak_mufa_gram = ((lemak_mufa_persen / 100) * kebutuhan_energi_total) / 9;

    // Karbohidrat (70% - Sisa TEE)
    const karbohidrat_persen = 70;
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    // =========================================================================
    // 7. MIKRONUTRIEN, CAIRAN, DAN PEDOMAN KLINIS (Buku Biru)
    // =========================================================================
    const natrium_mg = 1500;       // Sangat dibatasi < 1500 mg/hari (Syarat CHF)
    const kolesterol_mg = 200;     // Maksimal 200 mg/hari (Syarat CHF)
    const kebutuhan_cairan = "Sesuai balance cairan (urine 24 jam + IWL)"; // Syarat CHF

    // Peringatan klinis khusus Diet Lambung/Dispepsia
    const keterangan_serat = "Rendah serat (terutama batasi serat tidak larut air)";
    const anjuran_makan = "Porsi kecil & sering. Hindari bumbu tajam, asam, kopi, cokelat, minuman berkarbonasi.";

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
                kebutuhan_cairan: kebutuhan_cairan,
                keterangan_serat: keterangan_serat,
                anjuran_makan: anjuran_makan
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
            keterangan_serat: keterangan_serat,
            anjuran_makan: anjuran_makan
        }
    };
};

module.exports = hitungCHF_Lambung;