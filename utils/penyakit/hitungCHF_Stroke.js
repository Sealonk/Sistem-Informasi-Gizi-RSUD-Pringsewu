// ==========================================
// UTILS/PENYAKIT: hitungCHF_Stroke.js
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCHF_Stroke = (data) => {
    const { jenis_kelamin, berat_badan, tinggi_badan, umur, aktivitas_fisik, faktor_stres } = data;

    // 1. Dapatkan BBI dan IMT
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);

    // 2. ENERGI BASAL (BMR) - Menggunakan Rumus Mifflin-St Jeor dengan BBI
    // Excel Laki-laki: =(10*BBI) + (6.25*TB) - (5*Umur) + 5
    // Excel Perempuan: =(10*BBI) + (6.25*TB) - (5*Umur) - 161
    let bmr = 0;
    if (jenis_kelamin === 'L') {
        bmr = (10 * bbi) + (6.25 * tinggi_badan) - (5 * umur) + 5;
    } else {
        bmr = (10 * bbi) + (6.25 * tinggi_badan) - (5 * umur) - 161; 
    }

    // 3. FAKTOR AKTIVITAS (Menggunakan sistem Pengali/Multiplier)
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
        case 'Berat':
            faktorAktivitas = 1.8; // Kerja banyak berdiri
            break;
        case 'sangat berat':
            faktorAktivitas = 2.0; // Olahraga sangat aktif
            break;
    }

    // 4. FAKTOR STRES METABOLIK (Menggunakan sistem Pengali/Multiplier)
    let faktorStres = 1.1; // Default: Tidak ada stress
    
    // Pengecekan jika frontend mengirim angka langsung (misal "1.4")
    const parsedStress = parseFloat(faktor_stres);
    if (!isNaN(parsedStress) && parsedStress >= 1.1 && parsedStress <= 1.7) {
        faktorStres = parsedStress;
    } else {
        // Jika frontend mengirim teks, kita terjemahkan ke nilai representatif dari Excel
        const stresNormal = faktor_stres?.toLowerCase();
        switch (stresNormal) {
            case 'ringan':
                faktorStres = 1.3; // Representasi range 1.2 - 1.4
                break;
            case 'ringan sepsis':
                faktorStres = 1.5; // Representasi range 1.4 - 1.6
                break;
            case 'berat':
                faktorStres = 1.6; // Representasi range 1.5 - 1.7
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

    // 6. KEBUTUHAN ENERGI TOTAL (TEE)
    // Excel: = (BMR * Aktivitas * Stress) + Kehamilan
    const kebutuhan_energi_total = bmr * faktorAktivitas * faktorStres;

    // =========================================================================
    // 7. DISTRIBUSI MAKRONUTRIEN CHF + STROKE
    // PERBEDAAN UTAMA: Pembatasan lemak ketat di angka 20% (Khas regulasi gizi CHF)
    // =========================================================================
    
    // Hitung Protein (= 1 * BBI)
    const protein_gram = 1 * bbi;
    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // Hitung Lemak (Menggunakan batas ketat 20% dari TEE)
    const lemak_gram = (20 / 100 * kebutuhan_energi_total) / 9; 
    const kalori_lemak = lemak_gram * 9; 
    const lemak_persen = (kalori_lemak / kebutuhan_energi_total) * 100;

    // Hitung Karbohidrat (Sisa TEE dikurangi Protein dan Lemak)
    const kalori_karbohidrat = kebutuhan_energi_total - kalori_protein - kalori_lemak;
    const karbohidrat_gram = kalori_karbohidrat / 4; 
    const karbohidrat_persen = (kalori_karbohidrat / kebutuhan_energi_total) * 100;

    // 8. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        // KELOMPOK 1: KOREKSI 
        koreksi: {
            energi_basal: parseFloat(bmr.toFixed(2)), 
            koreksi_aktivitas: parseFloat(faktorAktivitas.toFixed(2)),
            stress_metabolik: parseFloat(faktorStres.toFixed(2)),
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2))
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
            karbohidrat_gram: parseFloat(karbohidrat_gram.toFixed(2))
        }
    };
};

module.exports = hitungCHF_Stroke;