const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Konfigurasi dasar (berlaku untuk lokal maupun cloud)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Logika Deteksi Lingkungan
if (process.env.INSTANCE_CONNECTION_NAME) {
    // 1. Jika terdeteksi di App Engine, hubungkan melalui jalur internal Unix Socket
    dbConfig.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
    // 2. Jika di lokal, gunakan host (IP) dan port biasa
    dbConfig.host = process.env.DB_HOST || 'localhost';
    dbConfig.port = process.env.DB_PORT || 3306;
}

const pool = mysql.createPool(dbConfig);
const db = pool.promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('================================================');
        console.error('GAGAL terhubung ke Database MySQL!');
        console.error('Detail Error:', err.message);
        console.error('================================================');
    } else {
        console.log('================================================');
        console.log('BERHASIL terhubung ke Database MySQL');
        console.log(`Mode Koneksi: ${process.env.INSTANCE_CONNECTION_NAME ? 'Google App Engine (Socket)' : 'Lokal (TCP/IP)'}`);
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log('================================================');
        connection.release();
    }
});

module.exports = db;