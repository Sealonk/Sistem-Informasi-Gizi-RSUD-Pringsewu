// ==========================================
// CONTROLLER: riwayatController.js
// ==========================================

const db = require('../config/database');
const PerhitunganModel = require('../models/riwayatModel');
const { kalkulasiGiziTotal } = require('../utils/rumusGizi');

/**
 * Fungsi Pembantu: Mengonversi string umur SIMRS (Th, Bl, Hr) menjadi angka desimal Tahun murni
 */
const konversiUmurKeTahun = (umurStr) => {
    if (!umurStr) return 0;
    
    const angka = parseFloat(umurStr);
    const teksUrutan = String(umurStr).toLowerCase();

    if (teksUrutan.includes('bl') || teksUrutan.includes('bulan')) {
        return parseFloat((angka / 12).toFixed(2));
    }
    if (teksUrutan.includes('hr') || teksUrutan.includes('hari')) {
        return parseFloat((angka / 365).toFixed(2));
    }
    
    return angka; 
};

// ==========================================
// MENGAMBIL DAFTAR RIWAYAT (DENGAN FILTER)
// ==========================================
const getRiwayat = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || '';
        const penyakit = req.query.penyakit || '';
        const tanggal = req.query.tanggal || '';
        
        const filter_user = req.query.filter_user || 'all'; 
        const id_user_login = req.user.id_user; 

        let whereClause = 'WHERE 1=1';
        const queryParams = [];

        if (filter_user === 'me') {
            whereClause += ` AND pg.id_user = ?`;
            queryParams.push(id_user_login);
        }

        if (search) {
            whereClause += ` AND (p.nm_pasien LIKE ? OR p.no_rkm_medis LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (penyakit && penyakit !== 'Semua Penyakit') {
            const arrayPenyakit = penyakit.split(',').map(item => item.trim()).filter(item => item !== '');
            arrayPenyakit.forEach(namaPenyakit => {
                whereClause += ` AND pg.diagnosa_penyakit_saat_dihitung LIKE ?`;
                queryParams.push(`%${namaPenyakit}%`);
            });
        }

        if (tanggal) {
            whereClause += ` AND DATE(pg.tanggal_perhitungan) = ?`;
            queryParams.push(tanggal);
        }

        const countQuery = `
            SELECT COUNT(DISTINCT pg.id_perhitungan) AS total
            FROM perhitungan_gizi pg
            JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            JOIN users u ON pg.id_user = u.id_user
            ${whereClause}
        `;
        const [[countResult]] = await db.execute(countQuery, queryParams);
        const totalData = countResult.total;

        const dataQuery = `
            SELECT 
                pg.id_perhitungan,
                pg.id_user,
                MAX(p.nm_pasien) AS nama_pasien,
                MAX(p.no_rkm_medis) AS no_rm,
                MAX(p.jk) AS jenis_kelamin,
                GROUP_CONCAT(DISTINCT dp.kd_penyakit SEPARATOR ', ') AS kode_penyakit,
                pg.diagnosa_penyakit_saat_dihitung AS penyakit,
                pg.kebutuhan_energi_total AS total_energi,
                pg.protein_persen, 
                pg.lemak_persen, 
                pg.karbohidrat_persen,
                pg.tanggal_perhitungan,
                MAX(u.nama_lengkap) AS created_by
            FROM perhitungan_gizi pg
            JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            JOIN users u ON pg.id_user = u.id_user
            LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
            ${whereClause}
            GROUP BY pg.id_perhitungan
            ORDER BY pg.tanggal_perhitungan DESC
            LIMIT ? OFFSET ?
        `;

        const finalQueryParams = [...queryParams, limit.toString(), offset.toString()];
        const [rows] = await db.execute(dataQuery, finalQueryParams);

        const formattedRiwayat = rows.map(item => {
            const dateObj = new Date(item.tanggal_perhitungan);
            const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric' };
            const tanggalRapi = dateObj.toLocaleDateString('id-ID', opsiTanggal);

            return {
                id_perhitungan: item.id_perhitungan,
                nama_pasien: item.nama_pasien,
                no_rm: item.no_rm, 
                jenis_kelamin: item.jenis_kelamin, 
                kode_penyakit: item.kode_penyakit || '-', 
                penyakit: item.penyakit,
                total_energi: Math.round(item.total_energi), 
                makronutrien: { 
                    protein: item.protein_persen,
                    lemak: item.lemak_persen,
                    karbohidrat: item.karbohidrat_persen
                },
                tanggal_perhitungan: tanggalRapi,
                created_by: item.created_by, 
                is_mine: item.id_user === id_user_login 
            };
        });

        res.status(200).json({
            status: 'success',
            message: 'Data riwayat berhasil diambil',
            data: {
                riwayat: formattedRiwayat,
                pagination: {
                    total_data: totalData,
                    halaman_sekarang: page,
                    total_halaman: Math.ceil(totalData / limit),
                    limit_per_halaman: limit
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// MENGAMBIL DETAIL SATU RIWAYAT
// ==========================================
const getRiwayatDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const detail = await PerhitunganModel.findDetailById(id);

        if (!detail) {
            return res.status(404).json({ status: 'error', message: 'Data riwayat tidak ditemukan' });
        }

        const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric' };

        if (detail.tanggal_masuk) {
            const tglMasukObj = new Date(detail.tanggal_masuk);
            detail.tanggal_masuk_rapi = tglMasukObj.toLocaleDateString('id-ID', opsiTanggal);
        }

        if (detail.tanggal_perhitungan) {
            const tglHitungObj = new Date(detail.tanggal_perhitungan);
            detail.tanggal_perhitungan_rapi = tglHitungObj.toLocaleDateString('id-ID', opsiTanggal);
        }

        res.status(200).json({
            status: 'success',
            data: detail
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// MENGUPDATE/MENGUBAH DATA RIWAYAT
// ==========================================
const updateRiwayat = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dataInput = req.body;
        const id_user_login = req.user.id_user; 

        const detailLama = await PerhitunganModel.findDetailById(id);
        if (!detailLama) {
            return res.status(404).json({ status: 'error', message: 'Data riwayat tidak ditemukan' });
        }

        if (detailLama.id_user !== id_user_login) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Akses Ditolak! Anda hanya dapat memperbarui perhitungan yang Anda buat sendiri.' 
            });
        }

        let hasilKalkulasi;
        try {
            if (dataInput.umur) {
                dataInput.umur = konversiUmurKeTahun(dataInput.umur);
            }
            hasilKalkulasi = kalkulasiGiziTotal(dataInput);
        } catch (err) {
            return res.status(400).json({ status: 'error', message: err.message });
        }

        if (!hasilKalkulasi || !hasilKalkulasi.data_simpan) {
            return res.status(500).json({ status: 'error', message: 'Hasil kalkulasi tidak valid' });
        }

        let diagnosa_string = Array.isArray(dataInput.diagnosa_penyakit) 
            ? dataInput.diagnosa_penyakit.join(', ') 
            : dataInput.diagnosa_penyakit;

        if (diagnosa_string && diagnosa_string.includes('Mifflin') && dataInput.penyakit_lainnya) {
            diagnosa_string = diagnosa_string.replace('Mifflin', `Mifflin (${dataInput.penyakit_lainnya})`);
        }

        const dataUpdate = {
            berat_badan_saat_dihitung: dataInput.berat_badan,
            tinggi_badan_saat_dihitung: dataInput.tinggi_badan,
            diagnosa_penyakit_saat_dihitung: diagnosa_string, 
            berat_badan_ideal: hasilKalkulasi.data_simpan.berat_badan_ideal,
            kebutuhan_energi_total: hasilKalkulasi.data_simpan.kebutuhan_energi_total,
            protein_gram: hasilKalkulasi.data_simpan.protein_gram,
            lemak_gram: hasilKalkulasi.data_simpan.lemak_gram,
            karbohidrat_gram: hasilKalkulasi.data_simpan.karbohidrat_gram,
            protein_persen: hasilKalkulasi.data_simpan.protein_persen,
            lemak_persen: hasilKalkulasi.data_simpan.lemak_persen,
            karbohidrat_persen: hasilKalkulasi.data_simpan.karbohidrat_persen,
            faktor_stres: dataInput.faktor_stres || 'Normal',
            aktivitas_fisik: dataInput.aktivitas_fisik || 'Bed rest',
            bmr: hasilKalkulasi.data_simpan.bmr,
            faktor_aktivitas_nilai: hasilKalkulasi.data_simpan.faktor_aktivitas_nilai,
            faktor_stres_nilai: hasilKalkulasi.data_simpan.faktor_stres_nilai
        };

        const isUpdated = await PerhitunganModel.updateById(id, dataUpdate);

        if (!isUpdated) {
            return res.status(400).json({ status: 'error', message: 'Gagal memperbarui data atau tidak ada perubahan' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Riwayat perhitungan berhasil diperbarui',
            data: { id_perhitungan: id }
        });

    } catch (error) {
        next(error);
    }
};

// ==========================================
// MENGHAPUS DATA RIWAYAT
// ==========================================
const deleteRiwayat = async (req, res, next) => {
    try {
        const { id } = req.params;
        const id_user_login = req.user.id_user; 

        const detailLama = await PerhitunganModel.findDetailById(id);
        if (!detailLama) {
            return res.status(404).json({ status: 'error', message: 'Gagal menghapus, data tidak ditemukan' });
        }

        if (detailLama.id_user !== id_user_login) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'Akses Ditolak! Anda hanya dapat menghapus perhitungan yang Anda buat sendiri.' 
            });
        }

        const isDeleted = await PerhitunganModel.deleteById(id);

        if (!isDeleted) {
            return res.status(400).json({ status: 'error', message: 'Gagal menghapus data dari database' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Riwayat perhitungan berhasil dihapus'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getRiwayat,
    getRiwayatDetail,
    updateRiwayat,
    deleteRiwayat
};