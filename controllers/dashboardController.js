// ==========================================
// CONTROLLER: dashboardController.js
// ==========================================

const db = require('../config/database');

const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Ambil data agregat (Top Cards)
        const queryTopCards = `
            SELECT 
                COUNT(id_perhitungan) AS total_riwayat,
                SUM(CASE WHEN DATE(tanggal_perhitungan) = CURDATE() THEN 1 ELSE 0 END) AS perhitungan_hari_ini,
                SUM(CASE WHEN tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 ELSE 0 END) AS bulan_ini
            FROM perhitungan_gizi
        `;

        // 2. Ambil sebaran Status Gizi (1 Bulan Terakhir)
        const queryStatusGizi = `
            SELECT status_gizi_saat_dihitung AS status, COUNT(*) AS jumlah
            FROM perhitungan_gizi
            WHERE tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
            GROUP BY status_gizi_saat_dihitung
        `;

        // 3. Ambil Rata-rata Makronutrien (1 Bulan Terakhir)
        const queryRataRata = `
            SELECT 
                AVG(kebutuhan_energi_total) AS avg_energi,
                AVG(protein_gram) AS avg_protein,
                AVG(lemak_gram) AS avg_lemak,
                AVG(karbohidrat_gram) AS avg_karbo
            FROM perhitungan_gizi
            WHERE tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        `;

        // 4. Ambil Distribusi Penyakit (1 Bulan Terakhir)
        // Karena diagnosa digabung koma, kita hitung dengan operasi LIKE
        const queryPenyakit = `
            SELECT 
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%Diabetes%' THEN 1 ELSE 0 END) AS dm,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%Lambung%' THEN 1 ELSE 0 END) AS lambung,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%Stroke%' THEN 1 ELSE 0 END) AS stroke,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%CHF%' OR diagnosa_penyakit_saat_dihitung LIKE '%Jantung%' THEN 1 ELSE 0 END) as chf,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%CKD%' OR diagnosa_penyakit_saat_dihitung LIKE '%Ginjal%' THEN 1 ELSE 0 END) as ckd
            FROM perhitungan_gizi
            WHERE tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        `;

        // 5. Ambil 5 Riwayat Terakhir
        const queryRiwayatTerakhir = `
            SELECT 
                p.nama_pasien, p.jenis_kelamin, p.umur,
                pg.tanggal_perhitungan AS tanggal, 
                pg.metode_perhitungan AS metode, 
                pg.kebutuhan_energi_total AS energi,
                pg.status_gizi_saat_dihitung AS status_gizi, 
                pg.diagnosa_penyakit_saat_dihitung AS penyakit
            FROM perhitungan_gizi pg
            JOIN pasien p ON pg.id_pasien = p.id_pasien
            ORDER BY pg.tanggal_perhitungan DESC
            LIMIT 5
        `;

        // Eksekusi semua query secara paralel agar super cepat
        const [
            [topCardsData],
            [statusGiziData],
            [rataRataData],
            [penyakitData],
            [riwayatTerakhirData]
        ] = await Promise.all([
            db.execute(queryTopCards),
            db.execute(queryStatusGizi),
            db.execute(queryRataRata),
            db.execute(queryPenyakit),
            db.execute(queryRiwayatTerakhir)
        ]);

        // ==========================================
        // PEMROSESAN DATA UNTUK FRONTEND
        // ==========================================
        
        // Data Top Cards
        const cardData = topCardsData[0];
        const totalBulanIni = Number(cardData.bulan_ini) || 0;

        // Data Status Gizi (Menghitung Persentase)
        const formatStatusGizi = statusGiziData.map(item => ({
            status: item.status, // Normal, Kurang Gizi, Obesitas
            jumlah: item.jumlah,
            persentase: totalBulanIni > 0 ? parseFloat(((item.jumlah / totalBulanIni) * 100).toFixed(1)) : 0
        }));

        // Data Penyakit (Menghitung Persentase)
        const p = penyakitData[0];
        const totalPenyakitTerdeteksi = Number(p.dm) + Number(p.lambung) + Number(p.stroke) + Number(p.chf) + Number(p.ckd);
        
        const formatPenyakit = [
            { nama: 'Diabetes Melitus', jumlah: Number(p.dm), persentase: totalPenyakitTerdeteksi > 0 ? parseFloat(((p.dm / totalPenyakitTerdeteksi) * 100).toFixed(1)) : 0 },
            { nama: 'Ginjal Kronik (CKD)', jumlah: Number(p.ckd), persentase: totalPenyakitTerdeteksi > 0 ? parseFloat(((p.ckd / totalPenyakitTerdeteksi) * 100).toFixed(1)) : 0 },
            { nama: 'Penyakit Jantung (CHF)', jumlah: Number(p.chf), persentase: totalPenyakitTerdeteksi > 0 ? parseFloat(((p.chf / totalPenyakitTerdeteksi) * 100).toFixed(1)) : 0 },
            { nama: 'Lambung', jumlah: Number(p.lambung), persentase: totalPenyakitTerdeteksi > 0 ? parseFloat(((p.lambung / totalPenyakitTerdeteksi) * 100).toFixed(1)) : 0 },
            { nama: 'Stroke', jumlah: Number(p.stroke), persentase: totalPenyakitTerdeteksi > 0 ? parseFloat(((p.stroke / totalPenyakitTerdeteksi) * 100).toFixed(1)) : 0 },
        ].sort((a, b) => b.jumlah - a.jumlah); // Urutkan dari yang terbanyak

        // Data Rata-rata
        const r = rataRataData[0];

        // Format Response Akhir
        res.status(200).json({
            status: 'success',
            message: 'Data statistik dashboard berhasil diambil',
            data: {
                ringkasan: {
                    total_perhitungan_bulan_ini: totalBulanIni,
                    perhitungan_hari_ini: Number(cardData.perhitungan_hari_ini) || 0,
                    total_riwayat_keseluruhan: Number(cardData.total_riwayat) || 0
                },
                status_gizi: formatStatusGizi,
                rata_rata: {
                    energi_kkal: r.avg_energi ? parseFloat(Number(r.avg_energi).toFixed(1)) : 0,
                    protein_gram: r.avg_protein ? parseFloat(Number(r.avg_protein).toFixed(1)) : 0,
                    lemak_gram: r.avg_lemak ? parseFloat(Number(r.avg_lemak).toFixed(1)) : 0,
                    karbohidrat_gram: r.avg_karbo ? parseFloat(Number(r.avg_karbo).toFixed(1)) : 0
                },
                distribusi_penyakit: formatPenyakit,
                riwayat_terakhir: riwayatTerakhirData
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardStats };