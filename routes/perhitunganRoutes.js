// ==========================================
// ROUTES: perhitunganRoutes.js
// ==========================================

const express = require('express');
const router = express.Router();
const perhitunganController = require('../controllers/perhitunganController');
const { authenticateToken } = require('../middlewares/auth');

// Route untuk preview perhitungan gizi
router.post('/preview', authenticateToken, perhitunganController.previewPerhitungan);

// Route untuk menyimpan riwayat perhitungan gizi
router.post('/simpan', authenticateToken, perhitunganController.simpanPerhitungan);

// Route untuk mengambil daftar riwayat
router.get('/riwayat', authenticateToken, perhitunganController.getRiwayat);

// Route untuk mengambil detail riwayat spesifik
router.get('/riwayat/:id', authenticateToken, perhitunganController.getRiwayatDetail);

// Route untuk memperbarui riwayat perhitungan
router.put('/riwayat/:id', authenticateToken, perhitunganController.updateRiwayat);

// Route untuk menghapus riwayat
router.delete('/riwayat/:id', authenticateToken, perhitunganController.deleteRiwayat);

module.exports = router;