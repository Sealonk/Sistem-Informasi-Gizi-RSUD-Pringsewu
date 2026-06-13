// ==========================================
// CONTROLLER: pasienController.js
// ==========================================

const db = require('../config/database');
const { getKelompokUmur, hitungIMT } = require('../utils/sharedRumus');

const getAllPasien = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const search = req.query.search || '';
        const periode = req.query.periode || ''; 
        const startDate = req.query.startDate || '';
        const endDate = req.query.endDate || '';
        
        // PARAMETER BARU: Filter Status Perhitungan
        const status_perhitungan = req.query.status_perhitungan || ''; // 'sudah', 'belum', atau kosong (semua)

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

        // Filter Tambahan untuk Status Perhitungan di level validasi akhir
        let validPasienFilter = '';
        if (status_perhitungan === 'sudah') {
            validPasienFilter = 'WHERE id_perhitungan IS NOT NULL';
        } else if (status_perhitungan === 'belum') {
            validPasienFilter = 'WHERE id_perhitungan IS NULL';
        }

        // =======================================================
        // 2. CTE (Common Table Expression) 
        // =======================================================
        const cteQuery = `
            WITH LatestRawat AS (
                SELECT no_rkm_medis, MAX(no_rawat) AS max_rawat
                FROM pasien
                GROUP BY no_rkm_medis
            ),
            StatusHitung AS (
                -- CTE Baru: Mencari perhitungan terakhir untuk setiap pasien (no_rawat)
                SELECT no_rawat, MAX(id_perhitungan) AS id_perhitungan, MAX(tanggal_perhitungan) AS waktu_pembaruan
                FROM perhitungan_gizi
                GROUP BY no_rawat
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
                    MAX(p.nm_penyakit) AS nama_penyakit_asli,
                    
                    -- PENGAMBILAN STATUS PERHITUNGAN
                    MAX(sh.id_perhitungan) AS id_perhitungan,
                    MAX(sh.waktu_pembaruan) AS waktu_pembaruan,
                    
                    MAX(CASE WHEN p.kd_penyakit LIKE 'E10%' OR p.kd_penyakit LIKE 'E11%' OR p.kd_penyakit LIKE 'E12%' OR p.kd_penyakit LIKE 'E13%' OR p.kd_penyakit LIKE 'E14%' THEN 1 ELSE 0 END) AS has_dm,
                    MAX(CASE WHEN p.kd_penyakit LIKE 'N18%' THEN 1 ELSE 0 END) AS has_ckd,
                    MAX(CASE WHEN p.kd_penyakit LIKE 'I50%' THEN 1 ELSE 0 END) AS has_chf,
                    MAX(CASE WHEN p.kd_penyakit LIKE 'I60%' OR p.kd_penyakit LIKE 'I61%' OR p.kd_penyakit LIKE 'I62%' OR p.kd_penyakit LIKE 'I63%' OR p.kd_penyakit LIKE 'I64%' THEN 1 ELSE 0 END) AS has_stroke,
                    MAX(CASE WHEN p.kd_penyakit LIKE 'K21%' OR p.kd_penyakit LIKE 'K25%' OR p.kd_penyakit LIKE 'K29%' OR p.kd_penyakit LIKE 'K30%' THEN 1 ELSE 0 END) AS has_lambung,
                    
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
                LEFT JOIN StatusHitung sh ON p.no_rawat = sh.no_rawat
                WHERE 1=1 ${whereClause} 
                AND NOT (LOWER(p.sttsumur) LIKE '%bl%' OR LOWER(p.sttsumur) LIKE '%hr%' OR (LOWER(p.sttsumur) LIKE '%th%' AND p.umurdaftar < 18))
                GROUP BY p.no_rawat, p.no_rkm_medis
            )
        `;

        const queryStats = cteQuery + `
            SELECT 
                COUNT(*) AS total_pasien,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_perempuan,
                SUM(CASE WHEN DATE(tanggal_masuk) = CURDATE() THEN 1 ELSE 0 END) AS pasien_hari_ini
            FROM ValidPasien
            ${validPasienFilter};
        `;
        
        const queryCount = cteQuery + `SELECT COUNT(*) AS total FROM ValidPasien ${validPasienFilter};`;
        
        const queryList = cteQuery + `
            SELECT * FROM ValidPasien
            ${validPasienFilter}
            ORDER BY tanggal_masuk DESC, id_pasien DESC
            LIMIT ? OFFSET ?;
        `;

        const [[statsData]] = await db.execute(queryStats, queryParams);
        const [[countData]] = await db.execute(queryCount, queryParams);
        
        const queryParamsList = [...queryParams, limit.toString(), offset.toString()];
        const [rowsPasien] = await db.execute(queryList, queryParamsList);

        if (search && rowsPasien.length === 0) {
            const checkQuery = `
                SELECT 
                    MAX(p.umurdaftar) AS umurdaftar, 
                    MAX(p.sttsumur) AS sttsumur
                FROM pasien p
                WHERE p.nm_pasien LIKE ? OR p.no_rkm_medis LIKE ?
                GROUP BY p.no_rawat
                ORDER BY MAX(p.tgl_masuk) DESC
                LIMIT 1
            `;
            
            const [rawCheck] = await db.execute(checkQuery, [`%${search}%`, `%${search}%`]);

            if (rawCheck.length === 0) {
                return res.status(404).json({ status: 'error', message: 'Pasien yang dicari tidak ada' });
            }

            const suspect = rawCheck[0];
            const isBulanAtauHari = suspect.sttsumur.toLowerCase().includes('bl') || suspect.sttsumur.toLowerCase().includes('hr');
            const isAnakAnak = isBulanAtauHari || (suspect.sttsumur.toLowerCase().includes('th') && parseInt(suspect.umurdaftar) < 18);

            if (isAnakAnak) {
                return res.status(403).json({ status: 'error', message: 'Pasien ditemukan, namun sistem perhitungan gizi saat ini belum didukung untuk kategori pasien pediatri (anak-anak).' });
            }
        }

        const listPasienFormatted = rowsPasien.map(item => {
            let penyakitArr = [];
            let penyakitLainnya = null;

            if (item.has_dm) penyakitArr.push('DM');
            if (item.has_ckd) penyakitArr.push('CKD');
            if (item.has_chf) penyakitArr.push('CHF');
            if (item.has_stroke) penyakitArr.push('Stroke');
            if (item.has_lambung) penyakitArr.push('Lambung');

            if (item.count_other > 0 || penyakitArr.length === 0) {
                penyakitArr.push('Mifflin');
                penyakitLainnya = item.nama_penyakit_asli || 'Penyakit Umum';
            }

            // PEMFORMATAN WAKTU PEMBARUAN TERAKHIR
            let waktu_pembaruan_rapi = null;
            if (item.waktu_pembaruan) {
                const tglObj = new Date(item.waktu_pembaruan);
                const tgl = tglObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const jam = tglObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                waktu_pembaruan_rapi = `${tgl}, ${jam}`;
            }

            return {
                id_pasien: item.id_pasien, 
                nama_pasien: item.nama_pasien,
                no_rm: item.no_rm,
                umur: `${item.umurdaftar} ${item.sttsumur}`,
                jenis_kelamin: item.jenis_kelamin,
                tanggal_masuk: item.tanggal_masuk,
                diagnosis: penyakitArr.join(' + '),
                diagnosis_array: penyakitArr,
                penyakit_lainnya: penyakitLainnya,
                nama_penyakit_asli: item.nama_penyakit_asli,
                
                // FIELD BARU UNTUK UI
                status_perhitungan: item.id_perhitungan ? 'Sudah Dihitung' : 'Belum',
                id_perhitungan: item.id_perhitungan || null, 
                waktu_pembaruan: waktu_pembaruan_rapi
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

        // Query ditambahkan LEFT JOIN ke tabel perhitungan gizi untuk mengecek status
        const queryPasien = `
            SELECT 
                p.no_rawat AS id_pasien, 
                MAX(p.nm_pasien) AS nama_pasien, 
                MAX(p.no_rkm_medis) AS no_rm, 
                MAX(p.umurdaftar) AS umurdaftar, 
                MAX(p.sttsumur) AS sttsumur,
                MAX(p.jk) AS jenis_kelamin, 
                MAX(p.tinggi) AS tinggi_badan, 
                MAX(p.berat) AS berat_badan,
                MAX(p.nm_penyakit) AS nama_penyakit_asli,
                
                -- CEK STATUS
                MAX(sh.id_perhitungan) AS id_perhitungan,
                MAX(sh.waktu_pembaruan) AS waktu_pembaruan,

                MAX(CASE WHEN p.kd_penyakit LIKE 'E10%' OR p.kd_penyakit LIKE 'E11%' OR p.kd_penyakit LIKE 'E12%' OR p.kd_penyakit LIKE 'E13%' OR p.kd_penyakit LIKE 'E14%' THEN 1 ELSE 0 END) AS has_dm,
                MAX(CASE WHEN p.kd_penyakit LIKE 'N18%' THEN 1 ELSE 0 END) AS has_ckd,
                MAX(CASE WHEN p.kd_penyakit LIKE 'I50%' THEN 1 ELSE 0 END) AS has_chf,
                MAX(CASE WHEN p.kd_penyakit LIKE 'I60%' OR p.kd_penyakit LIKE 'I61%' OR p.kd_penyakit LIKE 'I62%' OR p.kd_penyakit LIKE 'I63%' OR p.kd_penyakit LIKE 'I64%' THEN 1 ELSE 0 END) AS has_stroke,
                MAX(CASE WHEN p.kd_penyakit LIKE 'K21%' OR p.kd_penyakit LIKE 'K25%' OR p.kd_penyakit LIKE 'K29%' OR p.kd_penyakit LIKE 'K30%' THEN 1 ELSE 0 END) AS has_lambung,
                SUM(CASE WHEN 
                    (p.kd_penyakit NOT LIKE 'E10%' AND p.kd_penyakit NOT LIKE 'E11%' AND p.kd_penyakit NOT LIKE 'E12%' AND p.kd_penyakit NOT LIKE 'E13%' AND p.kd_penyakit NOT LIKE 'E14%') AND
                    (p.kd_penyakit NOT LIKE 'N18%') AND
                    (p.kd_penyakit NOT LIKE 'I50%') AND
                    (p.kd_penyakit NOT LIKE 'I60%' AND p.kd_penyakit NOT LIKE 'I61%' AND p.kd_penyakit NOT LIKE 'I62%' AND p.kd_penyakit NOT LIKE 'I63%' AND p.kd_penyakit NOT LIKE 'I64%') AND
                    (p.kd_penyakit NOT LIKE 'K21%' AND p.kd_penyakit NOT LIKE 'K25%' AND p.kd_penyakit NOT LIKE 'K29%' AND p.kd_penyakit NOT LIKE 'K30%') AND
                    p.kd_penyakit IS NOT NULL AND p.kd_penyakit != ''
                THEN 1 ELSE 0 END) AS count_other
            FROM pasien p
            LEFT JOIN (
                SELECT no_rawat, MAX(id_perhitungan) AS id_perhitungan, MAX(tanggal_perhitungan) AS waktu_pembaruan
                FROM perhitungan_gizi
                GROUP BY no_rawat
            ) sh ON p.no_rawat = sh.no_rawat
            WHERE p.no_rawat = ?
            GROUP BY p.no_rawat
        `;
        const [rows] = await db.execute(queryPasien, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Data pasien tidak ditemukan di SIMRS' });
        }

        const pasien = rows[0];

        const isBulanAtauHari = pasien.sttsumur.toLowerCase().includes('bl') || pasien.sttsumur.toLowerCase().includes('hr');
        const isAnakAnak = isBulanAtauHari || (pasien.sttsumur.toLowerCase().includes('th') && parseInt(pasien.umurdaftar) < 18);

        if (isAnakAnak) {
            return res.status(403).json({ status: 'error', message: 'Pasien ditemukan, namun sistem perhitungan gizi saat ini belum didukung untuk kategori pasien pediatri (anak-anak).' });
        }

        let diagnosa_array = [];
        let penyakitLainnya = null;

        if (pasien.has_dm) diagnosa_array.push('DM');
        if (pasien.has_ckd) diagnosa_array.push('CKD');
        if (pasien.has_chf) diagnosa_array.push('CHF');
        if (pasien.has_stroke) diagnosa_array.push('Stroke');
        if (pasien.has_lambung) diagnosa_array.push('Lambung');

        if (pasien.count_other > 0 || diagnosa_array.length === 0) {
            diagnosa_array.push('Mifflin');
            penyakitLainnya = pasien.nama_penyakit_asli || 'Penyakit Umum';
        }

        const berat = parseFloat(pasien.berat_badan) || 0;
        const tinggi = parseFloat(pasien.tinggi_badan) || 0;
        const dataIMT = hitungIMT(berat, tinggi);

        let umurNumerik = parseFloat(pasien.umurdaftar) || 0;
        const kelompokUmur = getKelompokUmur(umurNumerik);

        // Waktu Pembaruan Detail
        let waktu_pembaruan_rapi = null;
        if (pasien.waktu_pembaruan) {
            const tglObj = new Date(pasien.waktu_pembaruan);
            const tgl = tglObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            const jam = tglObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            waktu_pembaruan_rapi = `${tgl}, ${jam}`;
        }

        res.status(200).json({
            status: 'success',
            data: {
                id_pasien: pasien.id_pasien,
                nama_pasien: pasien.nama_pasien,
                no_rm: pasien.no_rm,
                umur: `${pasien.umurdaftar} ${pasien.sttsumur}`,
                kelompok_umur: kelompokUmur,
                jenis_kelamin: pasien.jenis_kelamin,
                tinggi_badan: tinggi > 0 ? tinggi : null,
                berat_badan: berat > 0 ? berat : null,
                imt: dataIMT.nilaiIMT,
                status_gizi: dataIMT.statusGizi,
                diagnosis: diagnosa_array.length > 0 ? diagnosa_array.join(' + ') : '-',
                diagnosa_kategori: diagnosa_array,
                penyakit_lainnya: penyakitLainnya,
                nama_penyakit_asli: pasien.nama_penyakit_asli,
                
                // FIELD BARU
                status_perhitungan: pasien.id_perhitungan ? 'Sudah Dihitung' : 'Belum',
                id_perhitungan: pasien.id_perhitungan || null,
                waktu_pembaruan: waktu_pembaruan_rapi
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllPasien, getPasienById };