const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasienController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', authenticateToken, pasienController.getAllPasien);

router.get('/:id', authenticateToken, pasienController.getPasienById);

module.exports = router;