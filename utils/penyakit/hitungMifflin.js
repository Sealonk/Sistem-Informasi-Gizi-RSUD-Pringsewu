const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungMifflin = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        aktivitas_fisik, 
        faktor_stres, 
        kategori_penambahan_energi,
        input_persen_protein,
        input_persen_lemak,
        input_persen_karbo 
    } = data;

    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan);

    // 1. ENERGI BASAL (BMR) - Rumus Mifflin Standar
    let bmr = 0;
    if (jenis_kelamin === 'L') {
        bmr = (10 * berat_badan) + (6.25 * tinggi_badan) - (5 * umur) + 5;
    } else {
        bmr = (10 * berat_badan) + (6.25 * tinggi_badan) - (5 * umur) - 161; 
    }

    // 2. FAKTOR AKTIVITAS
    let faktorAktivitas = 1.2;
    const aktivitasNormal = aktivitas_fisik?.toLowerCase();
    switch (aktivitasNormal) {
        case 'bed rest': faktorAktivitas = 1.2; break;
        case 'ringan': faktorAktivitas = 1.3; break;
        case 'sedang': faktorAktivitas = 1.6; break;
        case 'berat': faktorAktivitas = 1.8; break;
        case 'sangat berat': faktorAktivitas = 2.0; break;
        default: faktorAktivitas = 1.2; break;
    }

    // 3. FAKTOR STRES METABOLIK
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

    // 4. PENAMBAHAN KALORI (Kehamilan)
    let penambahanKaloriNilai = 0;
    if (kategori_penambahan_energi) {
        const kategoriUpper = kategori_penambahan_energi.toUpperCase();
        if (kategoriUpper.includes('TMSTR 1') || kategoriUpper.includes('TRIMESTER 1') || kategoriUpper.includes('TRIMESTER 2') || kategoriUpper.includes('1 & 2')) {
            penambahanKaloriNilai = 300;
        } else if (kategoriUpper.includes('TMSTR 3') || kategoriUpper.includes('TRIMESTER 3')) {
            penambahanKaloriNilai = 500;
        }
    }

    // 5. KEBUTUHAN ENERGI TOTAL (TEE)
    const kebutuhan_energi_total = (bmr * faktorAktivitas * faktorStres) + penambahanKaloriNilai;

    // 6. DISTRIBUSI MAKRONUTRIEN
    
    // Nilai Default
    let protein_persen = 15;
    let lemak_persen = 25;

    if (input_persen_protein !== undefined && input_persen_lemak !== undefined) {
        const p = parseFloat(input_persen_protein);
        const l = parseFloat(input_persen_lemak);

        if (p < 10 || p > 30) {
            throw new Error(`Persentase Protein Dewasa harus di rentang 10% - 30%. Input ditolak: ${p}%`);
        }
        if (l < 20 || l > 30) {
            throw new Error(`Persentase Lemak Dewasa harus di rentang 20% - 30%. Input ditolak: ${l}%`);
        }

        if ((protein_persen + l) >= 100) {
            throw new Error(`Total Protein (${protein_persen.toFixed(1)}%) dan Lemak (${l}%) melebih/sama dengan 100%.`);
        }

        protein_persen = p;
        lemak_persen = l;
    }

    const kalori_protein = (protein_persen / 100) * kebutuhan_energi_total;
    const protein_gram = kalori_protein / 4;

    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    const karbohidrat_persen = 100 - protein_persen - lemak_persen;
    if (karbohidrat_persen < 45 || karbohidrat_persen > 65) {
        throw new Error(`Kalkulasi ditolak: Sisa Karbohidrat mencapai ${karbohidrat_persen.toFixed(1)}%. Persentase Karbohidrat Mifflin harus antara 45% - 65%.`);
    } const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),
        koreksi: {
            energi_basal: parseFloat(bmr.toFixed(2)),
            koreksi_umur: 0,
            koreksi_aktivitas: parseFloat(faktorAktivitas.toFixed(2)),
            stress_metabolik: parseFloat(faktorStres.toFixed(2)),
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
            bmr: parseFloat(bmr.toFixed(2)), 
            faktor_aktivitas_nilai: parseFloat(faktorAktivitas.toFixed(2)), 
            faktor_stres_nilai: parseFloat(faktorStres.toFixed(2)),
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

module.exports = hitungMifflin;