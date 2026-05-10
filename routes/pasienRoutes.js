const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasienController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', authenticateToken, pasienController.getAllPasien);

router.get('/:id', authenticateToken, pasienController.getPasienById);

router.post('/', authenticateToken, pasienController.createPasien);

router.put('/:id', authenticateToken, pasienController.updatePasien);

router.delete('/:id', authenticateToken, pasienController.deletePasien);

module.exports = router;