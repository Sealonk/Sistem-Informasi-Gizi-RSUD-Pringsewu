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

        // 1. Validasi Input Wajib
        if (!nama_lengkap || !username || !password || !role || !email) {
            return res.status(400).json({ status: 'error', message: 'Semua data wajib diisi!' });
        }

        // 2. Cek apakah username sudah digunakan
        const userSama = await User.findByUsername(username);
        if (userSama.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Username sudah digunakan oleh petugas lain.' });
        }

        // 3. Cek apakah email sudah digunakan
        const emailSama = await User.findByEmail(email);
        if (emailSama.length > 0) {
            return res.status(400).json({ status: 'error', message: 'Email sudah terdaftar di sistem.' });
        }

        // 4. Hash password baru dengan Bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. Simpan ke database via Model
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

        // 1. Cek apakah user target benar-benar ada di database
        const userTarget = await User.findById(id_user_target);
        if (userTarget.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User target tidak ditemukan di database.' });
        }

        // Preventif: Mencegah admin mereset sesama admin lain jika tidak diinginkan (opsional)
        // if (userTarget[0].role === 'admin') { ... }

        // 2. Hash password baru target
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password_baru, saltRounds);

        // 3. Eksekusi update via Model
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

module.exports = { tambahUser, resetPasswordUserLain };