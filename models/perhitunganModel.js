// ==========================================
// MODEL: perhitunganModel.js
// ==========================================

const db = require('../config/database');

const Perhitungan = {
    /**
     * Menyimpan data riwayat perhitungan gizi ke database (Snapshot Versi 1)
     */
    simpan: async (data) => {
        const queryInsert = `
            INSERT INTO perhitungan_gizi (
                no_rawat, id_user, umur_saat_dihitung, kelompok_umur, ruang_bangsal,
                berat_badan_saat_dihitung, tinggi_badan_saat_dihitung, berat_badan_ideal, imt_saat_dihitung, status_gizi_saat_dihitung,
                is_estimasi, lila_cm, ulna_cm, persen_lila,
                diagnosa_penyakit_saat_dihitung, aktivitas_fisik, status_hemodialisa,
                kategori_penambahan_energi, metode_perhitungan, faktor_stres, 
                bmr, faktor_aktivitas_nilai, faktor_stres_nilai, penambahan_kalori,
                kebutuhan_energi_total, protein_persen, lemak_persen, karbohidrat_persen, 
                protein_gram, lemak_gram, karbohidrat_gram, parent_id, versi
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.no_rawat, data.id_user, data.umur_saat_dihitung, data.kelompok_umur, data.ruang_bangsal,
            data.berat_badan_saat_dihitung, data.tinggi_badan_saat_dihitung, data.berat_badan_ideal, data.imt_saat_dihitung, data.status_gizi_saat_dihitung,
            data.is_estimasi, data.lila_cm, data.ulna_cm, data.persen_lila,
            data.diagnosa_penyakit_saat_dihitung, data.aktivitas_fisik, data.status_hemodialisa,
            data.kategori_penambahan_energi, data.metode_perhitungan, data.faktor_stres,
            data.bmr, data.faktor_aktivitas_nilai, data.faktor_stres_nilai, data.penambahan_kalori,
            data.kebutuhan_energi_total, data.protein_persen, data.lemak_persen, data.karbohidrat_persen, 
            data.protein_gram, data.lemak_gram, data.karbohidrat_gram,
            data.parent_id, data.versi
        ];

        const [result] = await db.execute(queryInsert, values);
        return result.insertId;
    }
};

module.exports = Perhitungan;