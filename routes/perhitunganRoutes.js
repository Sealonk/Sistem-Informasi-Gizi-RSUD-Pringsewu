// ==========================================
// ROUTES: perhitunganRoutes.js
// ==========================================

const express = require('express');
const router = express.Router();
const perhitunganController = require('../controllers/perhitunganController');
const { authenticateToken } = require('../middlewares/auth');

// Route untuk preview perhitungan gizi
router.post('/preview', authenticateToken, perhitunganController.previewPerhitungan);

// Route untuk menyimpan riwayat perhitungan gizi ke database
router.post('/simpan', authenticateToken, perhitunganController.simpanPerhitungan);

module.exports = router;