const express = require('express');
const router = express.Router();
const perhitunganController = require('../controllers/perhitunganController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/preview', authenticateToken, perhitunganController.previewPerhitungan);

router.post('/simpan', authenticateToken, perhitunganController.simpanPerhitungan);

module.exports = router;