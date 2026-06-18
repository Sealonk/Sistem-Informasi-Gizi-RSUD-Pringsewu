// ==========================================
// ROUTES: userRoutes.js
// ==========================================

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middlewares/auth');

// Semua rute di bawah ini dilindungi secara mutlak: Wajib Login & Wajib Admin
router.post('/tambah', authenticateToken, isAdmin, userController.tambahUser);
router.post('/reset-password-petugas', authenticateToken, isAdmin, userController.resetPasswordUserLain);
router.get('/', authenticateToken, isAdmin, userController.getAllUsers);
router.delete('/:id', authenticateToken, isAdmin, userController.hapusUser);

module.exports = router;