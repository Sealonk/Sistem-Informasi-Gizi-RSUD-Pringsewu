// ==========================================
// UTILS/PENYAKIT: hitungDM_Lambung.js
// Komplikasi Ganda: Diabetes Melitus + Saluran Cerna Atas / Dispepsia
// Pendekatan: Irisan Paling Ketat (The Strictest Limit) Buku Biru Edisi 5
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungDM_Lambung = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres, 
        kategori_penambahan_energi 
    } = data;

    // 1. Dapatkan BBI dan IMT
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);

    // =========================================================================
    // 2. KEBUTUHAN ENERGI BASAL (Cara Praktis DM)
    // =========================================================================
    let energiBasal = 0;
    if (jenis_kelamin === 'L') {
        energiBasal = bbi * 30;
    } else {
        energiBasal = bbi * 25;
    }

    // 3. KOREKSI UMUR (Usia < 40 tahun = 0%)
    let koreksiUmurNilai = 0;
    if (umur >= 40 && umur <= 59) {
        koreksiUmurNilai = energiBasal * -0.05; // -5%
    } else if (umur >= 60 && umur <= 69) {
        koreksiUmurNilai = energiBasal * -0.10; // -10%
    } else if (umur >= 70) {
        koreksiUmurNilai = energiBasal * -0.20; // -20%
    } else {
        koreksiUmurNilai = 0;
    }

    // 4. KOREKSI AKTIVITAS
    let koreksiAktivitasNilai = 0;
    let persentaseAktivitas = 0.20; 
    const aktivitasNormal = aktivitas_fisik?.toLowerCase();
    switch (aktivitasNormal) {
        case 'bed rest': persentaseAktivitas = 0.10; break;
        case 'ringan': persentaseAktivitas = 0.20; break;
        case 'sedang': persentaseAktivitas = 0.30; break;
        case 'berat': persentaseAktivitas = 0.40; break;
        case 'sangat berat': persentaseAktivitas = 0.50; break;
    }
    koreksiAktivitasNilai = energiBasal * persentaseAktivitas;

    // 5. STRES METABOLIK
    let koreksiStresNilai = 0;
    let persentaseStres = 0.10; 
    const parsedStress = parseFloat(faktor_stres);
    if (!isNaN(parsedStress) && parsedStress >= 1.1 && parsedStress <= 1.7) {
        persentaseStres = parsedStress - 1.0; 
    } else {
        const stressNormal = faktor_stres?.toLowerCase();
        switch (stressNormal) {
            case 'ringan': persentaseStres = 0.10; break;
            case 'sedang': persentaseStres = 0.20; break;
            case 'berat': persentaseStres = 0.30; break;
            default: persentaseStres = 0.10; break;
        }
    }
    koreksiStresNilai = energiBasal * persentaseStres;

    // 6. PENAMBAHAN KALORI (KEHAMILAN DM GESTASIONAL)
    let penambahanKaloriNilai = 0;
    if (kategori_penambahan_energi) {
        const kat = kategori_penambahan_energi.toUpperCase();
        if (kat.includes('TMSTR 1') || kat.includes('TRIMESTER 1')) {
            penambahanKaloriNilai = 180;
        } else if (kat.includes('TMSTR 2') || kat.includes('TMSTR 3') || kat.includes('TRIMESTER 2') || kat.includes('TRIMESTER 3') || kat.includes('2 & 3')) {
            penambahanKaloriNilai = 300;
        }
    }

    // 7. KEBUTUHAN ENERGI TOTAL (TEE)
    const kebutuhan_energi_total = energiBasal + koreksiUmurNilai + koreksiAktivitasNilai + koreksiStresNilai + penambahanKaloriNilai;

    // =========================================================================
    // 8. DISTRIBUSI MAKRONUTRIEN (Irisan Penyakit DM + Lambung)
    // Syarat DM: Karbohidrat max 65%, Protein 10-20%
    // Syarat Lambung: Lemak max 15%
    // Kombinasi Ideal: Protein 20%, Lemak 15%, Karbohidrat 65%
    // =========================================================================
    
    // Hitung Protein (20% - Batas atas DM untuk menutupi sisa persentase)
    const protein_persen = 20;
    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4; 

    // Hitung Lemak (15% - Batas wajib tertinggi Diet Lambung)
    const lemak_persen = 15;
    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Rincian Lemak (DM) - Total 15%
    const lemak_jenuh_persen = 5; // Aman (Syarat DM < 7%)
    const lemak_jenuh_gram = ((lemak_jenuh_persen / 100) * kebutuhan_energi_total) / 9;
    
    const lemak_pufa_persen = 5;  // Aman (Syarat DM < 10%)
    const lemak_pufa_gram = ((lemak_pufa_persen / 100) * kebutuhan_energi_total) / 9;

    const lemak_mufa_persen = 5;  // Sisa untuk mencapai 15%
    const lemak_mufa_gram = ((lemak_mufa_persen / 100) * kebutuhan_energi_total) / 9;

    // Hitung Karbohidrat (65% - Batas atas DM)
    const karbohidrat_persen = 65;
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4; 

    // =========================================================================
    // 9. MIKRONUTRIEN, SERAT, DAN KETERANGAN KLINIS
    // =========================================================================
    const natrium_mg = 2300;     // DM
    const kolesterol_mg = 200;   // DM
    
    // Peringatan klinis khusus komplikasi lambung
    const keterangan_serat = "Rendah serat tidak larut air, tingkatkan bertahap menuju 20-25 g/hari";
    const anjuran_makan = "Porsi kecil dan sering (Hindari bumbu tajam, kopi, cokelat, rokok)";

    // 10. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        koreksi: {
            energi_basal: parseFloat(energiBasal.toFixed(2)),
            koreksi_umur: parseFloat(koreksiUmurNilai.toFixed(2)),
            koreksi_aktivitas: parseFloat(koreksiAktivitasNilai.toFixed(2)),
            koreksi_berat_badan: 0,
            stress_metabolik: parseFloat(koreksiStresNilai.toFixed(2)),
            kehamilan: penambahanKaloriNilai
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2)),
                
                // Mikronutrien & Pedoman
                lemak_jenuh_gr: parseFloat(lemak_jenuh_gram.toFixed(2)),
                lemak_pufa_gr: parseFloat(lemak_pufa_gram.toFixed(2)),
                lemak_mufa_gr: parseFloat(lemak_mufa_gram.toFixed(2)),
                natrium_mg: natrium_mg,
                kolesterol_mg: kolesterol_mg,
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
            bmr: parseFloat(energiBasal.toFixed(2)),
            faktor_aktivitas_nilai: parseFloat(persentaseAktivitas.toFixed(2)), 
            faktor_stres_nilai: parseFloat((persentaseStres + 1).toFixed(2)),
            penambahan_kalori: penambahanKaloriNilai,
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

module.exports = hitungDM_Lambung;