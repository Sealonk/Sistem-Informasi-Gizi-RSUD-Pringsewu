// ==========================================
// MIDDLEWARE: auth.js
// ==========================================

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Akses Ditolak! Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            let pesanError = 'Akses Ditolak! Token tidak valid.';
            
            if (err.name === 'TokenExpiredError') {
                pesanError = 'Sesi Anda telah berakhir. Silakan login kembali.';
            } else if (err.name === 'JsonWebTokenError') {
                pesanError = 'Akses Ditolak! Token dimanipulasi atau tidak sah.';
            }

            return res.status(403).json({
                status: 'error',
                message: pesanError
            });
        }
        
        req.user = decodedUser;
        next();
    });
};

// Proteksi Khusus untuk Memblokir Akses Read-Only Manajemen (Untuk fungsi Simpan/Edit/Hapus)
const isPetugasOrAdmin = (req, res, next) => {
    if (!req.user || req.user.role === 'manajemen') {
        return res.status(403).json({
            status: 'error',
            message: 'Akses Ditolak! Akun Manajemen hanya memiliki hak akses Lihat Data (Read-Only).'
        });
    }
    next();
};

// Proteksi Khusus Role Admin (Manajemen User)
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Akses Ditolak! Menu ini hanya boleh diakses oleh Administrator Utama.'
        });
    }
    next();
};

module.exports = { authenticateToken, isPetugasOrAdmin, isAdmin };