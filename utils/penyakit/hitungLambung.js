// ==========================================
// UTILS/PENYAKIT: hitungLambung.js (Dispepsia / Saluran Cerna Atas)
// Pendekatan Hybrid: Energi (Excel RS/Mifflin) + Makro (Buku Biru)
// Fitur: Validasi Slider Makronutrien Dinamis + Custom Stres Multiplier
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungLambung = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres,
        // Parameter Baru untuk Slider Persentase Makronutrien (Opsional)
        input_persen_protein,
        input_persen_lemak,
        input_persen_karbo
    } = data;

    // 1. Dapatkan BBI dan IMT
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);

    // =========================================================================
    // 2. ENERGI BASAL (BMR) - Menggunakan Rumus Mifflin-St Jeor dengan BBI
    // Sesuai format Excel Rumah Sakit Pringsewu
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
    // = BMR * Aktivitas * Stress
    // =========================================================================
    const kebutuhan_energi_total = bmr * faktorAktivitas * faktorStres;

    // =========================================================================
    // 6. DISTRIBUSI MAKRONUTRIEN LAMBUNG / DISPEPSIA (Validasi Slider)
    // =========================================================================
    
    // Nilai Default Buku Biru (Kondisi Stabil Nyaman)
    let protein_persen = 15;
    let lemak_persen = 15;
    let karbohidrat_persen = 70;

    // Jika Frontend mengirim nilai slider, lakukan validasi ketat
    if (input_persen_protein !== undefined && input_persen_lemak !== undefined && input_persen_karbo !== undefined) {
        const p = parseFloat(input_persen_protein);
        const l = parseFloat(input_persen_lemak);
        const k = parseFloat(input_persen_karbo);

        // Validasi 1: Total harus tepat 100%
        if (Math.round(p + l + k) !== 100) {
            throw new Error(`Total persentase makronutrien harus 100%. Saat ini: ${p + l + k}%`);
        }

        // Validasi 2: Pagar Aman Buku Biru Lambung murni
        if (p < 10 || p > 20) {
            throw new Error(`Persentase Protein Lambung harus kadar normal (10% - 20%). Input ditolak: ${p}%`);
        }
        if (l < 10 || l > 15) {
            throw new Error(`Persentase Lemak Lambung ketat rendah (10% - 15%) agar tidak memicu mual. Input ditolak: ${l}%`);
        }
        if (k < 65 || k > 80) {
            throw new Error(`Persentase Karbohidrat Lambung berada di rentang tinggi (65% - 80%). Input ditolak: ${k}%`);
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

    // Keterangan klinis tambahan dari Buku Biru
    const keterangan_serat = "Rendah serat (terutama serat tidak larut air)";
    const anjuran_makan = "Porsi kecil & sering. Hindari bumbu tajam, asam, kopi, cokelat, minuman berkarbonasi.";

    // 7. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        koreksi: {
            energi_basal: parseFloat(bmr.toFixed(2)),
            koreksi_aktivitas: parseFloat(faktorAktivitas.toFixed(2)),
            stress_metabolik: parseFloat(faktorStres.toFixed(2)),
            koreksi_umur: 0,
            kehamilan: 0
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2)),
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
            kebutuhan_energi_total: parseFloat(kebutuhan_energi_total.toFixed(2)),
            protein_persen: parseFloat(protein_persen.toFixed(2)),
            lemak_persen: parseFloat(lemak_persen.toFixed(2)),
            karbohidrat_persen: parseFloat(karbohidrat_persen.toFixed(2)),
            protein_gram: parseFloat(protein_gram.toFixed(2)),
            lemak_gram: parseFloat(lemak_gram.toFixed(2)),
            karbohidrat_gram: parseFloat(karbohidrat_gram.toFixed(2)),
            keterangan_serat: keterangan_serat,
            anjuran_makan: anjuran_makan
        }
    };
};

module.exports = hitungLambung;