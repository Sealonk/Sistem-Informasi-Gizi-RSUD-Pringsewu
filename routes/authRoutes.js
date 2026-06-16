const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rute Publik Utama
router.post('/login', authController.login);

// Rute Pemulihan Password (Hanya akan memproses email bertipe role: admin)
router.post('/forgot-password-admin', authController.forgotPasswordAdmin);
router.post('/reset-password-admin', authController.resetPasswordAdmin);

module.exports = router;