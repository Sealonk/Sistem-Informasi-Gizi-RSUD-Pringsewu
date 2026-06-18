// ==========================================
// CONTROLLER: userController.js
// ==========================================

const User = require('../models/userModel');
const bcrypt = require('bcrypt');

/**
 * Fungsi Admin untuk mendaftarkan Petugas Gizi baru
 */
const tambahUser = async (req, res, next) => {
    try {
        const { nama_lengkap, username, password, role, email } = req.body;

        if (!nama_lengkap || !username || !password || !role || !email) {
            return res.status(400).json({ status: 'error', message: 'Semua data wajib diisi!' });
        }

        const userSama = await User.findByUsername(username);
        if (userSama.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Username sudah digunakan oleh petugas lain.' });
        }

        const emailSama = await User.findByEmail(email);
        if (emailSama.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar di sistem.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertId = await User.create({
            nama_lengkap,
            username,
            password: hashedPassword,
            role,
            email
        });

        res.status(201).json({
            status: 'success',
            message: `User baru dengan nama ${nama_lengkap} berhasil didaftarkan aktif!`,
            data: { id_user: insertId }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Fungsi Admin untuk melakukan OVERRIDE / RESET password petugas lain yang lupa sandi
 */
const resetPasswordUserLain = async (req, res, next) => {
    try {
        const { id_user_target, password_baru } = req.body;

        if (!id_user_target || !password_baru) {
            return res.status(400).json({ status: 'error', message: 'ID User Target dan Password Baru wajib diisi!' });
        }

        const userTarget = await User.findById(id_user_target);
        if (userTarget.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User target tidak ditemukan di database.' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password_baru, saltRounds);

        const isUpdated = await User.updatePassword(id_user_target, hashedPassword);

        if (!isUpdated) {
            return res.status(400).json({ status: 'error', message: 'Gagal mereset password atau tidak ada perubahan data.' });
        }

        res.status(200).json({
            status: 'success',
            message: `Password untuk user ${userTarget[0].nama_lengkap} berhasil di-reset oleh Admin!`
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Menampilkan daftar semua pengguna
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.getAll();
        
        res.status(200).json({
            status: 'success',
            message: 'Data pengguna berhasil diambil',
            data: users
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Menghapus pengguna secara permanen
 */
const hapusUser = async (req, res, next) => {
    try {
        const { id } = req.params; // id_user yang ingin dihapus (dikirim lewat URL)
        const id_admin_login = req.user.id_user; // Didapat dari token JWT

        // Safegaurd: Mencegah admin menghapus dirinya sendiri
        if (parseInt(id) === parseInt(id_admin_login)) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Tindakan Ditolak! Anda tidak dapat menghapus akun Anda sendiri saat sedang login.' 
            });
        }

        // Cek apakah user target ada
        const userTarget = await User.findById(id);
        if (userTarget.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Data pengguna tidak ditemukan.' });
        }

        const isDeleted = await User.deleteById(id);

        if (!isDeleted) {
            return res.status(400).json({ status: 'error', message: 'Gagal menghapus pengguna dari database.' });
        }

        res.status(200).json({
            status: 'success',
            message: `Akun atas nama ${userTarget[0].nama_lengkap} berhasil dihapus permanen.`
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { 
    tambahUser, 
    resetPasswordUserLain, 
    getAllUsers, 
    hapusUser 
};