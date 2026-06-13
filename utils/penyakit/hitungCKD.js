// ==========================================
// UTILS/PENYAKIT: hitungCKD.js (Ginjal Kronik Murni Tanpa DM)
// Berdasarkan: Penuntun Diet & Terapi Gizi Edisi 5 (PERSAGI)
// Fitur: Validasi Slider Lemak Dinamis (Protein Absolut Dikunci)
// ==========================================

const { hitungBeratBadanIdeal, hitungIMT } = require('../sharedRumus');

const hitungCKD = (data) => {
    const { 
        jenis_kelamin, 
        berat_badan, 
        tinggi_badan, 
        umur, 
        status_hemodialisa,
        volume_urine, // Sangat krusial untuk Natrium, Kalium & Cairan
        // Parameter Baru untuk Slider (Protein dikunci, hanya Lemak yang dikontrol user)
        input_persen_lemak
    } = data;

    // 1. Dapatkan BBI dan IMT 
    const bbi = hitungBeratBadanIdeal(jenis_kelamin, tinggi_badan);
    const dataIMT = hitungIMT(berat_badan, tinggi_badan); 

    // Status boolean untuk mempermudah logika
    const isHD = status_hemodialisa && status_hemodialisa.toLowerCase() === 'ya';

    // =========================================================================
    // 2. KEBUTUHAN ENERGI TOTAL (TEE) KHUSUS CKD (Buku Biru)
    // Sama untuk HD maupun Pre-HD: Umur < 60 = 35 * BBI | Umur >= 60 = 30 * BBI
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
    // 3. DISTRIBUSI MAKRONUTRIEN CKD (Dengan Validasi Slider Dinamis)
    // =========================================================================
    
    // 3a. PROTEIN: Dikunci Mutlak (Tidak ada slider untuk protein)
    let protein_gram = 0;
    if (isHD) {
        protein_gram = 1.2 * bbi; // HD: Protein Tinggi untuk mengganti asam amino yang hilang
    } else {
        protein_gram = 0.6 * bbi; // Pre-HD: Protein Rendah untuk melindungi ginjal
    }
    const kalori_protein = protein_gram * 4; 
    const protein_persen = (kalori_protein / kebutuhan_energi_total) * 100;

    // 3b. LEMAK: Default 25% (Aman untuk rentang HD 15-30% maupun Pre-HD 25-30%)
    let lemak_persen = 25;

    // Validasi input slider lemak dari Frontend
    if (input_persen_lemak !== undefined) {
        const l = parseFloat(input_persen_lemak);
        
        // Validasi Dinamis berdasarkan status Hemodialisa
        if (isHD) {
            // Pagar HD: 15% - 30%
            if (l < 15 || l > 30) {
                throw new Error(`Persentase Lemak pasien HD harus antara 15% - 30%. Input ditolak: ${l}%`);
            }
        } else {
            // Pagar Pre-HD: 25% - 30%
            if (l < 25 || l > 30) {
                throw new Error(`Persentase Lemak pasien Pre-Dialisis harus antara 25% - 30%. Input ditolak: ${l}%`);
            }
        }
        
        // Validasi Matematis Ekstra
        if ((protein_persen + l) >= 100) {
            throw new Error(`Total Protein mutlak (${protein_persen.toFixed(1)}%) dan Lemak (${l}%) melebih/sama dengan 100%. Tidak ada ruang untuk karbohidrat.`);
        }

        lemak_persen = l;
    }

    const kalori_lemak = (lemak_persen / 100) * kebutuhan_energi_total;
    const lemak_gram = kalori_lemak / 9;

    // 3c. KARBOHIDRAT: Sisa kalori agar total mutlak 100%
    const karbohidrat_persen = 100 - protein_persen - lemak_persen;
    const kalori_karbohidrat = (karbohidrat_persen / 100) * kebutuhan_energi_total;
    const karbohidrat_gram = kalori_karbohidrat / 4;

    // =========================================================================
    // 4. MIKRONUTRIEN & CAIRAN (Logika Ganda Sesuai Buku Biru)
    // =========================================================================
    let natrium_mg = 0;
    let kalium_mg = 0;
    let kalsium_mg = 0;
    let fosfor_mg = 0;

    // Mengolah input volume urine dari string ke angka murni
    const volUrine = (volume_urine !== undefined && volume_urine !== null && volume_urine !== "") 
                        ? parseFloat(volume_urine) 
                        : null;

    if (isHD) {
        // --- ATURAN HEMODIALISA ---
        if (volUrine !== null) {
            if (volUrine === 0) {
                // Pasien Anuria (Tidak ada urine)
                natrium_mg = 2000; 
                kalium_mg = 2000;  
            } else {
                // Natrium: 1 gram (1000mg) + 1 gram tiap 500ml urine
                natrium_mg = 1000 + ((volUrine / 500) * 1000); 
                // Kalium: 2 gram (2000mg) + 1 gram tiap 1000ml urine
                kalium_mg = 2000 + ((volUrine / 1000) * 1000); 
            }
        } else {
            // Alternatif/Fallback jika frontend tidak mengirimkan input volume urine
            natrium_mg = 2000;    // Default aman 
            kalium_mg = 40 * bbi; // Menggunakan alternatif "diperhitungkan 40 mg/kg BB"
        }
        
        kalsium_mg = 1000;    // 1000 mg
        fosfor_mg = 17 * bbi; // < 17 mg/kg BB
    } else {
        // --- ATURAN PRE-DIALISIS ---
        natrium_mg = 2000;    // < 2000 mg
        kalium_mg = 39 * bbi; // 39 mg/kg BBI
        kalsium_mg = 1200;    // 1200 mg
        fosfor_mg = 800;      // 800 - 1000 mg (Ambil batas bawah)
    }

    // Perhitungan Cairan Dinamis (Urine + 500 ml) untuk semua pasien ginjal
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
                
                natrium_mg: parseFloat(natrium_mg.toFixed(2)),
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
            natrium_mg: parseFloat(natrium_mg.toFixed(2)),
            kalium_mg: parseFloat(kalium_mg.toFixed(2)),
            kalsium_mg: parseFloat(kalsium_mg.toFixed(2)),
            fosfor_mg: parseFloat(fosfor_mg.toFixed(2))
        }
    };
};

module.exports = hitungCKD;