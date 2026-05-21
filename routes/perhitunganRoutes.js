const express = require('express');
const router = express.Router();
const perhitunganController = require('../controllers/perhitunganController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/preview', authenticateToken, perhitunganController.previewPerhitungan);

router.post('/simpan', authenticateToken, perhitunganController.simpanPerhitungan);

router.get('/riwayat', authenticateToken, perhitunganController.getRiwayat);

router.get('/riwayat/:id', authenticateToken, perhitunganController.getRiwayatDetail);

router.delete('/riwayat/:id', authenticateToken, perhitunganController.deleteRiwayat);

module.exports = router;