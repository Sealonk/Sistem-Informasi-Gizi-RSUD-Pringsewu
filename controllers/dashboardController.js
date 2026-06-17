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
            SELECT 
                CASE 
                    WHEN status_gizi_saat_dihitung LIKE '%Kurus%' OR status_gizi_saat_dihitung LIKE '%Kekurangan%' THEN 'Kurus'
                    WHEN status_gizi_saat_dihitung LIKE '%Normal%' THEN 'Normal'
                    WHEN status_gizi_saat_dihitung LIKE '%Kelebihan%' THEN 'Overweight'
                    WHEN status_gizi_saat_dihitung LIKE '%Obesitas%' THEN 'Obesitas'
                    ELSE 'Lainnya'
                END AS kategori_baku, 
                COUNT(*) AS jumlah
            FROM perhitungan_gizi
            WHERE tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
            GROUP BY kategori_baku
        `;

        // 3. Ambil Rata-rata Makronutrien (KESELURUHAN / ALL TIME)
        const queryRataRata = `
            SELECT 
                AVG(kebutuhan_energi_total) AS avg_energi,
                AVG(protein_gram) AS avg_protein,
                AVG(lemak_gram) AS avg_lemak,
                AVG(karbohidrat_gram) AS avg_karbo
            FROM perhitungan_gizi
        `;

        // 4. Ambil Distribusi Penyakit (1 Bulan Terakhir)
        const queryPenyakit = `
            SELECT 
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%DM%' OR diagnosa_penyakit_saat_dihitung LIKE '%Diabetes%' THEN 1 ELSE 0 END) AS dm,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%Lambung%' OR diagnosa_penyakit_saat_dihitung LIKE '%Gastritis%' OR diagnosa_penyakit_saat_dihitung LIKE '%Dyspepsia%' OR diagnosa_penyakit_saat_dihitung LIKE '%GERD%' THEN 1 ELSE 0 END) AS lambung,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%Stroke%' OR diagnosa_penyakit_saat_dihitung LIKE '%Infarction%' THEN 1 ELSE 0 END) AS stroke,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%CHF%' OR diagnosa_penyakit_saat_dihitung LIKE '%Jantung%' OR diagnosa_penyakit_saat_dihitung LIKE '%Heart%' THEN 1 ELSE 0 END) as chf,
                SUM(CASE WHEN diagnosa_penyakit_saat_dihitung LIKE '%CKD%' OR diagnosa_penyakit_saat_dihitung LIKE '%Ginjal%' OR diagnosa_penyakit_saat_dihitung LIKE '%Renal%' THEN 1 ELSE 0 END) as ckd,
                
                -- Kategori 'Lainnya'
                SUM(CASE WHEN 
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%DM%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Diabetes%' AND 
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%Lambung%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Gastritis%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Dyspepsia%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%GERD%' AND
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%Stroke%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Infarction%' AND
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%CHF%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Jantung%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Heart%' AND
                    diagnosa_penyakit_saat_dihitung NOT LIKE '%CKD%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Ginjal%' AND diagnosa_penyakit_saat_dihitung NOT LIKE '%Renal%'
                THEN 1 ELSE 0 END) as lainnya
            FROM perhitungan_gizi
            WHERE tanggal_perhitungan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        `;

        // =========================================================================
        // 5. Ambil 5 Riwayat Terakhir (Ruangan & Makronutrien Gram)
        // =========================================================================
        const queryRiwayatTerakhir = `
            SELECT 
                MAX(p.nm_pasien) AS nama_pasien, 
                MAX(p.no_rkm_medis) AS no_rm,
                MAX(p.jk) AS jenis_kelamin, 
                MAX(rp.umurdaftar) AS umur,
                
                -- Tambahan Ruangan
                MAX(b.nm_bangsal) AS ruangan,
                
                COALESCE(MAX(ki.tgl_masuk), MAX(rp.tgl_registrasi)) AS tanggal_masuk,
                
                GROUP_CONCAT(DISTINCT dp.kd_penyakit SEPARATOR ', ') AS kode_penyakit,
                
                pg.tanggal_perhitungan AS tanggal, 
                pg.metode_perhitungan AS metode, 
                pg.kebutuhan_energi_total AS energi,
                
                -- Diubah dari Persen menjadi Gram
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
            GROUP BY pg.id_perhitungan
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
        
        const cardData = topCardsData[0];
        const totalBulanIni = Number(cardData.bulan_ini) || 0;

        // 1. Data Status Gizi
        const mapStatusGizi = { 'Normal': 0, 'Kurus': 0, 'Overweight': 0, 'Obesitas': 0, 'Lainnya': 0 };
        statusGiziData.forEach(item => {
            if(mapStatusGizi[item.kategori_baku] !== undefined) {
                mapStatusGizi[item.kategori_baku] = Number(item.jumlah);
            }
        });

        const formatStatusGizi = Object.keys(mapStatusGizi).map(key => ({
            status: key,
            jumlah: mapStatusGizi[key],
            persentase: totalBulanIni > 0 ? parseFloat(((mapStatusGizi[key] / totalBulanIni) * 100).toFixed(1)) : 0
        }));

        // 2. Data Penyakit
        const p_data = penyakitData[0];
        const formatPenyakit = [
            { nama: 'Diabetes Melitus', jumlah: Number(p_data.dm), persentase: totalBulanIni > 0 ? parseFloat(((p_data.dm / totalBulanIni) * 100).toFixed(1)) : 0 },
            { nama: 'Penyakit Jantung', jumlah: Number(p_data.chf), persentase: totalBulanIni > 0 ? parseFloat(((p_data.chf / totalBulanIni) * 100).toFixed(1)) : 0 },
            { nama: 'Ginjal Kronik', jumlah: Number(p_data.ckd), persentase: totalBulanIni > 0 ? parseFloat(((p_data.ckd / totalBulanIni) * 100).toFixed(1)) : 0 },
            { nama: 'Lambung', jumlah: Number(p_data.lambung), persentase: totalBulanIni > 0 ? parseFloat(((p_data.lambung / totalBulanIni) * 100).toFixed(1)) : 0 },
            { nama: 'Stroke', jumlah: Number(p_data.stroke), persentase: totalBulanIni > 0 ? parseFloat(((p_data.stroke / totalBulanIni) * 100).toFixed(1)) : 0 },
            { nama: 'Lainnya', jumlah: Number(p_data.lainnya), persentase: totalBulanIni > 0 ? parseFloat(((p_data.lainnya / totalBulanIni) * 100).toFixed(1)) : 0 }
        ].sort((a, b) => b.jumlah - a.jumlah);

        // 3. Data Rata-rata
        const r = rataRataData[0];

        // 4. Data Riwayat Terakhir
        const formatRiwayat = riwayatTerakhirData.map(item => {
            const tglObj = new Date(item.tanggal);
            const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric' };
            
            let tglMasukRapi = '-';
            if (item.tanggal_masuk) {
                const tglMasukObj = new Date(item.tanggal_masuk);
                tglMasukRapi = tglMasukObj.toLocaleDateString('id-ID', opsiTanggal);
            }

            return {
                nama_pasien: item.nama_pasien,
                tanggal_masuk: tglMasukRapi,
                no_rm: item.no_rm,
                ruangan: item.ruangan || 'Poli / Rawat Jalan', // Nilai default jika pasien rawat jalan
                info_pasien: `${item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, ${item.umur} Tahun`,
                tanggal: tglObj.toLocaleDateString('id-ID', opsiTanggal),
                jam: tglObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                metode: item.metode,
                energi: Math.round(item.energi).toLocaleString('id-ID'), 
                makronutrien: {
                    // Dikonversi menjadi angka (float) dari database Gram
                    protein: parseFloat(item.protein_gram) || 0,
                    lemak: parseFloat(item.lemak_gram) || 0,
                    karbohidrat: parseFloat(item.karbohidrat_gram) || 0
                },
                status_gizi: item.status_gizi,
                kode_penyakit: item.kode_penyakit || '-',
                penyakit: item.penyakit 
            }
        });

        // ==========================================
        // RESPONSE AKHIR
        // ==========================================
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
                riwayat_terakhir: formatRiwayat
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardStats };