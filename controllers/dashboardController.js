const db = require('../config/database');

const getDashboardStats = async (req, res, next) => {
    try {
        const [
            [totalPasienData],
            [perhitunganHariIniData],
            [rataRataEnergiData],
            [pasienTerbaruData]
        ] = await Promise.all([
            db.execute('SELECT COUNT(*) AS total_pasien FROM pasien'),
            
            db.execute('SELECT COUNT(*) AS perhitungan_hari_ini FROM perhitungan_gizi WHERE DATE(tanggal_perhitungan) = CURDATE()'),
            
            db.execute('SELECT AVG(kebutuhan_energi_total) AS rata_rata_energi FROM perhitungan_gizi'),
            
            db.execute(`
                SELECT id_pasien, nama_pasien, jenis_kelamin, umur, tanggal_masuk 
                FROM pasien 
                ORDER BY id_pasien DESC 
                LIMIT 5
            `)
        ]);

        const totalPasien = totalPasienData[0].total_pasien || 0;
        const perhitunganHariIni = perhitunganHariIniData[0].perhitungan_hari_ini || 0;
        
        const rataRataEnergiRaw = rataRataEnergiData[0].rata_rata_energi;
        const rataRataEnergi = rataRataEnergiRaw ? parseFloat(rataRataEnergiRaw).toFixed(2) : 0;

        res.status(200).json({
            status: 'success',
            message: 'Data statistik dashboard berhasil diambil',
            data: {
                total_pasien: totalPasien,
                perhitungan_hari_ini: perhitunganHariIni,
                rata_rata_energi: parseFloat(rataRataEnergi),
                pasien_terbaru: pasienTerbaruData
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardStats };