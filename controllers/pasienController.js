// ==========================================
// CONTROLLER: pasienController.js
// ==========================================

const db = require('../config/database');

const getAllPasien = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const search = req.query.search || '';
        const periode = req.query.periode || ''; 
        const startDate = req.query.startDate || '';
        const endDate = req.query.endDate || '';

        // 1. Build Klausa WHERE Dinamis
        let whereClause = '';
        const queryParams = [];

        if (search) {
            whereClause += ` AND (p.nm_pasien LIKE ? OR p.no_rkm_medis LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (periode === 'hari_ini') {
            whereClause += ` AND DATE(p.tgl_masuk) = CURDATE()`;
        } else if (periode === 'minggu_ini') {
            whereClause += ` AND YEARWEEK(p.tgl_masuk, 1) = YEARWEEK(CURDATE(), 1)`;
        } else if (periode === 'bulan_ini') {
            whereClause += ` AND MONTH(p.tgl_masuk) = MONTH(CURDATE()) AND YEAR(p.tgl_masuk) = YEAR(CURDATE())`;
        } else if (periode === 'custom' && startDate && endDate) {
            whereClause += ` AND DATE(p.tgl_masuk) BETWEEN ? AND ?`;
            queryParams.push(startDate, endDate);
        }

        // =======================================================
        // 2. CTE (Common Table Expression) - JANTUNG DARI FILTER INI
        // Menggabungkan baris, mengambil rawat terakhir, dan memfilter strict penyakit
        // =======================================================
        const cteQuery = `
            WITH LatestRawat AS (
                SELECT no_rkm_medis, MAX(no_rawat) AS max_rawat
                FROM pasien
                GROUP BY no_rkm_medis
            ),
            ValidPasien AS (
                SELECT 
                    p.no_rawat AS id_pasien,
                    MAX(p.nm_pasien) AS nama_pasien,
                    p.no_rkm_medis AS no_rm,
                    MAX(p.jk) AS jenis_kelamin,
                    MAX(p.umurdaftar) AS umurdaftar,
                    MAX(p.sttsumur) AS sttsumur,
                    MAX(p.tgl_masuk) AS tanggal_masuk,
                    
                    -- Deteksi Penyakit Valid
                    MAX(CASE WHEN p.kd_penyakit LIKE 'E10%' OR p.kd_penyakit LIKE 'E11%' OR p.kd_penyakit LIKE 'E12%' OR p.kd_penyakit LIKE 'E13%' OR p.kd_penyakit LIKE 'E14%' THEN 1 ELSE 0 END) AS has_dm,
                    MAX(CASE WHEN p.kd_penyakit LIKE 'N18%' THEN 1 ELSE 0 END) AS has_ckd,
                    MAX(CASE WHEN p.kd_penyakit LIKE 'I50%' THEN 1 ELSE 0 END) AS has_chf,
                    MAX(CASE WHEN p.kd_penyakit LIKE 'I60%' OR p.kd_penyakit LIKE 'I61%' OR p.kd_penyakit LIKE 'I62%' OR p.kd_penyakit LIKE 'I63%' OR p.kd_penyakit LIKE 'I64%' THEN 1 ELSE 0 END) AS has_stroke,
                    MAX(CASE WHEN p.kd_penyakit LIKE 'K21%' OR p.kd_penyakit LIKE 'K25%' OR p.kd_penyakit LIKE 'K29%' OR p.kd_penyakit LIKE 'K30%' THEN 1 ELSE 0 END) AS has_lambung,
                    
                    -- Deteksi Penyakit Diluar Sistem (Akan digunakan untuk memblokir pasien)
                    SUM(CASE WHEN 
                        (p.kd_penyakit NOT LIKE 'E10%' AND p.kd_penyakit NOT LIKE 'E11%' AND p.kd_penyakit NOT LIKE 'E12%' AND p.kd_penyakit NOT LIKE 'E13%' AND p.kd_penyakit NOT LIKE 'E14%') AND
                        (p.kd_penyakit NOT LIKE 'N18%') AND
                        (p.kd_penyakit NOT LIKE 'I50%') AND
                        (p.kd_penyakit NOT LIKE 'I60%' AND p.kd_penyakit NOT LIKE 'I61%' AND p.kd_penyakit NOT LIKE 'I62%' AND p.kd_penyakit NOT LIKE 'I63%' AND p.kd_penyakit NOT LIKE 'I64%') AND
                        (p.kd_penyakit NOT LIKE 'K21%' AND p.kd_penyakit NOT LIKE 'K25%' AND p.kd_penyakit NOT LIKE 'K29%' AND p.kd_penyakit NOT LIKE 'K30%') AND
                        p.kd_penyakit IS NOT NULL AND p.kd_penyakit != ''
                    THEN 1 ELSE 0 END) AS count_other
                FROM pasien p
                INNER JOIN LatestRawat lr ON p.no_rawat = lr.max_rawat
                WHERE 1=1 ${whereClause}
                GROUP BY p.no_rawat, p.no_rkm_medis
                
                -- ATURAN KETAT: Dilarang ada penyakit lain (count_other = 0) DAN harus punya minimal 1 penyakit sistem
                HAVING count_other = 0 AND (has_dm = 1 OR has_ckd = 1 OR has_chf = 1 OR has_stroke = 1 OR has_lambung = 1)
            )
        `;

        // 3. Eksekusi 3 Query secara paralel untuk kecepatan maksimal
        const queryStats = cteQuery + `
            SELECT 
                COUNT(*) AS total_pasien,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_perempuan,
                SUM(CASE WHEN DATE(tanggal_masuk) = CURDATE() THEN 1 ELSE 0 END) AS pasien_hari_ini
            FROM ValidPasien;
        `;
        
        const queryCount = cteQuery + `SELECT COUNT(*) AS total FROM ValidPasien;`;
        
        const queryList = cteQuery + `
            SELECT * FROM ValidPasien
            ORDER BY tanggal_masuk DESC, id_pasien DESC
            LIMIT ? OFFSET ?;
        `;

        const [[statsData]] = await db.execute(queryStats, queryParams);
        const [[countData]] = await db.execute(queryCount, queryParams);
        
        // Memasukkan array param untuk list beserta limit/offset
        const queryParamsList = [...queryParams, limit.toString(), offset.toString()];
        const [rowsPasien] = await db.execute(queryList, queryParamsList);

        // 4. Formatter Data agar komplikasi sesuai ("DM + CKD + CHF")
        const listPasienFormatted = rowsPasien.map(item => {
            let penyakitArr = [];
            
            // Urutan pengecekan disusun agar string outputnya rapi sesuai permintaan
            if (item.has_dm) penyakitArr.push('DM');
            if (item.has_ckd) penyakitArr.push('CKD');
            if (item.has_chf) penyakitArr.push('CHF');
            if (item.has_stroke) penyakitArr.push('Stroke');
            if (item.has_lambung) penyakitArr.push('Lambung');

            return {
                id_pasien: item.id_pasien, // Menyimpan no_rawat terakhir
                nama_pasien: item.nama_pasien,
                no_rm: item.no_rm,
                umur: `${item.umurdaftar} ${item.sttsumur}`,
                jenis_kelamin: item.jenis_kelamin,
                tanggal_masuk: item.tanggal_masuk,
                diagnosis: penyakitArr.join(' + ') // Akan otomatis merangkai jadi 'DM + CKD'
            };
        });

        res.status(200).json({
            status: 'success',
            data: {
                statistik: {
                    total_pasien: statsData.total_pasien || 0,
                    laki_laki: statsData.total_laki_laki || 0,
                    perempuan: statsData.total_perempuan || 0,
                    hari_ini: statsData.pasien_hari_ini || 0
                },
                pasien: listPasienFormatted,
                pagination: {
                    total_ditemukan: countData.total || 0,
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

        // PERBAIKAN: Semua kolom yang tidak di-GROUP BY wajib dibungkus MAX()
        const queryPasien = `
            SELECT 
                no_rawat AS id_pasien, 
                MAX(nm_pasien) AS nama_pasien, 
                MAX(no_rkm_medis) AS no_rm, 
                MAX(umurdaftar) AS umurdaftar, 
                MAX(sttsumur) AS sttsumur,
                MAX(jk) AS jenis_kelamin, 
                MAX(tinggi) AS tinggi_badan, 
                MAX(berat) AS berat_badan,
                MAX(CASE WHEN kd_penyakit LIKE 'E10%' OR kd_penyakit LIKE 'E11%' OR kd_penyakit LIKE 'E12%' OR kd_penyakit LIKE 'E13%' OR kd_penyakit LIKE 'E14%' THEN 1 ELSE 0 END) AS has_dm,
                MAX(CASE WHEN kd_penyakit LIKE 'N18%' THEN 1 ELSE 0 END) AS has_ckd,
                MAX(CASE WHEN kd_penyakit LIKE 'I50%' THEN 1 ELSE 0 END) AS has_chf,
                MAX(CASE WHEN kd_penyakit LIKE 'I60%' OR kd_penyakit LIKE 'I61%' OR kd_penyakit LIKE 'I62%' OR kd_penyakit LIKE 'I63%' OR kd_penyakit LIKE 'I64%' THEN 1 ELSE 0 END) AS has_stroke,
                MAX(CASE WHEN kd_penyakit LIKE 'K21%' OR kd_penyakit LIKE 'K25%' OR kd_penyakit LIKE 'K29%' OR kd_penyakit LIKE 'K30%' THEN 1 ELSE 0 END) AS has_lambung
            FROM pasien 
            WHERE no_rawat = ?
            GROUP BY no_rawat
        `;
        const [rows] = await db.execute(queryPasien, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Data pasien tidak ditemukan di SIMRS' });
        }

        const pasien = rows[0];

        let diagnosa_array = [];
        if (pasien.has_dm) diagnosa_array.push('DM');
        if (pasien.has_ckd) diagnosa_array.push('CKD');
        if (pasien.has_chf) diagnosa_array.push('CHF');
        if (pasien.has_stroke) diagnosa_array.push('Stroke');
        if (pasien.has_lambung) diagnosa_array.push('Lambung');

        res.status(200).json({
            status: 'success',
            data: {
                id_pasien: pasien.id_pasien,
                nama_pasien: pasien.nama_pasien,
                no_rm: pasien.no_rm,
                umur: `${pasien.umurdaftar} ${pasien.sttsumur}`,
                jenis_kelamin: pasien.jenis_kelamin,
                tinggi_badan: pasien.tinggi_badan,
                berat_badan: pasien.berat_badan,
                diagnosis: diagnosa_array.length > 0 ? diagnosa_array.join(' + ') : '-',
                diagnosa_kategori: diagnosa_array
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllPasien, getPasienById };