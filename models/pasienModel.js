// ==========================================
// MODEL: pasienModel.js
// ==========================================

const db = require('../config/database');

const Pasien = {
    /**
     * Mengambil data satu pasien spesifik berdasarkan No. Rawat
     * @param {string} no_rawat 
     * @returns {Promise<Object>} Data pasien
     */
    findById: async (no_rawat) => {
        const query = 'SELECT * FROM pasien WHERE no_rawat = ?';
        const [[row]] = await db.execute(query, [no_rawat]);
        return row;
    },

    /**
     * Mengecek apakah sebuah no_rawat (kunjungan) valid dan ada di database.
     * Sangat berguna jika di masa depan Anda ingin menambah middleware 
     * validasi sebelum menyimpan riwayat perhitungan gizi.
     * @param {string} no_rawat
     * @returns {Promise<boolean>}
     */
    checkExists: async (no_rawat) => {
        const query = 'SELECT no_rawat FROM pasien WHERE no_rawat = ?';
        const [rows] = await db.execute(query, [no_rawat]);
        return rows.length > 0;
    }
};

module.exports = Pasien;