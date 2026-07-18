// ==========================================
// MODEL: userModel.js
// ==========================================

const db = require('../config/database');

const User = {
    create: async (userData) => {
        const { nama_lengkap, username, password, role, email } = userData;
        const query = 'INSERT INTO users (nama_lengkap, username, password, role, email) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [nama_lengkap, username, password, role, email]);
        return result.insertId;
    },

    getAll: async () => {
        const query = 'SELECT id_user, nama_lengkap, username, role, email, created_at FROM users WHERE is_active = 1 ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        return rows;
    },

    findByUsername: async (username) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.execute(query, [username]);
        return rows;
    },

    findById: async (id_user) => {
        const query = 'SELECT * FROM users WHERE id_user = ?';
        const [rows] = await db.execute(query, [id_user]);
        return rows;
    },

    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows;
    },

    updatePassword: async (id_user, hashedPassword) => {
        const query = 'UPDATE users SET password = ? WHERE id_user = ?';
        const [result] = await db.execute(query, [hashedPassword, id_user]);
        return result.affectedRows > 0; 
    },

    deleteById: async (id_user) => {
        const query = 'UPDATE users SET is_active = 0 WHERE id_user = ?';
        const [result] = await db.execute(query, [id_user]);
        return result.affectedRows > 0;
    }
};

module.exports = User;