// ==========================================
// MODEL: perhitunganModel.js
// ==========================================

const db = require('../config/database');

const Perhitungan = {
    /**
     * Menyimpan data riwayat perhitungan gizi ke database (Snapshot)
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
                protein_gram, lemak_gram, karbohidrat_gram
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.no_rawat, data.id_user, data.umur_saat_dihitung, data.kelompok_umur, data.ruang_bangsal,
            data.berat_badan_saat_dihitung, data.tinggi_badan_saat_dihitung, data.berat_badan_ideal, data.imt_saat_dihitung, data.status_gizi_saat_dihitung,
            data.is_estimasi, data.lila_cm, data.ulna_cm, data.persen_lila,
            data.diagnosa_penyakit_saat_dihitung, data.aktivitas_fisik, data.status_hemodialisa,
            data.kategori_penambahan_energi, data.metode_perhitungan, data.faktor_stres,
            data.bmr, data.faktor_aktivitas_nilai, data.faktor_stres_nilai, data.penambahan_kalori,
            data.kebutuhan_energi_total, data.protein_persen, data.lemak_persen, data.karbohidrat_persen, 
            data.protein_gram, data.lemak_gram, data.karbohidrat_gram
        ];

        const [result] = await db.execute(queryInsert, values);
        return result.insertId;
    },

    /**
     * Update data riwayat berdasarkan ID
     * @param {number} id - ID perhitungan
     * @param {Object} data - Objek data yang ingin diupdate
     */
    updateById: async (id, data) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const sql = `UPDATE perhitungan_gizi SET ${setClause} WHERE id_perhitungan = ?`;
        const queryValues = [...values, id];

        const [result] = await db.execute(sql, queryValues);
        return result.affectedRows > 0;
    },

    /**
     * Mengambil semua riwayat perhitungan dengan fitur Filter
     * [Menggunakan struktur tabel SIMRS]
     */
    findAllRiwayat: async (filters) => {
        let query = `
            SELECT 
                pg.*, 
                MAX(p.nm_pasien) AS nama_pasien, 
                MAX(p.no_rkm_medis) AS no_rm 
            FROM perhitungan_gizi pg
            INNER JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            WHERE 1=1
        `;
        const values = [];

        if (filters.search) {
            query += ` AND p.nm_pasien LIKE ?`;
            values.push(`%${filters.search}%`);
        }
        
        if (filters.penyakit && filters.penyakit !== 'Semua Penyakit') {
            query += ` AND pg.diagnosa_penyakit_saat_dihitung LIKE ?`;
            values.push(`%${filters.penyakit}%`);
        }
        
        if (filters.tanggal) {
            query += ` AND DATE(pg.tanggal_perhitungan) = ?`;
            values.push(filters.tanggal);
        }

        query += ` GROUP BY pg.id_perhitungan ORDER BY pg.tanggal_perhitungan DESC`;

        const [rows] = await db.execute(query, values);
        return rows;
    },

    /**
     * Mengambil detail satu riwayat spesifik
     * [JOIN lengkap SIMRS untuk menarik penyakit dan tgl_masuk aktual]
     */
    findDetailById: async (id_perhitungan) => {
        const query = `
            SELECT 
                pg.*, 
                MAX(p.nm_pasien) AS nama_pasien, 
                MAX(p.no_rkm_medis) AS no_rm, 
                MAX(p.jk) AS jenis_kelamin, 
                GROUP_CONCAT(DISTINCT dp.kd_penyakit SEPARATOR ', ') AS kode_penyakit,
                COALESCE(MAX(ki.tgl_masuk), MAX(rp.tgl_registrasi)) AS tanggal_masuk
            FROM perhitungan_gizi pg
            INNER JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
            WHERE pg.id_perhitungan = ?
            GROUP BY pg.id_perhitungan
        `;
        const [rows] = await db.execute(query, [id_perhitungan]);
        return rows[0]; 
    },

    /**
     * Mencari seluruh riwayat perhitungan yang pernah dilakukan pada satu nomor kunjungan
     */
    findByPasienId: async (no_rawat) => {
        const query = `
            SELECT * FROM perhitungan_gizi 
            WHERE no_rawat = ? 
            ORDER BY tanggal_perhitungan DESC
        `;
        const [rows] = await db.execute(query, [no_rawat]);
        return rows;
    },

    deleteById: async (id_perhitungan) => {
        const query = 'DELETE FROM perhitungan_gizi WHERE id_perhitungan = ?';
        const [result] = await db.execute(query, [id_perhitungan]);
        return result.affectedRows > 0;
    }
};

module.exports = Perhitungan;