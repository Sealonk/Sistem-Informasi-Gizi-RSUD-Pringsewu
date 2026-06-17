// ==========================================
// MODEL: riwayatModel.js
// ==========================================

const db = require('../config/database');

const Riwayat = {
    /**
     * Update data riwayat berdasarkan ID
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
     * Menarik informasi Ruangan/Bangsal]
     */
    findDetailById: async (id_perhitungan) => {
        const query = `
            SELECT 
                pg.*, 
                MAX(p.nm_pasien) AS nama_pasien, 
                MAX(p.no_rkm_medis) AS no_rm, 
                MAX(p.jk) AS jenis_kelamin, 
                MAX(b.nm_bangsal) AS ruangan, 
                GROUP_CONCAT(DISTINCT dp.kd_penyakit SEPARATOR ', ') AS kode_penyakit,
                COALESCE(MAX(ki.tgl_masuk), MAX(rp.tgl_registrasi)) AS tanggal_masuk
            FROM perhitungan_gizi pg
            INNER JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
            LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
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

    /**
     * Menghapus riwayat berdasarkan ID
     */
    deleteById: async (id_perhitungan) => {
        const query = 'DELETE FROM perhitungan_gizi WHERE id_perhitungan = ?';
        const [result] = await db.execute(query, [id_perhitungan]);
        return result.affectedRows > 0;
    }
};

module.exports = Riwayat;