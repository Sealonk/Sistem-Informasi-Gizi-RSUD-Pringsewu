const db = require('../config/database');

const User = {
    /**
     * Mencari data user berdasarkan username.
     * Sangat berguna untuk proses Autentikasi (Login).
     * * @param {string} username - Username yang diinput oleh pengguna di halaman login
     * @returns {Promise<Array>} - Mengembalikan array berisi data user jika ditemukan
     */
    findByUsername: async (username) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.execute(query, [username]);
        return rows;
    },

    /**
     * Mencari data user berdasarkan ID.
     * Berguna jika di masa depan Anda ingin membuat fitur "Profil User".
     * * @param {number} id_user - ID user dari database
     * @returns {Promise<Array>} - Mengembalikan array berisi data user
     */
    findById: async (id_user) => {
        const query = 'SELECT * FROM users WHERE id_user = ?';
        const [rows] = await db.execute(query, [id_user]);
        return rows;
    }
};

module.exports = User;