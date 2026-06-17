// ==========================================
// MODEL: pasienModel.js
// ==========================================

const db = require('../config/database');

const Pasien = {
    /**
     * Mengambil data dasar satu pasien spesifik berdasarkan No. Rawat (Kunjungan).
     * Berguna jika Anda butuh menarik identitas dasar pasien dengan cepat di controller lain.
     * @param {string} no_rawat 
     * @returns {Promise<Object>} Data pasien
     */
    findById: async (no_rawat) => {
        // Karena database sudah dinormalisasi SIMRS, kita melakukan JOIN antara
        // reg_periksa (yang menyimpan no_rawat) dan pasien (yang menyimpan identitas mutlak)
        const query = `
            SELECT 
                rp.no_rawat, 
                p.no_rkm_medis, 
                p.nm_pasien, 
                p.jk, 
                rp.umurdaftar, 
                rp.sttsumur, 
                rp.tgl_registrasi
            FROM reg_periksa rp
            INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            WHERE rp.no_rawat = ?
        `;
        const [[row]] = await db.execute(query, [no_rawat]);
        return row;
    },

    /**
     * Mengecek apakah sebuah no_rawat (kunjungan) valid dan ada di database.
     * Sangat berguna untuk middleware validasi sebelum menyimpan riwayat perhitungan gizi
     * agar data tidak "yatim/piatu" (orphaned).
     * @param {string} no_rawat
     * @returns {Promise<boolean>}
     */
    checkExists: async (no_rawat) => {
        // Di struktur SIMRS, no_rawat adalah Primary Key milik tabel reg_periksa
        const query = 'SELECT no_rawat FROM reg_periksa WHERE no_rawat = ?';
        const [rows] = await db.execute(query, [no_rawat]);
        return rows.length > 0;
    }
};

module.exports = Pasien;