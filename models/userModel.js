// ==========================================
// MODEL: userModel.js
// ==========================================

const db = require('../config/database');

const User = {
    /**
     * Mendaftarkan user/petugas gizi baru ke database.
     */
    create: async (userData) => {
        const { nama_lengkap, username, password, role, email } = userData;
        const query = 'INSERT INTO users (nama_lengkap, username, password, role, email) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [nama_lengkap, username, password, role, email]);
        return result.insertId;
    },

    /**
     * Mengambil seluruh daftar pengguna.
     * Tidak menyertakan password demi keamanan data balikan API.
     */
    getAll: async () => {
        const query = 'SELECT id_user, nama_lengkap, username, role, email, created_at FROM users ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        return rows;
    },

    /**
     * Mencari data user berdasarkan username.
     */
    findByUsername: async (username) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.execute(query, [username]);
        return rows;
    },

    /**
     * Mencari data user berdasarkan ID.
     */
    findById: async (id_user) => {
        const query = 'SELECT * FROM users WHERE id_user = ?';
        const [rows] = await db.execute(query, [id_user]);
        return rows;
    },

    /**
     * Mencari data user berdasarkan alamat email.
     */
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows;
    },

    /**
     * Memperbarui password user dengan hash Bcrypt yang baru.
     */
    updatePassword: async (id_user, hashedPassword) => {
        const query = 'UPDATE users SET password = ? WHERE id_user = ?';
        const [result] = await db.execute(query, [hashedPassword, id_user]);
        return result.affectedRows > 0; 
    },

    /**
     * Menghapus data user berdasarkan ID.
     */
    deleteById: async (id_user) => {
        const query = 'DELETE FROM users WHERE id_user = ?';
        const [result] = await db.execute(query, [id_user]);
        return result.affectedRows > 0;
    }
};

module.exports = User;