const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('================================================');
        console.error('GAGAL terhubung ke Database MySQL (Laragon)!');
        console.error('Detail Error:', err.message);
        console.error('Pastikan Laragon/MySQL sudah dalam keadaan RUNNING.');
        console.log('================================================');
    } else {
        console.log('================================================');
        console.log('BERHASIL terhubung ke Database MySQL (Laragon)');
        console.log(`Database: ${process.env.DB_NAME}`);
        console.log('================================================');
        connection.release();
    }
});

module.exports = db;