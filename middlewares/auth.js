const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Akses Ditolak! Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: 'Akses Ditolak! Token tidak valid atau sudah kedaluwarsa.'
            });
        }
        req.user = decodedUser;

        next();
    });
};

module.exports = { authenticateToken };