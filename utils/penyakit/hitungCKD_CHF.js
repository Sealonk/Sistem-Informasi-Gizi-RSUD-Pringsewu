// ==========================================
// UTILS/PENYAKIT: hitungCKD_CHF.js
// Komplikasi Ganda: Ginjal Kronik (CKD) + Gagal Jantung (CHF)
// Pendekatan: Titik Temu Paling Ketat (The Strictest Limit) dari Buku Biru Edisi 5
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCKD_CHF = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        status_hemodialisa,
        volume_urine // Sangat krusial untuk Natrium, Kalium & Cairan
    } = data;

    // 1. Dapatkan BBI dan IMT 
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan); 

    // Status boolean untuk mempermudah logika
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

    // Menyimpan nilai ke variabel energiBasal agar format JSON ke Frontend aman
    const energiBasal = kebutuhan_energi_total;

    // =========================================================================
    // 3. DISTRIBUSI MAKRONUTRIEN (Irisan Ketat CKD + CHF)
    // =========================================================================
    
    // PROTEIN: 
    // Jika Pre-HD = 0.8 g/kg (Irisan dari CKD 0.6-0.8 dan CHF 0.8-1.5)
    // Jika HD = 1.2 g/kg (Syarat mutlak hemodialisis)
    let protein_gram = 0;
    if (isHD) {
        protein_gram = 1.2 * bbi; 
    } else {
        protein_gram = 0.8 * bbi; 
    }
    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // LEMAK TOTAL: 25% (Irisan dari CKD 25-30% dan CHF 20-25%)
    const lemak_persen = 25;
    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // Rincian Lemak sesuai Buku Biru CHF
    const lemak_jenuh_persen = 10;
    const kalori_lemak_jenuh = (lemak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_jenuh_gram = kalori_lemak_jenuh / 9;

    const lemak_tidak_jenuh_persen = 15;
    const kalori_lemak_tidak_jenuh = (lemak_tidak_jenuh_persen / 100) * kebutuhan_energi_total;
    const lemak_tidak_jenuh_gram = kalori_lemak_tidak_jenuh / 9;

    // KARBOHIDRAT: Sisa energi total
    const kalori_karbohidrat = kebutuhan_energi_total - kalori_protein - kalori_lemak;
    const karbohidrat_gram = kalori_karbohidrat / 4;
    const karbohidrat_persen = (kalori_karbohidrat / kebutuhan_energi_total) * 100;

    // =========================================================================
    // 4. MIKRONUTRIEN & CAIRAN (Penggabungan Batas Paling Ketat)
    // =========================================================================
    
    // Natrium: Dibatasi maksimal 1500 mg (Menerapkan batas CHF yang lebih ketat dari CKD)
    const natrium_mg = 1500; 
    const kolesterol_mg = 200; // Batas CHF

    let kalium_mg = 0;
    let kalsium_mg = 0;
    let fosfor_mg = 0;

    // Mengolah input volume urine
    const volUrine = (volume_urine !== undefined && volume_urine !== null && volume_urine !== "") 
                        ? parseFloat(volume_urine) 
                        : null;

    if (isHD) {
        // --- ATURAN HEMODIALISA ---
        if (volUrine !== null) {
            if (volUrine === 0) {
                kalium_mg = 2000;  
            } else {
                kalium_mg = 2000 + ((volUrine / 1000) * 1000); 
            }
        } else {
            kalium_mg = 40 * bbi; 
        }
        kalsium_mg = 1000;    
        fosfor_mg = 17 * bbi; 
    } else {
        // --- ATURAN PRE-DIALISIS ---
        kalium_mg = 39 * bbi; 
        kalsium_mg = 1200;    
        fosfor_mg = 800;      
    }

    // Perhitungan Cairan Dinamis (Urine + 500 ml) untuk menjaga balance CHF & CKD
    let kebutuhan_cairan = "Sesuai balance cairan (volume urine 24 jam + 500 ml)";
    if (volUrine !== null) {
        const totalCairan = volUrine + 500;
        kebutuhan_cairan = `${totalCairan} ml`;
    }

    // 5. Return Format Data ke Controller
    return {
        berat_badan_ideal: parseFloat(bbi.toFixed(2)),

        // Nilai koreksi diset 0 karena menggunakan perhitungan kalori mutlak (tanpa koreksi Mifflin)
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
                lemak_tidak_jenuh_gr: parseFloat(lemak_tidak_jenuh_gram.toFixed(2)),
                natrium_mg: natrium_mg,
                kolesterol_mg: kolesterol_mg,
                kalium_mg: parseFloat(kalium_mg.toFixed(2)),
                kalsium_mg: parseFloat(kalsium_mg.toFixed(2)),
                fosfor_mg: parseFloat(fosfor_mg.toFixed(2)),
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
            lemak_tidak_jenuh_gram: parseFloat(lemak_tidak_jenuh_gram.toFixed(2)),
            natrium_mg: natrium_mg,
            kolesterol_mg: kolesterol_mg,
            kalium_mg: parseFloat(kalium_mg.toFixed(2)),
            kalsium_mg: parseFloat(kalsium_mg.toFixed(2)),
            fosfor_mg: parseFloat(fosfor_mg.toFixed(2))
        }
    };
};

module.exports = hitungCKD_CHF;