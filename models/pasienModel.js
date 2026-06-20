// ==========================================
// MODEL: pasienModel.js
// ==========================================

const db = require('../config/database');

const Pasien = {
    /**
     * Mengambil data statistik ringkasan pasien untuk header/cards halaman pasien
     */
    getStats: async (whereClause, queryParams, validPasienFilter) => {
        const query = `
            WITH StatusHitung AS (
                SELECT no_rawat, MAX(id_perhitungan) AS id_perhitungan, MAX(tanggal_perhitungan) AS waktu_pembaruan
                FROM perhitungan_gizi
                GROUP BY no_rawat
            ),
            ValidPasien AS (
                SELECT 
                    rp.no_rawat AS id_pasien,
                    p.jk AS jenis_kelamin,
                    COALESCE(ki.tgl_masuk, rp.tgl_registrasi) AS tanggal_masuk,
                    sh.id_perhitungan
                FROM reg_periksa rp
                INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
                LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
                LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
                LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
                LEFT JOIN StatusHitung sh ON rp.no_rawat = sh.no_rawat
                WHERE 1=1 ${whereClause}
                AND NOT (LOWER(rp.sttsumur) LIKE '%bl%' OR LOWER(rp.sttsumur) LIKE '%hr%' OR (LOWER(rp.sttsumur) LIKE '%th%' AND rp.umurdaftar < 18))
            )
            SELECT 
                COUNT(*) AS total_pasien,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_perempuan,
                SUM(CASE WHEN DATE(tanggal_masuk) = CURDATE() THEN 1 ELSE 0 END) AS pasien_hari_ini
            FROM ValidPasien
            ${validPasienFilter}
        `;
        const [[res]] = await db.execute(query, queryParams);
        return res;
    },

    /**
     * Menghitung total baris pasien yang sesuai filter untuk keperluan pagination
     */
    countAll: async (whereClause, queryParams, validPasienFilter) => {
        const query = `
            WITH StatusHitung AS (
                SELECT no_rawat, MAX(id_perhitungan) AS id_perhitungan
                FROM perhitungan_gizi
                GROUP BY no_rawat
            ),
            ValidPasien AS (
                SELECT 
                    rp.no_rawat AS id_pasien,
                    sh.id_perhitungan
                FROM reg_periksa rp
                INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
                LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
                LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
                LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
                LEFT JOIN StatusHitung sh ON rp.no_rawat = sh.no_rawat
                WHERE 1=1 ${whereClause}
                AND NOT (LOWER(rp.sttsumur) LIKE '%bl%' OR LOWER(rp.sttsumur) LIKE '%hr%' OR (LOWER(rp.sttsumur) LIKE '%th%' AND rp.umurdaftar < 18))
            )
            SELECT COUNT(*) AS total FROM ValidPasien ${validPasienFilter}
        `;
        const [[res]] = await db.execute(query, queryParams);
        return res.total;
    },

    /**
     * Menampilkan semua data kunjungan pasien aktif lengkap beserta counter riwayat lampau
     */
    findAll: async (whereClause, queryParams, validPasienFilter, limit, offset) => {
        const query = `
            WITH StatusHitung AS (
                SELECT no_rawat, MAX(id_perhitungan) AS id_perhitungan, MAX(tanggal_perhitungan) AS waktu_pembaruan
                FROM perhitungan_gizi
                GROUP BY no_rawat
            ),
            ValidPasien AS (
                SELECT 
                    rp.no_rawat AS id_pasien,
                    MAX(p.nm_pasien) AS nama_pasien,
                    rp.no_rkm_medis AS no_rm,
                    MAX(p.jk) AS jenis_kelamin,
                    MAX(rp.umurdaftar) AS umurdaftar,
                    MAX(rp.sttsumur) AS sttsumur,
                    MAX(COALESCE(ki.tgl_masuk, rp.tgl_registrasi)) AS tanggal_masuk,
                    MAX(ki.tgl_masuk) AS tgl_masuk_inap,
                    MAX(ki.tgl_keluar) AS tgl_keluar,
                    MAX(b.nm_bangsal) AS ruangan,
                    GROUP_CONCAT(DISTINCT py.nm_penyakit SEPARATOR ', ') AS nama_penyakit_asli,
                    MAX(sh.id_perhitungan) AS id_perhitungan,
                    MAX(sh.waktu_pembaruan) AS waktu_pembaruan,
                    
                    MAX(CASE WHEN dp.kd_penyakit LIKE 'E10%' OR dp.kd_penyakit LIKE 'E11%' OR dp.kd_penyakit LIKE 'E12%' OR dp.kd_penyakit LIKE 'E13%' OR dp.kd_penyakit LIKE 'E14%' THEN 1 ELSE 0 END) AS has_dm,
                    MAX(CASE WHEN dp.kd_penyakit LIKE 'N18%' THEN 1 ELSE 0 END) AS has_ckd,
                    MAX(CASE WHEN dp.kd_penyakit LIKE 'I50%' THEN 1 ELSE 0 END) AS has_chf,
                    MAX(CASE WHEN dp.kd_penyakit LIKE 'I60%' OR dp.kd_penyakit LIKE 'I61%' OR dp.kd_penyakit LIKE 'I62%' OR dp.kd_penyakit LIKE 'I63%' OR dp.kd_penyakit LIKE 'I64%' THEN 1 ELSE 0 END) AS has_stroke,
                    MAX(CASE WHEN dp.kd_penyakit LIKE 'K21%' OR dp.kd_penyakit LIKE 'K25%' OR dp.kd_penyakit LIKE 'K29%' OR dp.kd_penyakit LIKE 'K30%' THEN 1 ELSE 0 END) AS has_lambung,
                    
                    SUM(CASE WHEN 
                        (dp.kd_penyakit NOT LIKE 'E10%' AND dp.kd_penyakit NOT LIKE 'E11%' AND dp.kd_penyakit NOT LIKE 'E12%' AND dp.kd_penyakit NOT LIKE 'E13%' AND dp.kd_penyakit NOT LIKE 'E14%') AND
                        (dp.kd_penyakit NOT LIKE 'N18%') AND
                        (dp.kd_penyakit NOT LIKE 'I50%') AND
                        (dp.kd_penyakit NOT LIKE 'I60%' AND dp.kd_penyakit NOT LIKE 'I61%' AND dp.kd_penyakit NOT LIKE 'I62%' AND dp.kd_penyakit NOT LIKE 'I63%' AND dp.kd_penyakit NOT LIKE 'I64%') AND
                        (dp.kd_penyakit NOT LIKE 'K21%' AND dp.kd_penyakit NOT LIKE 'K25%' AND dp.kd_penyakit NOT LIKE 'K29%' AND dp.kd_penyakit NOT LIKE 'K30%') AND
                        dp.kd_penyakit IS NOT NULL AND dp.kd_penyakit != ''
                    THEN 1 ELSE 0 END) AS count_other,

                    (SELECT COUNT(*) 
                     FROM perhitungan_gizi pg_old 
                     JOIN reg_periksa rp_old ON pg_old.no_rawat = rp_old.no_rawat 
                     WHERE rp_old.no_rkm_medis = rp.no_rkm_medis AND rp_old.no_rawat <> rp.no_rawat
                    ) AS total_riwayat_lampau

                FROM reg_periksa rp
                INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
                LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
                LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
                LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
                LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
                LEFT JOIN penyakit py ON dp.kd_penyakit = py.kd_penyakit
                LEFT JOIN StatusHitung sh ON rp.no_rawat = sh.no_rawat
                WHERE 1=1 ${whereClause}
                AND NOT (LOWER(rp.sttsumur) LIKE '%bl%' OR LOWER(rp.sttsumur) LIKE '%hr%' OR (LOWER(rp.sttsumur) LIKE '%th%' AND rp.umurdaftar < 18))
                GROUP BY rp.no_rawat, rp.no_rkm_medis
            )
            SELECT * FROM ValidPasien
            ${validPasienFilter}
            ORDER BY tanggal_masuk DESC, id_pasien DESC
            LIMIT ? OFFSET ?
        `;

        // PERBAIKAN: Gunakan toString() pada limit dan offset agar mysql2 execute tidak error
        const params = [...queryParams, limit.toString(), offset.toString()];
        const [rows] = await db.execute(query, params);
        return rows;
    },

    /**
     * Mengambil detail lengkap pasien berdasarkan No. Rawat spesifik
     */
    findById: async (no_rawat) => {
        const query = `
            SELECT 
                rp.no_rawat AS id_pasien, 
                MAX(p.nm_pasien) AS nama_pasien, 
                MAX(p.no_rkm_medis) AS no_rm, 
                MAX(rp.umurdaftar) AS umurdaftar, 
                MAX(rp.sttsumur) AS sttsumur,
                MAX(p.jk) AS jenis_kelamin, 
                MAX(COALESCE(pranap.tinggi, pralan.tinggi)) AS tinggi_badan, 
                MAX(COALESCE(pranap.berat, pralan.berat)) AS berat_badan,
                MAX(ki.tgl_masuk) AS tgl_masuk_inap,
                MAX(ki.tgl_keluar) AS tgl_keluar,
                MAX(b.nm_bangsal) AS ruangan,
                GROUP_CONCAT(DISTINCT py.nm_penyakit SEPARATOR ', ') AS nama_penyakit_asli,
                MAX(sh.id_perhitungan) AS id_perhitungan,
                MAX(sh.waktu_pembaruan) AS waktu_pembaruan,
                MAX(CASE WHEN dp.kd_penyakit LIKE 'E10%' OR dp.kd_penyakit LIKE 'E11%' OR dp.kd_penyakit LIKE 'E12%' OR dp.kd_penyakit LIKE 'E13%' OR dp.kd_penyakit LIKE 'E14%' THEN 1 ELSE 0 END) AS has_dm,
                MAX(CASE WHEN dp.kd_penyakit LIKE 'N18%' THEN 1 ELSE 0 END) AS has_ckd,
                MAX(CASE WHEN dp.kd_penyakit LIKE 'I50%' THEN 1 ELSE 0 END) AS has_chf,
                MAX(CASE WHEN dp.kd_penyakit LIKE 'I60%' OR dp.kd_penyakit LIKE 'I61%' OR dp.kd_penyakit LIKE 'I62%' OR dp.kd_penyakit LIKE 'I63%' OR dp.kd_penyakit LIKE 'I64%' THEN 1 ELSE 0 END) AS has_stroke,
                MAX(CASE WHEN dp.kd_penyakit LIKE 'K21%' OR dp.kd_penyakit LIKE 'K25%' OR dp.kd_penyakit LIKE 'K29%' OR dp.kd_penyakit LIKE 'K30%' THEN 1 ELSE 0 END) AS has_lambung,
                SUM(CASE WHEN 
                    (dp.kd_penyakit NOT LIKE 'E10%' AND dp.kd_penyakit NOT LIKE 'E11%' AND dp.kd_penyakit NOT LIKE 'E12%' AND dp.kd_penyakit NOT LIKE 'E13%' AND dp.kd_penyakit NOT LIKE 'E14%') AND
                    (dp.kd_penyakit NOT LIKE 'N18%') AND
                    (dp.kd_penyakit NOT LIKE 'I50%') AND
                    (dp.kd_penyakit NOT LIKE 'I60%' AND dp.kd_penyakit NOT LIKE 'I61%' AND dp.kd_penyakit NOT LIKE 'I62%' AND dp.kd_penyakit NOT LIKE 'I63%' AND dp.kd_penyakit NOT LIKE 'I64%') AND
                    (dp.kd_penyakit NOT LIKE 'K21%' AND dp.kd_penyakit NOT LIKE 'K25%' AND dp.kd_penyakit NOT LIKE 'K29%' AND dp.kd_penyakit NOT LIKE 'K30%') AND
                    dp.kd_penyakit IS NOT NULL AND dp.kd_penyakit != ''
                THEN 1 ELSE 0 END) AS count_other
            FROM reg_periksa rp
            INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
            LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
            LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
            LEFT JOIN penyakit py ON dp.kd_penyakit = py.kd_penyakit
            LEFT JOIN pemeriksaan_ralan pralan ON rp.no_rawat = pralan.no_rawat
            LEFT JOIN pemeriksaan_ranap pranap ON rp.no_rawat = pranap.no_rawat
            LEFT JOIN (
                SELECT no_rawat, MAX(id_perhitungan) AS id_perhitungan, MAX(tanggal_perhitungan) AS waktu_pembaruan
                FROM perhitungan_gizi
                GROUP BY no_rawat
            ) sh ON rp.no_rawat = sh.no_rawat
            WHERE rp.no_rawat = ?
            GROUP BY rp.no_rawat
        `;
        const [rows] = await db.execute(query, [no_rawat]);
        return rows[0];
    },

    /**
     * Menarik seluruh riwayat gizi lampau miliknya berdasarkan Nomor Rekam Medis
     */
    findHistoryByNoRm: async (no_rm, current_no_rawat) => {
        const query = `
            SELECT 
                pg.id_perhitungan,
                pg.no_rawat,
                pg.tanggal_perhitungan,
                pg.status_gizi_saat_dihitung AS status_gizi,
                pg.kebutuhan_energi_total AS energi,
                pg.ruang_bangsal AS ruangan,
                pg.diagnosa_penyakit_saat_dihitung AS penyakit
            FROM perhitungan_gizi pg
            INNER JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            WHERE rp.no_rkm_medis = ? AND rp.no_rawat <> ?
            ORDER BY pg.tanggal_perhitungan DESC
        `;
        const [rows] = await db.execute(query, [no_rm, current_no_rawat]);
        return rows;
    },

    checkPediatricSuspect: async (search) => {
        const query = `
            SELECT MAX(rp.umurdaftar) AS umurdaftar, MAX(rp.sttsumur) AS sttsumur
            FROM reg_periksa rp
            INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            WHERE p.nm_pasien LIKE ? OR p.no_rkm_medis LIKE ?
            GROUP BY rp.no_rawat
            ORDER BY MAX(COALESCE(rp.tgl_registrasi)) DESC
            LIMIT 1
        `;
        const [rows] = await db.execute(query, [`%${search}%`, `%${search}%`]);
        return rows[0];
    },

    /**
     * PERBAIKAN: Fungsi ini telah ditambahkan kembali agar filter dropdown frontend tidak error
     */
    getAllBangsal: async () => {
        const query = 'SELECT kd_bangsal, nm_bangsal FROM bangsal ORDER BY nm_bangsal ASC';
        const [rows] = await db.execute(query);
        return rows;
    }
};

module.exports = Pasien;