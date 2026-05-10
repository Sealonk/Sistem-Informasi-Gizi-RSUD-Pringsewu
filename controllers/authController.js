const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Username dan Password wajib diisi!'
            });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Username atau Password salah!'
            });
        }

        const user = users[0];

        
        let isPasswordValid = false;
        
        if (user.password === password) {
            isPasswordValid = true;
        } else {
            isPasswordValid = await bcrypt.compare(password, user.password);
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Username atau Password salah!'
            });
        }

        const payload = {
            id_user: user.id_user,
            username: user.username,
            nama_lengkap: user.nama_lengkap
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(200).json({
            status: 'success',
            message: 'Login berhasil!',
            data: {
                token: token,
                user: {
                    id_user: user.id_user,
                    nama_lengkap: user.nama_lengkap,
                    username: user.username
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { login };