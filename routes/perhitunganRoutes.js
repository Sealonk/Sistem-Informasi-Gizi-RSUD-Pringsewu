// ==========================================
// ROUTES: perhitunganRoutes.js
// ==========================================

const express = require('express');
const router = express.Router();
const perhitunganController = require('../controllers/perhitunganController');
const { authenticateToken, isPetugasOrAdmin } = require('../middlewares/auth');

// Route untuk preview perhitungan gizi (Blokir Manajemen)
router.post('/preview', authenticateToken, isPetugasOrAdmin, perhitunganController.previewPerhitungan);

// Route untuk menyimpan riwayat perhitungan gizi ke database (Blokir Manajemen)
router.post('/simpan', authenticateToken, isPetugasOrAdmin, perhitunganController.simpanPerhitungan);

module.exports = router;