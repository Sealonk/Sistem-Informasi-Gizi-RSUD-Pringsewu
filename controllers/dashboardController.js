// ==========================================
// CONTROLLER: dashboardController.js
// ==========================================

const DashboardModel = require('../models/dashboardModel');

const getDashboardStats = async (req, res, next) => {
    try {
        // [DIPERBARUI]: Menangkap input filter rentang tanggal (mendukung nama parameter startDate/endDate atau tanggal_awal/tanggal_akhir)
        const startDate = req.query.tanggal_awal || req.query.startDate || '';
        const endDate = req.query.tanggal_akhir || req.query.endDate || '';

        // Eksekusi semua fungsi Model secara paralel agar super cepat
        const [
            topCardsData,
            statusGiziData,
            rataRataData,
            penyakitData,
            riwayatTerakhirData
        ] = await Promise.all([
            DashboardModel.getTopCards(),
            DashboardModel.getStatusGizi(),
            DashboardModel.getRataRata(),
            DashboardModel.getPenyakit(startDate, endDate), // Mengirimkan parameter tanggal
            DashboardModel.getRiwayatTerakhir()
        ]);

        // ==========================================
        // PEMROSESAN DATA UNTUK FRONTEND
        // ==========================================
        
        const totalBulanIni = Number(topCardsData.bulan_ini) || 0;

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
        // Untuk menghitung persentase penyakit, kita totalkan dulu jumlah penyakit yang dicari pada rentang tanggal tersebut
        const totalPenyakitDitemukan = Number(penyakitData.dm) + Number(penyakitData.chf) + Number(penyakitData.ckd) + Number(penyakitData.lambung) + Number(penyakitData.stroke) + Number(penyakitData.lainnya);
        
        const formatPenyakit = [
            { nama: 'Diabetes Melitus', jumlah: Number(penyakitData.dm), persentase: totalPenyakitDitemukan > 0 ? parseFloat(((penyakitData.dm / totalPenyakitDitemukan) * 100).toFixed(1)) : 0 },
            { nama: 'Penyakit Jantung', jumlah: Number(penyakitData.chf), persentase: totalPenyakitDitemukan > 0 ? parseFloat(((penyakitData.chf / totalPenyakitDitemukan) * 100).toFixed(1)) : 0 },
            { nama: 'Ginjal Kronik', jumlah: Number(penyakitData.ckd), persentase: totalPenyakitDitemukan > 0 ? parseFloat(((penyakitData.ckd / totalPenyakitDitemukan) * 100).toFixed(1)) : 0 },
            { nama: 'Lambung', jumlah: Number(penyakitData.lambung), persentase: totalPenyakitDitemukan > 0 ? parseFloat(((penyakitData.lambung / totalPenyakitDitemukan) * 100).toFixed(1)) : 0 },
            { nama: 'Stroke', jumlah: Number(penyakitData.stroke), persentase: totalPenyakitDitemukan > 0 ? parseFloat(((penyakitData.stroke / totalPenyakitDitemukan) * 100).toFixed(1)) : 0 },
            { nama: 'Lainnya', jumlah: Number(penyakitData.lainnya), persentase: totalPenyakitDitemukan > 0 ? parseFloat(((penyakitData.lainnya / totalPenyakitDitemukan) * 100).toFixed(1)) : 0 }
        ].sort((a, b) => b.jumlah - a.jumlah);

        // 3. Data Riwayat Terakhir
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
                ruangan: item.ruangan || 'Poli / Rawat Jalan',
                info_pasien: `${item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, ${item.umur} Tahun`,
                tanggal: tglObj.toLocaleDateString('id-ID', opsiTanggal),
                jam: tglObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(/\./g, ':'),
                metode: item.metode,
                energi: Math.round(item.energi).toLocaleString('id-ID'), 
                makronutrien: {
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
                    perhitungan_hari_ini: Number(topCardsData.perhitungan_hari_ini) || 0,
                    total_riwayat_keseluruhan: Number(topCardsData.total_riwayat) || 0
                },
                status_gizi: formatStatusGizi,
                rata_rata: {
                    energi_kkal: rataRataData.avg_energi ? parseFloat(Number(rataRataData.avg_energi).toFixed(1)) : 0,
                    protein_gram: rataRataData.avg_protein ? parseFloat(Number(rataRataData.avg_protein).toFixed(1)) : 0,
                    lemak_gram: rataRataData.avg_lemak ? parseFloat(Number(rataRataData.avg_lemak).toFixed(1)) : 0,
                    karbohidrat_gram: rataRataData.avg_karbo ? parseFloat(Number(rataRataData.avg_karbo).toFixed(1)) : 0
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