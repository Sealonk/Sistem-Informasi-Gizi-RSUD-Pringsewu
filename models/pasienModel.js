const db = require('../config/database');

const Pasien = {
    /**
     * Mengambil statistik ringkasan pasien
     * @returns {Promise<Object>} Mengembalikan objek berisi jumlah total, L/P, dan hari ini
     */
    getStats: async () => {
        const query = `
            SELECT 
                COUNT(*) AS total_pasien,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_perempuan,
                SUM(CASE WHEN DATE(tanggal_masuk) = CURDATE() THEN 1 ELSE 0 END) AS pasien_hari_ini
            FROM pasien
        `;
        const [[rows]] = await db.execute(query);
        return rows;
    },

    /**
     * Mengambil daftar pasien dengan batas halaman (Pagination)
     * @param {number} limit - Jumlah data per halaman
     * @param {number} offset - Titik mulai data
     * @returns {Promise<Array>} Array of pasien
     */
    findAllWithPagination: async (limit, offset) => {
        const query = `
            SELECT 
                p.id_pasien, p.nama_pasien, p.umur, p.jenis_kelamin, p.status_gizi,
                GROUP_CONCAT(mp.nama_penyakit SEPARATOR ', ') AS diagnosis
            FROM pasien p
            LEFT JOIN pasien_diagnosa pd ON p.id_pasien = pd.id_pasien
            LEFT JOIN master_penyakit mp ON pd.id_penyakit = mp.id_penyakit
            GROUP BY p.id_pasien
            ORDER BY p.id_pasien DESC
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(query, [limit, offset]);
        return rows;
    },

    /**
     * Mengambil data satu pasien spesifik
     * @param {number} id_pasien 
     * @returns {Promise<Object>} Data pasien
     */
    findById: async (id_pasien) => {
        const query = 'SELECT * FROM pasien WHERE id_pasien = ?';
        const [[row]] = await db.execute(query, [id_pasien]);
        return row;
    },

    /**
     * Mengecek apakah seorang pasien masih ada di database
     * Sangat berguna untuk validasi sebelum melakukan perhitungan gizi
     */
    checkExists: async (id_pasien) => {
        const query = 'SELECT id_pasien FROM pasien WHERE id_pasien = ?';
        const [rows] = await db.execute(query, [id_pasien]);
        return rows.length > 0;
    }
};

module.exports = Pasien;