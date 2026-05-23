// ==========================================
// UTILS/PENYAKIT: hitungCKD_Lambung.js
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCKD_Lambung = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        status_hemodialisa,
        kategori_penambahan_energi 
    } = data;

    // 1. Dapatkan BBI dan IMT 
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan); 

    // 2. KEBUTUHAN ENERGI TOTAL (TEE) KHUSUS CKD
    // Rumus dasar tetap mengikuti jalur CKD (menggunakan target BBI tanpa sistem koreksi basal)
    let kebutuhan_energi_total = 0;
    if (umur < 60) {
        kebutuhan_energi_total = 35 * bbi;
    } else {
        kebutuhan_energi_total = 30 * bbi;
    }

    // 3. PENAMBAHAN KALORI (KEHAMILAN)
    let penambahanKaloriNilai = 0;
    if (kategori_penambahan_energi) {
        const kategoriUpper = kategori_penambahan_energi.toUpperCase();
        if (kategoriUpper.includes('TMSTR 1') || kategoriUpper.includes('TRIMESTER 1') || kategoriUpper.includes('TRIMESTER 2') || kategoriUpper.includes('1 & 2')) {
            penambahanKaloriNilai = 300;
        } else if (kategoriUpper.includes('TMSTR 3') || kategoriUpper.includes('TRIMESTER 3')) {
            penambahanKaloriNilai = 500;
        }
        kebutuhan_energi_total += penambahanKaloriNilai;
    }

    // =========================================================================
    // 4. DISTRIBUSI MAKRONUTRIEN CKD + LAMBUNG
    // PERBEDAAN UTAMA: Persentase alokasi lemak diturunkan menjadi 20%
    // =========================================================================
    
    // Hitung Protein (Aturan CKD: Bergantung pada Hemodialisa)
    let protein_gram = 0;
    if (status_hemodialisa && status_hemodialisa.toLowerCase() === 'ya') {
        protein_gram = 1.2 * bbi; 
    } else {
        protein_gram = 0.8 * bbi; 
    }

    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // Hitung Lemak (CKD + Lambung menggunakan batas ketat 20%)
    const lemak_gram = (20 / 100 * kebutuhan_energi_total) / 9; 
    const kalori_lemak = lemak_gram * 9; 
    const lemak_persen = (kalori_lemak / kebutuhan_energi_total) * 100;

    // Hitung Karbohidrat (Sisa energi total otomatis melebar untuk menjaga keseimbangan kalori)
    const karbohidrat_gram = (kebutuhan_energi_total - kalori_protein - kalori_lemak) / 4; 
    const kalori_karbohidrat = karbohidrat_gram * 4; 
    const karbohidrat_persen = (kalori_karbohidrat / kebutuhan_energi_total) * 100;

    // 5. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        // Kelompok Koreksi dinolkan karena mengikuti pakem perhitungan dasar CKD
        koreksi: {
            energi_basal: 0,
            koreksi_umur: 0,
            koreksi_aktivitas: 0,
            koreksi_berat_badan: 0,
            stress_metabolik: 0,
            kehamilan: penambahanKaloriNilai
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
            bmr: 0, 
            faktor_aktivitas_nilai: 0, 
            faktor_stres_nilai: 0,
            penambahan_kalori: penambahanKaloriNilai,
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

module.exports = hitungCKD_Lambung;