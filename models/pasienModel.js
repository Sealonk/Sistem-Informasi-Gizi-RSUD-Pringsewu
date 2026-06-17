// ==========================================
// MODEL: pasienModel.js
// ==========================================

const db = require('../config/database');

const Pasien = {
    /**
     * Mengambil data dasar satu pasien spesifik berdasarkan No. Rawat (Kunjungan).
     * @param {string} no_rawat 
     * @returns {Promise<Object>} Data pasien
     */
    findById: async (no_rawat) => {
        const query = `
            SELECT 
                rp.no_rawat, 
                p.no_rkm_medis, 
                p.nm_pasien, 
                p.jk, 
                rp.umurdaftar, 
                rp.sttsumur, 
                rp.tgl_registrasi,
                b.nm_bangsal AS ruangan,
                ki.tgl_keluar
            FROM reg_periksa rp
            INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
            LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
            WHERE rp.no_rawat = ?
        `;
        const [[row]] = await db.execute(query, [no_rawat]);
        return row;
    },

    checkExists: async (no_rawat) => {
        const query = 'SELECT no_rawat FROM reg_periksa WHERE no_rawat = ?';
        const [rows] = await db.execute(query, [no_rawat]);
        return rows.length > 0;
    },

    /**
     * FUNGSI: Mengambil seluruh daftar bangsal (ruangan) yang ada di Rumah Sakit
     * Berguna untuk mengisi dropdown filter di Frontend.
     * @returns {Promise<Array>}
     */
    getAllBangsal: async () => {
        const query = 'SELECT kd_bangsal, nm_bangsal FROM bangsal ORDER BY nm_bangsal ASC';
        const [rows] = await db.execute(query);
        return rows;
    }
};

module.exports = Pasien;