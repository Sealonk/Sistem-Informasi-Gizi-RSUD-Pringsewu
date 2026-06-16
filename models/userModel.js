// ==========================================
// MODEL: userModel.js
// ==========================================

const db = require('../config/database');

const User = {
    /**
     * Mendaftarkan user/petugas gizi baru ke database.
     * @param {Object} userData - Objek berisi data lengkap user
     * @returns {Promise<number>} - Mengembalikan ID dari user yang baru dibuat
     */
    create: async (userData) => {
        const { nama_lengkap, username, password, role, email } = userData;
        const query = 'INSERT INTO users (nama_lengkap, username, password, role, email) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [nama_lengkap, username, password, role, email]);
        return result.insertId;
    },

    /**
     * Mencari data user berdasarkan username.
     * Sangat berguna untuk proses Autentikasi (Login).
     * @param {string} username - Username yang diinput oleh pengguna di halaman login
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
     * @param {number} id_user - ID user dari database
     * @returns {Promise<Array>} - Mengembalikan array berisi data user
     */
    findById: async (id_user) => {
        const query = 'SELECT * FROM users WHERE id_user = ?';
        const [rows] = await db.execute(query, [id_user]);
        return rows;
    },

    /**
     * Mencari data user berdasarkan alamat email.
     * Digunakan pada fitur permohonan Lupa Password Admin.
     * @param {string} email - Email yang diinput
     * @returns {Promise<Array>}
     */
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows;
    },

    /**
     * Memperbarui password user dengan hash Bcrypt yang baru.
     * Digunakan pada fitur eksekusi Reset Password.
     * @param {number} id_user - ID user yang akan diubah passwordnya
     * @param {string} hashedPassword - Password baru yang sudah dienkripsi Bcrypt
     * @returns {Promise<boolean>} - Mengembalikan true jika berhasil mengubah data
     */
    updatePassword: async (id_user, hashedPassword) => {
        const query = 'UPDATE users SET password = ? WHERE id_user = ?';
        const [result] = await db.execute(query, [hashedPassword, id_user]);
        // result.affectedRows akan bernilai > 0 jika ada baris yang berhasil diubah
        return result.affectedRows > 0; 
    }
    
};

module.exports = User;