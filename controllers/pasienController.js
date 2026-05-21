const db = require('../config/database');

const getAllPasien = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        // Menangkap parameter filter dari Frontend
        const search = req.query.search || '';
        const periode = req.query.periode || ''; // 'hari_ini', 'minggu_ini', 'bulan_ini', 'custom'
        const startDate = req.query.startDate || '';
        const endDate = req.query.endDate || '';

        // Query Statistik Ringkasan (Tetap)
        const queryStats = `
            SELECT 
                COUNT(*) AS total_pasien,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_perempuan,
                SUM(CASE WHEN DATE(tanggal_masuk) = CURDATE() THEN 1 ELSE 0 END) AS pasien_hari_ini
            FROM pasien
        `;
        const [[statsData]] = await db.execute(queryStats);

        // Membangun query dinamis untuk pencarian dan filter
        let queryList = `
            SELECT 
                p.id_pasien, p.nama_pasien, p.no_rm, p.umur, p.jenis_kelamin, p.status_gizi, p.tanggal_masuk,
                GROUP_CONCAT(mp.nama_penyakit SEPARATOR ', ') AS diagnosis
            FROM pasien p
            LEFT JOIN pasien_diagnosa pd ON p.id_pasien = pd.id_pasien
            LEFT JOIN master_penyakit mp ON pd.id_penyakit = mp.id_penyakit
            WHERE 1=1
        `;
        const queryParams = [];

        // 1. Filter Pencarian (Nama atau No. RM)
        if (search) {
            queryList += ` AND (p.nama_pasien LIKE ? OR p.no_rm LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // 2. Filter Periode Data
        if (periode === 'hari_ini') {
            queryList += ` AND DATE(p.tanggal_masuk) = CURDATE()`;
        } else if (periode === 'minggu_ini') {
            queryList += ` AND YEARWEEK(p.tanggal_masuk, 1) = YEARWEEK(CURDATE(), 1)`;
        } else if (periode === 'bulan_ini') {
            queryList += ` AND MONTH(p.tanggal_masuk) = MONTH(CURDATE()) AND YEAR(p.tanggal_masuk) = YEAR(CURDATE())`;
        } else if (periode === 'custom' && startDate && endDate) {
            queryList += ` AND DATE(p.tanggal_masuk) BETWEEN ? AND ?`;
            queryParams.push(startDate, endDate);
        }

        queryList += `
            GROUP BY p.id_pasien
            ORDER BY p.tanggal_masuk DESC, p.id_pasien DESC
            LIMIT ? OFFSET ?
        `;
        
        // Menambahkan limit dan offset ke array parameter
        queryParams.push(limit.toString(), offset.toString());

        // Agar aman dari error tipe data saat LIMIT/OFFSET
        const [listPasien] = await db.execute(queryList, queryParams);

        // Menghitung total data yang ditemukan setelah di-filter (untuk info "Total ditemukan: 3 pasien")
        let totalDitemukan = listPasien.length; 
        
        res.status(200).json({
            status: 'success',
            data: {
                statistik: {
                    total_pasien: statsData.total_pasien || 0,
                    laki_laki: statsData.total_laki_laki || 0,
                    perempuan: statsData.total_perempuan || 0,
                    hari_ini: statsData.pasien_hari_ini || 0
                },
                pasien: listPasien,
                pagination: {
                    total_ditemukan: totalDitemukan,
                    halaman_sekarang: page,
                    limit_per_halaman: limit
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const getPasienById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const queryPasien = 'SELECT * FROM pasien WHERE id_pasien = ?';
        const [[pasien]] = await db.execute(queryPasien, [id]);

        if (!pasien) {
            return res.status(404).json({ status: 'error', message: 'Data pasien tidak ditemukan' });
        }

        const queryPenyakit = 'SELECT id_penyakit FROM pasien_diagnosa WHERE id_pasien = ?';
        const [penyakitRaw] = await db.execute(queryPenyakit, [id]);
        
        const id_penyakit_array = penyakitRaw.map(p => p.id_penyakit);

        res.status(200).json({
            status: 'success',
            data: {
                ...pasien,
                diagnosa: id_penyakit_array
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPasien,
    getPasienById
};