// ==========================================
// MODEL: dashboardModel.js
// ==========================================

const db = require('../config/database');

const Dashboard = {
    // 1. Ambil data agregat (Top Cards) - Hanya hitung versi terbaru
    getTopCards: async () => {
        const query = `
            WITH LatestPerhitungan AS (
                SELECT id_perhitungan, tanggal_perhitungan 
                FROM perhitungan_gizi
                WHERE id_perhitungan IN (
                    SELECT MAX(id_perhitungan) 
                    FROM perhitungan_gizi 
                    GROUP BY COALESCE(parent_id, id_perhitungan)
                )
            )
            SELECT 
                COUNT(id_perhitungan) AS total_riwayat,
                SUM(CASE WHEN DATE(tanggal_perhitungan) = CURDATE() THEN 1 ELSE 0 END) AS perhitungan_hari_ini,
                SUM(CASE WHEN tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 ELSE 0 END) AS bulan_ini
            FROM LatestPerhitungan
        `;
        const [rows] = await db.execute(query);
        return rows[0];
    },

    // 2. Ambil sebaran Status Gizi - Hanya hitung versi terbaru
    getStatusGizi: async () => {
        const query = `
            WITH LatestPerhitungan AS (
                SELECT id_perhitungan, status_gizi_saat_dihitung, tanggal_perhitungan 
                FROM perhitungan_gizi
                WHERE id_perhitungan IN (
                    SELECT MAX(id_perhitungan) 
                    FROM perhitungan_gizi 
                    GROUP BY COALESCE(parent_id, id_perhitungan)
                )
            )
            SELECT 
                CASE 
                    WHEN status_gizi_saat_dihitung LIKE '%Kurus%' OR status_gizi_saat_dihitung LIKE '%Kekurangan%' THEN 'Kurus'
                    WHEN status_gizi_saat_dihitung LIKE '%Normal%' THEN 'Normal'
                    WHEN status_gizi_saat_dihitung LIKE '%Kelebihan%' THEN 'Overweight'
                    WHEN status_gizi_saat_dihitung LIKE '%Obesitas%' THEN 'Obesitas'
                    ELSE 'Lainnya'
                END AS kategori_baku, 
                COUNT(*) AS jumlah
            FROM LatestPerhitungan
            WHERE tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
            GROUP BY kategori_baku
        `;
        const [rows] = await db.execute(query);
        return rows;
    },

    // 3. Ambil Rata-rata Makronutrien - Hanya hitung versi terbaru
    getRataRata: async () => {
        const query = `
            WITH LatestPerhitungan AS (
                SELECT kebutuhan_energi_total, protein_gram, lemak_gram, karbohidrat_gram
                FROM perhitungan_gizi
                WHERE id_perhitungan IN (
                    SELECT MAX(id_perhitungan) 
                    FROM perhitungan_gizi 
                    GROUP BY COALESCE(parent_id, id_perhitungan)
                )
            )
            SELECT 
                AVG(kebutuhan_energi_total) AS avg_energi,
                AVG(protein_gram) AS avg_protein,
                AVG(lemak_gram) AS avg_lemak,
                AVG(karbohidrat_gram) AS avg_karbo
            FROM LatestPerhitungan
        `;
        const [rows] = await db.execute(query);
        return rows[0];
    },

    // 4. Ambil Distribusi Penyakit - Hanya hitung versi terbaru
    getPenyakit: async (startDate, endDate) => {
        let whereClause = 'WHERE tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)'; 
        const params = [];

        if (startDate && endDate) {
            whereClause = 'WHERE DATE(tanggal_perhitungan) BETWEEN ? AND ?';
            params.push(startDate, endDate);
        } else if (startDate) {
            whereClause = 'WHERE DATE(tanggal_perhitungan) = ?';
            params.push(startDate);
        }

        const query = `
            WITH LatestPerhitungan AS (
                SELECT diagnosa_penyakit_saat_dihitung, tanggal_perhitungan
                FROM perhitungan_gizi
                WHERE id_perhitungan IN (
                    SELECT MAX(id_perhitungan) 
                    FROM perhitungan_gizi 
                    GROUP BY COALESCE(parent_id, id_perhitungan)
                )
            )
            SELECT 
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%DM%' OR diagnosa_penyakit_saat_dihitung LIKE '%Diabetes%' THEN 1 ELSE 0 END) AS dm,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%Lambung%' OR diagnosa_penyakit_saat_dihitung LIKE '%Gastritis%' OR diagnosa_penyakit_saat_dihitung LIKE '%Dyspepsia%' OR diagnosa_penyakit_saat_dihitung LIKE '%GERD%' THEN 1 ELSE 0 END) AS lambung,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%Stroke%' OR diagnosa_penyakit_saat_dihitung LIKE '%Infarction%' THEN 1 ELSE 0 END) AS stroke,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%CHF%' OR diagnosa_penyakit_saat_dihitung LIKE '%Jantung%' OR diagnosa_penyakit_saat_dihitung LIKE '%Heart%' THEN 1 ELSE 0 END) as chf,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%CKD%' OR diagnosa_penyakit_saat_dihitung LIKE '%Ginjal%' OR diagnosa_penyakit_saat_dihitung LIKE '%Renal%' THEN 1 ELSE 0 END) as ckd,
                
                SUM(CASE WHEN 
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%DM%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Diabetes%' AND 
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%Lambung%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Gastritis%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Dyspepsia%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%GERD%' AND
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%Stroke%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Infarction%' AND
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%CHF%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Jantung%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Heart%' AND
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%CKD%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Ginjal%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Renal%'
                THEN 1 ELSE 0 END) as lainnya
            FROM LatestPerhitungan
            ${whereClause}
        `;
        
        const [rows] = await db.execute(query, params);
        return rows[0];
    },

    // 5. Ambil 5 Riwayat Terakhir - Memastikan pasien yang sama tidak tampil ganda berurutan karena di-edit
    getRiwayatTerakhir: async () => {
        const query = `
            SELECT 
                MAX(p.nm_pasien) AS nama_pasien, 
                MAX(p.no_rkm_medis) AS no_rm,
                MAX(p.jk) AS jenis_kelamin, 
                MAX(rp.umurdaftar) AS umur,
                MAX(b.nm_bangsal) AS ruangan,
                COALESCE(MAX(ki.tgl_masuk), MAX(rp.tgl_registrasi)) AS tanggal_masuk,
                GROUP_CONCAT(DISTINCT dp.kd_penyakit SEPARATOR ', ') AS kode_penyakit,
                pg.tanggal_perhitungan AS tanggal, 
                pg.metode_perhitungan AS metode, 
                pg.kebutuhan_energi_total AS energi,
                pg.protein_gram,
                pg.lemak_gram,
                pg.karbohidrat_gram,
                pg.status_gizi_saat_dihitung AS status_gizi, 
                pg.diagnosa_penyakit_saat_dihitung AS penyakit
            FROM perhitungan_gizi pg
            INNER JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            INNER JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
            LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
            LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
            WHERE pg.id_perhitungan IN (
                SELECT MAX(id_perhitungan) 
                FROM perhitungan_gizi 
                GROUP BY COALESCE(parent_id, id_perhitungan)
            )
            GROUP BY pg.id_perhitungan
            ORDER BY pg.tanggal_perhitungan DESC
            LIMIT 5
        `;
        const [rows] = await db.execute(query);
        return rows;
    }
};

module.exports = Dashboard;