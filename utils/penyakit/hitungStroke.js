// ==========================================
// UTILS/PENYAKIT: hitungStroke.js
// Berdasarkan: Penuntun Diet & Terapi Gizi Edisi 5 (PERSAGI)
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungStroke = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan
    } = data;

    // 1. Dapatkan BBI dan IMT 
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan); 
    const statusGizi = dataIMT.statusGizi.toLowerCase();

    // =========================================================================
    // 2. KEBUTUHAN ENERGI TOTAL (TEE) - Berdasarkan Status Gizi (Buku Biru)
    // Gizi Baik: 25-30 kkal/kg BB | Malnutrisi: 30-35 kkal/kg BB 
    // Obesitas: Penyesuaian khusus (Kita gunakan 25 kkal/kg BBI)
    // Kondisi Akut (Fase awal masuk RS): 20-25 kkal/kg BB
    // =========================================================================
    let kebutuhan_energi_total = 0;
    
    // Asumsi: Sistem menghitung fase pemulihan (bukan fase hiperakut hari pertama)
    if (statusGizi.includes('kurang') || statusGizi.includes('kurus')) {
        // Malnutrisi: Butuh energi lebih banyak
        kebutuhan_energi_total = 35 * bbi; 
    } else if (statusGizi.includes('lebih') || statusGizi.includes('obesitas') || statusGizi.includes('gemuk')) {
        // Obesitas: Pembatasan kalori secara aman
        kebutuhan_energi_total = 25 * bbi;
    } else {
        // Gizi Baik/Normal
        kebutuhan_energi_total = 30 * bbi;
    }

    // Disimpan ke energiBasal agar struktur JSON Frontend tidak error
    const energiBasal = kebutuhan_energi_total;

    // =========================================================================
    // 3. DISTRIBUSI MAKRONUTRIEN STROKE (Buku Biru Edisi 5)
    // =========================================================================
    
    // PROTEIN: 1 - 1.5 g/kg BB/hari (Kita gunakan nilai tengah 1.2 g/kg)
    const protein_gram = 1.2 * bbi;
    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // LEMAK TOTAL: 25 - 35% (Kita gunakan batas bawah 25%)
    const lemak_persen = 25;
    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Rincian Lemak Stroke (Buku Biru): Jenuh <7%, PUFA <10%, MUFA <20%
    // Di sini kita memberikan batas maksimal yang diizinkan untuk UI Frontend
    const lemak_jenuh_persen = 7;
    const lemak_jenuh_gram = ((lemak_jenuh_persen / 100) * kebutuhan_energi_total) / 9;
    
    const lemak_pufa_persen = 10;
    const lemak_pufa_gram = ((lemak_pufa_persen / 100) * kebutuhan_energi_total) / 9;

    const lemak_mufa_persen = 20;
    const lemak_mufa_gram = ((lemak_mufa_persen / 100) * kebutuhan_energi_total) / 9;

    // KARBOHIDRAT: Sisa energi total (Kisaran 50-60%)
    const kalori_karbohidrat = kebutuhan_energi_total - kalori_protein - kalori_lemak;
    const karbohidrat_gram = kalori_karbohidrat / 4; 
    const karbohidrat_persen = (kalori_karbohidrat / kebutuhan_energi_total) * 100;

    // =========================================================================
    // 4. MIKRONUTRIEN & CAIRAN (Buku Biru Stroke)
    // =========================================================================
    const kolesterol_mg = 200;       // < 200 mg/hari
    const serat_gram = 30;           // 25 - 30 gram/hari
    
    // Cairan 30-40 ml/kg BB (Menggunakan BB Aktual jika ada, jika tidak BB Ideal)
    const berat_patokan_cairan = (berat_badan > 0) ? berat_badan : bbi;
    const cairan_ml = 35 * berat_patokan_cairan; // Ambil nilai tengah 35 ml
    const kebutuhan_cairan = `${cairan_ml} ml`;

    // 5. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        koreksi: {
            energi_basal: parseFloat(energiBasal.toFixed(2)),
            koreksi_umur: 0, 
            koreksi_aktivitas: 0, 
            koreksi_berat_badan: 0,
            stress_metabolik: 0,
            kehamilan: 0 
        },

        perhitungan: {
            hasil: {
                energi_kkal: parseFloat(kebutuhan_energi_total.toFixed(2)),
                protein_gr: parseFloat(protein_gram.toFixed(2)),
                lemak_gr: parseFloat(lemak_gram.toFixed(2)),
                karbohidrat_gr: parseFloat(karbohidrat_gram.toFixed(2)),
                
                // Tambahan Buku Biru
                lemak_jenuh_gr: parseFloat(lemak_jenuh_gram.toFixed(2)),
                lemak_pufa_gr: parseFloat(lemak_pufa_gram.toFixed(2)),
                lemak_mufa_gr: parseFloat(lemak_mufa_gram.toFixed(2)),
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
            bmr: parseFloat(energiBasal.toFixed(2)),
            faktor_aktivitas_nilai: 0, 
            faktor_stres_nilai: 0, 
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
            kolesterol_mg: kolesterol_mg,
            serat_gram: serat_gram
        }
    };
};

module.exports = hitungStroke;