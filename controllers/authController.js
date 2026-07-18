// ==========================================
// CONTROLLER: authController.js
// ==========================================

const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Konfigurasi kurir email (Nodemailer) menggunakan SMTP Gmail/Layanan Lain
// Pastikan kredensial di bawah ini disesuaikan di file .env Anda
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_NODE, // Contoh: rsudpringsewu@gmail.com
        pass: process.env.EMAIL_PASS  // Contoh: app password dari Google Security
    }
});

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username dan Password wajib diisi!'
            });
        }

const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Username atau Password salah!'
            });
        }

        const user = users[0];

        if (user.is_active === 0) {
            return res.status(403).json({
                status: 'error',
                message: 'Akses Ditolak! Akun ini telah dihapus oleh Administrator dan tidak dapat digunakan lagi.'
            });
        }

        // Validasi password murni menggunakan Bcrypt compare
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Username atau Password salah!'
            });
        }

        // Masukkan id_user, nama_lengkap, dan ROLE ke dalam payload token
        const payload = {
            id_user: user.id_user,
            username: user.username,
            nama_lengkap: user.nama_lengkap,
            role: user.role 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(200).json({
            status: 'success',
            message: 'Login berhasil!',
            data: {
                token: token,
                user: {
                    id_user: user.id_user,
                    nama_lengkap: user.nama_lengkap,
                    username: user.username,
                    role: user.role
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// =========================================================================
// Lupa Password Admin
// =========================================================================
const forgotPasswordAdmin = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ status: 'error', message: 'Email wajib diisi!' });
        }

        // Cek pengguna berdasarkan email
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Alamat email tidak terdaftar di sistem.' });
        }

        const user = users[0];

        // ========================================================
        // BLOKIR JIKA AKUN ADMIN TERSEBUT SUDAH DIHAPUS
        // ========================================================
        if (user.is_active === 0) {
            return res.status(403).json({
                status: 'error',
                message: 'Akses Ditolak! Akun Administrator ini telah dinonaktifkan/dihapus.'
            });
        }

        // PROSES BLOKIR: Jika permohonan bukan datang dari role admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Akses Ditolak! Fitur pemulihan kata sandi mandiri via email ini eksklusif hanya untuk Administrator.'
            });
        }

        // Buat token khusus reset password dengan masa aktif pendek (15 Menit)
        const resetToken = jwt.sign(
            { id_user: user.id_user, hak_akses: 'reset_password_request' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Alamat tautan frontend yang nantinya digunakan admin untuk input password baru
        const urlReset = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Desain Surat Email Elektronik
        const opsiEmail = {
            from: `"Sistem Gizi RSUD Pringsewu" <${process.env.EMAIL_NODE}>`,
            to: user.email,
            subject: 'Permintaan Reset Kata Sandi Administrator',
            html: `
                <h3>Halo, ${user.nama_lengkap}</h3>
                <p>Kami menerima permintaan pemulihan kata sandi untuk akun Administrator Anda.</p>
                <p>Silakan klik tautan di bawah ini untuk mengatur ulang kata sandi Anda. Tautan ini hanya berlaku selama 15 menit:</p>
                <a href="${urlReset}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">Atur Ulang Kata Sandi</a>
                <p>Jika tautan di atas tidak berfungsi, salin dan tempel URL berikut ke browser Anda:</p>
                <p>${urlReset}</p>
                <br>
                <p>Jika Anda tidak merasa melakukan permohonan ini, abaikan email ini dengan aman.</p>
            `
        };

        await transporter.sendMail(opsiEmail);

        res.status(200).json({
            status: 'success',
            message: 'Tautan pemulihan kata sandi berhasil dikirim ke email Administrator.'
        });

    } catch (error) {
        next(error);
    }
};

// =========================================================================
// Eksekusi Reset Password Baru
// =========================================================================
const resetPasswordAdmin = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ status: 'error', message: 'Token dan Password Baru wajib dilampirkan!' });
        }

        // Verifikasi token reset password
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err || decoded.hak_akses !== 'reset_password_request') {
                return res.status(403).json({
                    status: 'error',
                    message: 'Tautan pemulihan tidak sah, rusak, atau telah kedaluwarsa. Silakan ajukan ulang.'
                });
            }

            // Enkripsi kata sandi baru menggunakan Bcrypt
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Update ke database
            const queryUpdate = 'UPDATE users SET password = ? WHERE id_user = ?';
            await db.execute(queryUpdate, [hashedPassword, decoded.id_user]);

            res.status(200).json({
                status: 'success',
                message: 'Kata sandi Administrator berhasil diubah! Silakan login menggunakan password baru Anda.'
            });
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { login, forgotPasswordAdmin, resetPasswordAdmin };