// ==========================================
// ROUTES: riwayatRoutes.js
// ==========================================

const express = require('express');
const router = express.Router();

const riwayatController = require('../controllers/riwayatController');
const { authenticateToken, isPetugasOrAdmin } = require('../middlewares/auth');

// ==========================================
// AKSES PUBLIK INTERNAL (Admin, Petugas, Manajemen)
// ==========================================
// Route untuk mengambil daftar riwayat utama
router.get('/', authenticateToken, riwayatController.getRiwayat);

// Route untuk mengambil DAFTAR VERSI dari sebuah grup perhitungan
router.get('/:id', authenticateToken, riwayatController.getRiwayatVersions);

// Route untuk mengambil DETAIL SPESIFIK dari satu versi riwayat
router.get('/detail/:id', authenticateToken, riwayatController.getRiwayatDetail);

// ==========================================
// AKSES TERBATAS (Hanya Admin & Petugas)
// ==========================================
// Route untuk memperbarui riwayat (Blokir Manajemen)
router.put('/:id', authenticateToken, isPetugasOrAdmin, riwayatController.updateRiwayat);

// Route untuk menghapus riwayat (Blokir Manajemen)
router.delete('/:id', authenticateToken, isPetugasOrAdmin, riwayatController.deleteRiwayat);

module.exports = router;