// ==========================================
// UTILS/PENYAKIT: hitungCHF_Lambung.js
// Komplikasi Ganda: Penyakit Jantung (CHF) + Lambung/Dispepsia
// Pendekatan Hybrid: Energi (Excel RS/Mifflin) + Makro/Mikro (Buku Biru)
// Fitur: Validasi Slider Makronutrien Dinamis + Custom Stres Multiplier
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCHF_Lambung = (data) => {
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
    // = BMR * Aktivitas * Stress (Kehamilan = 0 karena berisiko tinggi pada CHF)
    // =========================================================================
    const kebutuhan_energi_total = bmr * faktorAktivitas * faktorStres;

    // =========================================================================
    // 6. DISTRIBUSI MAKRONUTRIEN CHF + LAMBUNG (Validasi Slider Dinamis)
    // =========================================================================
    
// Nilai Default Aman: Lemak ditekan (Lambung), Karbohidrat ditahan (CHF), Protein naik menutupi sisa
    let protein_persen = 25;
    let lemak_persen = 15;
    let karbohidrat_persen = 60;

    // Jika Frontend mengirim nilai slider, lakukan validasi ketat
    if (input_persen_protein !== undefined && input_persen_lemak !== undefined && input_persen_karbo !== undefined) {
        const p = parseFloat(input_persen_protein);
        const l = parseFloat(input_persen_lemak);
        const k = parseFloat(input_persen_karbo);

        if (Math.round(p + l + k) !== 100) {
            throw new Error(`Total persentase harus 100%. Saat ini: ${p + l + k}%`);
        }

        // Lemak dikunci mutlak 10-15% (Syarat Lambung)
        if (l < 10 || l > 15) {
            throw new Error(`Persentase Lemak mutlak harus mengikuti batas Lambung (10% - 15%) agar tidak dispepsia.`);
        }
        
        // Karbohidrat dikunci maksimal 60% (Syarat mutlak Jantung cegah sesak)
        if (k > 60) {
            throw new Error(`Persentase Karbohidrat tidak boleh lebih dari 60% untuk mencegah sesak napas pada pasien CHF.`);
        }

        // Protein fleksibel menutupi sisa (bisa mencapai 30% jika lemak 10% dan karbo 60%)
        // Ini lebih aman daripada membiarkan pasien jantung sesak karena karbohidrat berlebih
        
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

    // Rincian Lemak (Menyesuaikan batas Jantung <10% Jenuh, kita pakai rasio dinamis agar sangat aman)
    const lemak_jenuh_persen = Math.floor(lemak_persen * (7/15));
    const kalori_lemak_jenuh = (lemak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_jenuh_gram = kalori_lemak_jenuh / 9;

    const lemak_pufa_persen = Math.floor(lemak_persen * (5/15));
    const kalori_lemak_pufa = (lemak_pufa_persen / 100) * kebutuhan_energi_total;
    const lemak_pufa_gram = kalori_lemak_pufa / 9;

    const lemak_mufa_persen = lemak_persen - lemak_jenuh_persen - lemak_pufa_persen; // Sisa
    const kalori_lemak_mufa = (lemak_mufa_persen / 100) * kebutuhan_energi_total;
    const lemak_mufa_gram = kalori_lemak_mufa / 9;

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