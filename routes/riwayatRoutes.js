// ==========================================
// ROUTES: riwayatRoutes.js
// ==========================================

const express = require('express');
const router = express.Router();

// Pastikan mengimpor controller yang baru saja kita buat
const riwayatController = require('../controllers/riwayatController');
const { authenticateToken } = require('../middlewares/auth');

// Route untuk mengambil daftar riwayat (dilengkapi pagination & filter)
router.get('/', authenticateToken, riwayatController.getRiwayat);

// Route untuk mengambil detail riwayat spesifik berdasarkan ID perhitungan
router.get('/:id', authenticateToken, riwayatController.getRiwayatDetail);

// Route untuk memperbarui/mengedit riwayat perhitungan
router.put('/:id', authenticateToken, riwayatController.updateRiwayat);

// Route untuk menghapus riwayat
router.delete('/:id', authenticateToken, riwayatController.deleteRiwayat);

module.exports = router;