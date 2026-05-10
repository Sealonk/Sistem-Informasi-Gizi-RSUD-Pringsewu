const db = require('../config/database');

const Perhitungan = {
    /**
     * Menyimpan data riwayat perhitungan gizi ke database (Snapshot)
     * @param {Object} data - Objek berisi seluruh variabel yang akan di-insert
     * @returns {Promise<number>} - Mengembalikan ID perhitungan yang baru saja dibuat
     */
    simpan: async (data) => {
        const queryInsert = `
            INSERT INTO perhitungan_gizi (
                id_pasien, id_user, umur_saat_dihitung, kelompok_umur, berat_badan_saat_dihitung,
                tinggi_badan_saat_dihitung, imt_saat_dihitung, status_gizi_saat_dihitung,
                diagnosa_penyakit_saat_dihitung, aktivitas_fisik, status_hemodialisa,
                penambahan_kalori, faktor_stres, bmr, faktor_aktivitas_nilai, faktor_stres_nilai,
                kebutuhan_energi_total, protein_gram, lemak_gram, karbohidrat_gram
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.id_pasien, data.id_user, data.umur_saat_dihitung, data.kelompok_umur, data.berat_badan_saat_dihitung,
            data.tinggi_badan_saat_dihitung, data.imt_saat_dihitung, data.status_gizi_saat_dihitung,
            data.diagnosa_penyakit_saat_dihitung, data.aktivitas_fisik, data.status_hemodialisa,
            data.penambahan_kalori, data.faktor_stres, data.bmr, data.faktor_aktivitas_nilai, data.faktor_stres_nilai,
            data.kebutuhan_energi_total, data.protein_gram, data.lemak_gram, data.karbohidrat_gram
        ];

        const [result] = await db.execute(queryInsert, values);
        return result.insertId;
    },

    /**
     * Mengambil riwayat perhitungan gizi berdasarkan ID Pasien
     * (Berguna jika nanti di UI Anda ada tombol "Lihat Riwayat Pasien Ini")
     * @param {number} id_pasien 
     * @returns {Promise<Array>} - Daftar riwayat perhitungan
     */
    findByPasienId: async (id_pasien) => {
        const query = `
            SELECT * FROM perhitungan_gizi 
            WHERE id_pasien = ? 
            ORDER BY tanggal_perhitungan DESC
        `;
        const [rows] = await db.execute(query, [id_pasien]);
        return rows;
    },

    /**
     * Menghapus sebuah riwayat perhitungan secara spesifik
     * @param {number} id_perhitungan 
     * @returns {Promise<boolean>}
     */
    deleteById: async (id_perhitungan) => {
        const query = 'DELETE FROM perhitungan_gizi WHERE id_perhitungan = ?';
        const [result] = await db.execute(query, [id_perhitungan]);
        return result.affectedRows > 0;
    }
};

module.exports = Perhitungan;