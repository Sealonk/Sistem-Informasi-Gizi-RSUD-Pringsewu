// ==========================================
// UTILS/PENYAKIT: hitungCKD_Stroke.js
// Komplikasi Ganda: Ginjal Kronik (CKD) + Stroke
// Pendekatan: Titik Temu Paling Ketat (The Strictest Limit) dari Buku Biru Edisi 5
// Fitur: Validasi Slider Lemak Dinamis (Protein Absolut Dikunci)
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCKD_Stroke = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        status_hemodialisa,
        volume_urine, // Sangat krusial untuk Natrium, Kalium, & Cairan
        // Parameter Baru untuk Slider (Protein dikunci, hanya Lemak yang dikontrol user)
        input_persen_lemak
    } = data;

    // 1. Dapatkan BBI dan IMT 
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan); 

    const isHD = status_hemodialisa && status_hemodialisa.toLowerCase() === 'ya';

    // =========================================================================
    // 2. KEBUTUHAN ENERGI TOTAL (TEE) - Mengikuti Standar CKD
    // Umur < 60 = 35 * BBI | Umur >= 60 = 30 * BBI
    // =========================================================================
    let kebutuhan_energi_total = 0;
    if (umur >= 60) {
        kebutuhan_energi_total = 30 * bbi;
    } else {
        kebutuhan_energi_total = 35 * bbi;
    }

    // Menyimpan nilai ke variabel energiBasal agar format JSON Frontend aman
    const energiBasal = kebutuhan_energi_total;

    // =========================================================================
    // 3. DISTRIBUSI MAKRONUTRIEN (Validasi Slider & Irisan Ketat CKD + Stroke)
    // =========================================================================
    
    // 3a. PROTEIN: Dikunci Mutlak
    // Stroke mengalah pada Ginjal (0.75 - 1 g/kg). Kita patok presisi di 0.8 g/kg.
    // Jika HD = 1.2 g/kg (Syarat mutlak mengganti asam amino yang terbuang).
    let protein_gram = 0;
    if (isHD) {
        protein_gram = 1.2 * bbi; 
    } else {
        protein_gram = 0.8 * bbi; 
    }
    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // 3b. LEMAK TOTAL: Default 25% (Irisan CKD 25-30% dan Stroke 25-35%)
    let lemak_persen = 25;

    // Validasi input slider lemak dari Frontend
    if (input_persen_lemak !== undefined) {
        const l = parseFloat(input_persen_lemak);
        
        // Pagar Aman Lemak (Rentang irisan paling aman adalah 25% - 30%)
        if (l < 15 || l > 35) {
            throw new Error(`Persentase Lemak CKD + Stroke harus antara 15% - 35%. Input ditolak: ${l}%`);
        }
        
        // Validasi Matematis Ekstra
        if ((protein_persen + l) >= 100) {
            throw new Error(`Total Protein mutlak (${protein_persen.toFixed(1)}%) dan Lemak (${l}%) melebih/sama dengan 100%.`);
        }

        lemak_persen = l;
    }

    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Rincian Lemak mengikuti aturan Stroke yang lebih ketat (< 7% Jenuh)
    // Dibuat proporsional berdasarkan persentase lemak yang diinput user
    const lemak_jenuh_persen = Math.floor(lemak_persen * (7/25));
    const kalori_lemak_jenuh = (lemak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_jenuh_gram = kalori_lemak_jenuh / 9;

    const lemak_pufa_persen = Math.floor(lemak_persen * (10/25));
    const kalori_lemak_pufa = (lemak_pufa_persen / 100) * kebutuhan_energi_total;
    const lemak_pufa_gram = kalori_lemak_pufa / 9;

    const lemak_mufa_persen = lemak_persen - lemak_jenuh_persen - lemak_pufa_persen; 
    const kalori_lemak_mufa = (lemak_mufa_persen / 100) * kebutuhan_energi_total;
    const lemak_mufa_gram = kalori_lemak_mufa / 9;

    // 3c. KARBOHIDRAT: Sisa energi total agar mutlak 100%
    const karbohidrat_persen = 100 - protein_persen - lemak_persen;
    if (karbohidrat_persen < 50 || karbohidrat_persen > 70) {
        throw new Error(`Kalkulasi ditolak: Sisa Karbohidrat mencapai ${karbohidrat_persen.toFixed(1)}%. Persentase Karbohidrat CKD + Stroke harus antara 50% - 70%.`);
    }
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    // =========================================================================
    // 4. MIKRONUTRIEN & CAIRAN (Penggabungan Batas Paling Ketat)
    // =========================================================================
    
    const kolesterol_mg = 200; // Batas Stroke
    const serat_gram = 25;     // Batas Stroke (25-30g)

    let natrium_mg = 0;
    let kalium_mg = 0;
    let kalsium_mg = 0;
    let fosfor_mg = 0;

    // Mengolah input volume urine untuk ginjal
    const volUrine = (volume_urine !== undefined && volume_urine !== null && volume_urine !== "") 
                        ? parseFloat(volume_urine) 
                        : null;

    if (isHD) {
        // --- ATURAN HEMODIALISA ---
        if (volUrine !== null) {
            if (volUrine === 0) {
                natrium_mg = 2000;
                kalium_mg = 2000;  
            } else {
                natrium_mg = 1000 + ((volUrine / 500) * 1000);
                kalium_mg = 2000 + ((volUrine / 1000) * 1000); 
            }
        } else {
            natrium_mg = 2000;
            kalium_mg = 40 * bbi; 
        }
        kalsium_mg = 1000;    
        fosfor_mg = 17 * bbi; 
    } else {
        // --- ATURAN PRE-DIALISIS ---
        natrium_mg = 2000;    
        kalium_mg = 39 * bbi; 
        kalsium_mg = 1200;    
        fosfor_mg = 800;      
    }

    // Cairan Dinamis Ginjal Menganulir Cairan Neurologis Stroke (Cegah Edema Paru)
    let kebutuhan_cairan = "Sesuai volume urine 24 jam + 500 ml";
    if (volUrine !== null) {
        const totalCairan = volUrine + 500;
        kebutuhan_cairan = `${totalCairan} ml`;
    }

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
                
                // Rincian Lemak & Mikro untuk UI Frontend
                lemak_jenuh_gr: parseFloat(lemak_jenuh_gram.toFixed(2)),
                lemak_pufa_gr: parseFloat(lemak_pufa_gram.toFixed(2)),
                lemak_mufa_gr: parseFloat(lemak_mufa_gram.toFixed(2)),
                natrium_mg: parseFloat(natrium_mg.toFixed(2)),
                kolesterol_mg: kolesterol_mg,
                kalium_mg: parseFloat(kalium_mg.toFixed(2)),
                kalsium_mg: parseFloat(kalsium_mg.toFixed(2)),
                fosfor_mg: parseFloat(fosfor_mg.toFixed(2)),
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
            natrium_mg: parseFloat(natrium_mg.toFixed(2)),
            kolesterol_mg: kolesterol_mg,
            kalium_mg: parseFloat(kalium_mg.toFixed(2)),
            kalsium_mg: parseFloat(kalsium_mg.toFixed(2)),
            fosfor_mg: parseFloat(fosfor_mg.toFixed(2)),
            serat_gram: serat_gram
        }
    };
};

module.exports = hitungCKD_Stroke;