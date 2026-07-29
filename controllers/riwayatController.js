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

const perbaikiZonaWaktu = (tanggalDariDB) => {
    if (!tanggalDariDB) return null;
    const d = new Date(tanggalDariDB);
    return new Date(Date.UTC(
        d.getFullYear(), d.getMonth(), d.getDate(),
        d.getHours(), d.getMinutes(), d.getSeconds()
    ));
};

// ==========================================
// MENGAMBIL DAFTAR RIWAYAT
// ==========================================
const getRiwayat = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || '';
        const penyakit = req.query.penyakit || '';
        const filter_user = req.query.filter_user || 'all'; 
        const ruangan = req.query.ruangan || ''; 
        
        // Filter Range Tanggal
        const tanggal_awal = req.query.tanggal_awal || req.query.tanggal || '';
        const tanggal_akhir = req.query.tanggal_akhir || '';

        const id_user_login = req.user.id_user; 

        let whereClause = 'WHERE 1=1';
        const queryParams = [];

        // Filter berdasarkan User spesifik atau User saat ini (me)
        if (filter_user !== 'all' && filter_user !== '') {
            whereClause += ` AND pg.id_user = ?`;
            queryParams.push(filter_user === 'me' ? id_user_login : filter_user);
        }

        if (search) {
            whereClause += ` AND (p.nm_pasien LIKE ? OR p.no_rkm_medis LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // Multiple choice Penyakit & Include Mifflin/Critical Ill
        if (penyakit && penyakit !== 'Semua Penyakit') {
            const arrayPenyakit = penyakit.split(',').map(item => item.trim()).filter(item => item !== '');
            arrayPenyakit.forEach(namaPenyakit => {
                whereClause += ` AND (pg.diagnosa_penyakit_saat_dihitung LIKE ? OR pg.metode_perhitungan LIKE ?)`;
                queryParams.push(`%${namaPenyakit}%`, `%${namaPenyakit}%`);
            });
        }

        // Filter Ruangan
        if (ruangan) {
            whereClause += ` AND b.nm_bangsal LIKE ?`;
            queryParams.push(`%${ruangan}%`);
        }

        // Logic untuk Range Tanggal
        if (tanggal_awal && tanggal_akhir) {
            whereClause += ` AND DATE(pg.tanggal_perhitungan) BETWEEN ? AND ?`;
            queryParams.push(tanggal_awal, tanggal_akhir);
        } else if (tanggal_awal) {
            whereClause += ` AND DATE(pg.tanggal_perhitungan) = ?`;
            queryParams.push(tanggal_awal);
        }

        // LIMITASI VERSI: Hanya mengambil record terbaru dari masing-masing grup (parent_id)
        whereClause += ` AND pg.id_perhitungan IN (
            SELECT max_id FROM (
                SELECT MAX(id_perhitungan) AS max_id 
                FROM perhitungan_gizi 
                GROUP BY COALESCE(parent_id, id_perhitungan)
            ) AS temp
        )`;

        const countQuery = `
            SELECT COUNT(DISTINCT pg.id_perhitungan) AS total
            FROM perhitungan_gizi pg
            JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            JOIN users u ON pg.id_user = u.id_user
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
            LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
            LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
            ${whereClause}
        `;
        const [[countResult]] = await db.execute(countQuery, queryParams);
        const totalData = countResult.total;

        const dataQuery = `
            SELECT 
                pg.id_perhitungan,
                pg.id_user,
                pg.versi,
                MAX(p.nm_pasien) AS nama_pasien,
                MAX(p.no_rkm_medis) AS no_rm,
                MAX(p.jk) AS jenis_kelamin,
                MAX(b.nm_bangsal) AS ruangan, 
                GROUP_CONCAT(DISTINCT dp.kd_penyakit SEPARATOR ', ') AS kode_penyakit,
                pg.diagnosa_penyakit_saat_dihitung AS penyakit,
                pg.kebutuhan_energi_total AS total_energi,
                pg.protein_gram, 
                pg.lemak_gram, 
                pg.karbohidrat_gram,
                pg.tanggal_perhitungan,
                MAX(u.nama_lengkap) AS created_by
            FROM perhitungan_gizi pg
            JOIN reg_periksa rp ON pg.no_rawat = rp.no_rawat
            JOIN pasien p ON rp.no_rkm_medis = p.no_rkm_medis
            JOIN users u ON pg.id_user = u.id_user
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN kamar k ON ki.kd_kamar = k.kd_kamar
            LEFT JOIN bangsal b ON k.kd_bangsal = b.kd_bangsal
            LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
            ${whereClause}
            GROUP BY pg.id_perhitungan
            ORDER BY pg.tanggal_perhitungan DESC
            LIMIT ? OFFSET ?
        `;

        const finalQueryParams = [...queryParams, limit.toString(), offset.toString()];
        const [rows] = await db.execute(dataQuery, finalQueryParams);

        const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' };
        const opsiJam = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' };

        const formattedRiwayat = rows.map(item => {
            const dateObj = perbaikiZonaWaktu(item.tanggal_perhitungan);
            const tanggalRapi = dateObj.toLocaleDateString('id-ID', opsiTanggal);
            const jamRapi = dateObj.toLocaleTimeString('id-ID', opsiJam).replace(/\./g, ':');

            return {
                id_perhitungan: item.id_perhitungan,
                versi: item.versi || 1, 
                nama_pasien: item.nama_pasien,
                no_rm: item.no_rm, 
                jenis_kelamin: item.jenis_kelamin, 
                ruangan: item.ruangan || 'Poli / Rawat Jalan', 
                kode_penyakit: item.kode_penyakit || '-', 
                penyakit: item.penyakit,
                total_energi: Math.round(item.total_energi), 
                makronutrien: { 
                    protein: parseFloat(item.protein_gram) || 0,
                    lemak: parseFloat(item.lemak_gram) || 0,
                    karbohidrat: parseFloat(item.karbohidrat_gram) || 0 
                },
                tanggal_perhitungan: tanggalRapi,
                jam_perhitungan: jamRapi,
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
// MENGAMBIL DAFTAR VERSI DARI 1 RIWAYAT (GITHUB-STYLE)
// ==========================================
const getRiwayatVersions = async (req, res, next) => {
    try {
        const { id } = req.params;

        const targetDetail = await PerhitunganModel.findDetailById(id);
        if (!targetDetail) {
            return res.status(404).json({ status: 'error', message: 'Data riwayat tidak ditemukan' });
        }

        const parentId = targetDetail.parent_id || targetDetail.id_perhitungan;
        const versions = await PerhitunganModel.findVersionsByParentId(parentId);

        const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' };
        const opsiJam = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' };
        
        const formattedVersions = versions.map(item => {
            const dateObj = perbaikiZonaWaktu(item.tanggal_perhitungan);
            const tanggalRapi = dateObj.toLocaleDateString('id-ID', opsiTanggal);
            const jamRapi = dateObj.toLocaleTimeString('id-ID', opsiJam).replace(/\./g, ':');
            
            return {
                id_perhitungan: item.id_perhitungan,
                versi: item.versi || 1,
                nama_pasien: item.nama_pasien,
                jenis_kelamin: item.jenis_kelamin,
                kode_penyakit: item.kode_penyakit || '-',
                penyakit: item.diagnosa_penyakit_saat_dihitung,
                total_energi: Math.round(item.kebutuhan_energi_total),
                makronutrien: {
                    protein: parseFloat(item.protein_gram) || 0,
                    lemak: parseFloat(item.lemak_gram) || 0,
                    karbohidrat: parseFloat(item.karbohidrat_gram) || 0
                },
                tanggal_perhitungan: tanggalRapi,
                jam_perhitungan: jamRapi,
                created_by: item.nama_pembuat,
                is_mine: item.id_user === req.user.id_user
            };
        });

        const patientInfo = {
            nama_pasien: targetDetail.nama_pasien,
            no_rm: targetDetail.no_rm,
            kode_penyakit: targetDetail.kode_penyakit || '-',
            umur: targetDetail.umur_saat_dihitung + ' ' + targetDetail.kelompok_umur,
            jenis_kelamin: targetDetail.jenis_kelamin,
            tanggal_masuk: targetDetail.tanggal_masuk ? perbaikiZonaWaktu(targetDetail.tanggal_masuk).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric', timeZone: 'Asia/Jakarta'}) : '-',
            tanggal_perhitungan_terakhir: `${formattedVersions[0].tanggal_perhitungan} ${formattedVersions[0].jam_perhitungan}` 
        };

        res.status(200).json({
            status: 'success',
            message: 'Daftar versi riwayat berhasil diambil',
            data: {
                info_pasien: patientInfo,
                versi_riwayat: formattedVersions
            }
        });

    } catch (error) {
        next(error);
    }
};


// ==========================================
// MENGAMBIL DETAIL SATU RIWAYAT (Per Versi)
// ==========================================
const getRiwayatDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const detail = await PerhitunganModel.findDetailById(id);

        if (!detail) {
            return res.status(404).json({ status: 'error', message: 'Data riwayat tidak ditemukan' });
        }

        const opsiTanggalSaja = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' };
        const opsiJamSaja = { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' };

        if (detail.tanggal_masuk) {
            const tglMasukObj = perbaikiZonaWaktu(detail.tanggal_masuk);
            detail.tanggal_masuk_rapi = tglMasukObj.toLocaleDateString('id-ID', opsiTanggalSaja);
        }

        if (detail.tanggal_perhitungan) {
            const tglHitungObj = perbaikiZonaWaktu(detail.tanggal_perhitungan);
            detail.tanggal_perhitungan_rapi = tglHitungObj.toLocaleDateString('id-ID', opsiTanggalSaja);
            detail.jam_perhitungan = tglHitungObj.toLocaleTimeString('id-ID', opsiJamSaja).replace(/\./g, ':');
        }

        detail.ruangan = detail.ruangan || 'Poli / Rawat Jalan';
        detail.versi = detail.versi || 1; 

        res.status(200).json({
            status: 'success',
            data: detail
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// MENGUPDATE RIWAYAT
// ==========================================
const updateRiwayat = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dataInput = req.body;
        
        const id_user_login = req.user.id_user; 
        const user_role = req.user.role; 

        const detailLama = await PerhitunganModel.findDetailById(id);
        if (!detailLama) {
            return res.status(404).json({ status: 'error', message: 'Data riwayat tidak ditemukan' });
        }

        if (detailLama.id_user !== id_user_login && user_role !== 'admin') {
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

        const parentId = detailLama.parent_id || detailLama.id_perhitungan;
        const versiBaru = (detailLama.versi || 1) + 1;

        const dataInsert = {
            no_rawat: detailLama.no_rawat,
            id_user: id_user_login,
            umur_saat_dihitung: detailLama.umur_saat_dihitung,
            kelompok_umur: detailLama.kelompok_umur,
            ruang_bangsal: detailLama.ruang_bangsal,
            berat_badan_saat_dihitung: dataInput.berat_badan,
            tinggi_badan_saat_dihitung: dataInput.tinggi_badan,
            berat_badan_ideal: hasilKalkulasi.data_simpan.berat_badan_ideal,
            is_estimasi: detailLama.is_estimasi,
            lila_cm: detailLama.lila_cm,
            ulna_cm: detailLama.ulna_cm,
            imt_saat_dihitung: detailLama.imt_saat_dihitung,
            status_gizi_saat_dihitung: detailLama.status_gizi_saat_dihitung,
            diagnosa_penyakit_saat_dihitung: diagnosa_string, 
            aktivitas_fisik: dataInput.aktivitas_fisik || 'Bed rest',
            faktor_stres: dataInput.faktor_stres || 'Normal',
            status_hemodialisa: detailLama.status_hemodialisa,
            kategori_penambahan_energi: detailLama.kategori_penambahan_energi,
            penambahan_kalori: detailLama.penambahan_kalori,
            metode_perhitungan: detailLama.metode_perhitungan,
            bmr: hasilKalkulasi.data_simpan.bmr,
            faktor_aktivitas_nilai: hasilKalkulasi.data_simpan.faktor_aktivitas_nilai,
            faktor_stres_nilai: hasilKalkulasi.data_simpan.faktor_stres_nilai,
            kebutuhan_energi_total: hasilKalkulasi.data_simpan.kebutuhan_energi_total,
            protein_persen: hasilKalkulasi.data_simpan.protein_persen,
            protein_gram: hasilKalkulasi.data_simpan.protein_gram,
            lemak_persen: hasilKalkulasi.data_simpan.lemak_persen,
            lemak_gram: hasilKalkulasi.data_simpan.lemak_gram,
            karbohidrat_persen: hasilKalkulasi.data_simpan.karbohidrat_persen,
            karbohidrat_gram: hasilKalkulasi.data_simpan.karbohidrat_gram,
            parent_id: parentId,
            versi: versiBaru
        };

        const newId = await PerhitunganModel.insertNewVersion(dataInsert);

        if (!newId) {
            return res.status(400).json({ status: 'error', message: 'Gagal membuat versi pembaruan' });
        }

        res.status(200).json({
            status: 'success',
            message: `Riwayat perhitungan berhasil diperbarui (Versi ${versiBaru})`,
            data: { id_perhitungan: newId }
        });

    } catch (error) {
        next(error);
    }
};

// ==========================================
// MENGHAPUS DATA RIWAYAT (Hapus 1 Versi Spesifik)
// ==========================================
const deleteRiwayat = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const id_user_login = req.user.id_user; 
        const user_role = req.user.role; 

        const detailLama = await PerhitunganModel.findDetailById(id);
        if (!detailLama) {
            return res.status(404).json({ status: 'error', message: 'Gagal menghapus, data tidak ditemukan' });
        }

        if (detailLama.id_user !== id_user_login && user_role !== 'admin') {
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
            message: 'Versi riwayat perhitungan berhasil dihapus permanen'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getRiwayat,
    getRiwayatVersions,
    getRiwayatDetail,
    updateRiwayat,
    deleteRiwayat
};