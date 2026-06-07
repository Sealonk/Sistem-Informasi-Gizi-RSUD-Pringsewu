// ==========================================
// UTILS/PENYAKIT: hitungLambung.js (Dispepsia / Saluran Cerna Atas)
// Pendekatan Hybrid: Energi (Excel RS/Mifflin) + Makro (Buku Biru)
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungLambung = (data) => {
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
    // Excel Laki-laki: =(10*BBI) + (6.25*TB) - (5*Umur) + 5
    // Excel Perempuan: =(10*BBI) + (6.25*TB) - (5*Umur) - 161
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
            faktorAktivitas = 1.3; // Dapat turun dari tempat tidur
            break;
        case 'sedang':
            faktorAktivitas = 1.6; // Kerja banyak duduk
            break;
        case 'berat':
            faktorAktivitas = 1.8; // Kerja banyak berdiri
            break;
        case 'sangat berat':
            faktorAktivitas = 2.0; // Olahraga sangat aktif
            break;
    }

    // =========================================================================
    // 4. FAKTOR STRES METABOLIK (Menggunakan sistem Pengali/Multiplier Excel)
    // =========================================================================
    let faktorStres = 1.1; // Default: Tidak ada stress
    
    // Pengecekan jika frontend mengirim angka langsung
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

    // =========================================================================
    // 5. KEBUTUHAN ENERGI TOTAL (TEE)
    // = BMR * Aktivitas * Stress
    // =========================================================================
    const kebutuhan_energi_total = bmr * faktorAktivitas * faktorStres;

    // =========================================================================
    // 6. DISTRIBUSI MAKRONUTRIEN LAMBUNG / DISPEPSIA (Buku Biru)
    // Protein: 15% | Lemak: 15% (Rendah) | Karbohidrat: 70%
    // =========================================================================
    
    // Hitung Protein (15% dari TEE)
    const protein_persen = 15;
    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4;

    // Hitung Lemak (15% dari TEE - Penurunan drastis sesuai diet lambung)
    const lemak_persen = 15;
    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Hitung Karbohidrat (70% - Sisa TEE dikurangi Protein dan Lemak)
    const karbohidrat_persen = 70;
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    // Keterangan klinis tambahan dari Buku Biru
    const keterangan_serat = "Rendah serat (terutama serat tidak larut air)";

    // 7. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        // KELOMPOK 1: KOREKSI 
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
                
                // Indikator klinis lambung untuk ditampilkan di UI
                keterangan_serat: keterangan_serat
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
            keterangan_serat: keterangan_serat
        }
    };
};

module.exports = hitungLambung;