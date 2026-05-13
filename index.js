const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const pasienRoutes = require('./routes/pasienRoutes');
const perhitunganRoutes = require('./routes/perhitunganRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/pasien', pasienRoutes);
app.use('/api/perhitungan', perhitunganRoutes);

app.get('/', (req, res) => {
    res.json({
        message: "Selamat Datang di API Sistem Informasi Gizi RSUD Pringsewu",
        status: "Server is Running"
    });
});

const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`================================================`);
});