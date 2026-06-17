// ==========================================
// CONTROLLER: perhitunganController.js
// ==========================================

const db = require('../config/database');
const PerhitunganModel = require('../models/perhitunganModel');
const { kalkulasiGiziTotal, getKelompokUmur, hitungIMT } = require('../utils/rumusGizi');

/**
 * Fungsi Pembantu: Mengonversi string umur SIMRS (Th, Bl, Hr) menjadi angka desimal Tahun murni
 * Contoh: "6 Bl" -> 0.5 | "730 Hr" -> 2 | "25 Th" -> 25
 */
const konversiUmurKeTahun = (umurStr) => {
    if (!umurStr) return 0;
    
    const angka = parseFloat(umurStr);
    const teksUrutan = String(umurStr).toLowerCase();

    if (teksUrutan.includes('bl') || teksUrutan.includes('bulan')) {
        return parseFloat((angka / 12).toFixed(2)); // Konversi bulan ke tahun
    }
    if (teksUrutan.includes('hr') || teksUrutan.includes('hari')) {
        return parseFloat((angka / 365).toFixed(2)); // Konversi hari ke tahun
    }
    
    return angka; // Default jika "Th" atau angka murni
};

const previewPerhitungan = async (req, res, next) => {
    try {
        const dataInput = req.body;
        
        // 1. VALIDASI WAJIB: Pastikan ID Pasien dikirim
        if (!dataInput.id_pasien) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'ID Pasien (no_rawat) wajib diisi' 
            });
        }

        // 2. VALIDASI DATABASE: Cek tabel SIMRS (reg_periksa, kamar_inap, diagnosa_pasien)
        const queryCekPasien = `
            SELECT 
                rp.no_rawat, 
                COALESCE(ki.tgl_masuk, rp.tgl_registrasi) AS tgl_masuk, 
                dp.kd_penyakit 
            FROM reg_periksa rp
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
            WHERE rp.no_rawat = ?
        `;
        const [cekPasien] = await db.execute(queryCekPasien, [dataInput.id_pasien]);

        if (cekPasien.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: `Gagal! Pasien dengan No. Rawat ${dataInput.id_pasien} tidak ditemukan di database SIMRS` 
            });
        }

        // Gabungkan semua kode penyakit yang ditemukan dengan koma
        const gabunganKodePenyakit = cekPasien
            .map(row => row.kd_penyakit)
            .filter(Boolean) 
            .join(', ');

        const dataPasienSIMRS = cekPasien[0]; 

        // 3. KALKULASI GIZI
        if (dataInput.umur) {
            dataInput.umur = konversiUmurKeTahun(dataInput.umur);
            
            if (dataInput.umur < 18) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Perhitungan tidak dapat dilanjutkan karena pasien termasuk dalam kategori usia anak-anak (di bawah 18 tahun).'
                });
            }
        } else {
            return res.status(400).json({
                status: 'error',
                message: 'Umur pasien wajib diisi untuk melakukan perhitungan.'
            });
        }
        
        const hasilKalkulasi = kalkulasiGiziTotal(dataInput);

        if (dataInput.diagnosa_penyakit && dataInput.diagnosa_penyakit.includes('Mifflin') && dataInput.penyakit_lainnya) {
            hasilKalkulasi.penyakit_lainnya = dataInput.penyakit_lainnya;
        }

        // 4. PENYISIPAN DATA TAMBAHAN UNTUK UI FRONTEND
        hasilKalkulasi.kode_penyakit = gabunganKodePenyakit || '-';

        if (dataPasienSIMRS.tgl_masuk) {
            const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric' };
            const tglMasukObj = new Date(dataPasienSIMRS.tgl_masuk);
            hasilKalkulasi.tanggal_masuk_rapi = tglMasukObj.toLocaleDateString('id-ID', opsiTanggal);
        } else {
            hasilKalkulasi.tanggal_masuk_rapi = '-';
        }

        res.status(200).json({
            status: 'success',
            message: 'Preview perhitungan berhasil di-generate',
            data: hasilKalkulasi
        });

    } catch (error) {
        console.error("Error pada perhitungan:", error.message);
        return res.status(400).json({
            success: false,
            message: "Gagal menghitung gizi: " + error.message 
        });
    }
};

const simpanPerhitungan = async (req, res, next) => {
    try {
        const id_user = req.user.id_user; 
        
        const {
            id_pasien, umur, jenis_kelamin, berat_badan, tinggi_badan, ruang_bangsal,
            is_estimasi, lila_cm, ulna_cm, persen_lila,
            diagnosa_penyakit, penyakit_lainnya, aktivitas_fisik, status_hemodialisa, faktor_stres,
            kategori_penambahan_energi, metode_perhitungan,
            
            berat_badan_ideal, bmr, faktor_aktivitas_nilai, faktor_stres_nilai, penambahan_kalori,
            kebutuhan_energi_total, 
            protein_persen, lemak_persen, karbohidrat_persen,
            protein_gram, lemak_gram, karbohidrat_gram
        } = req.body;

        if (!id_pasien) {
            return res.status(400).json({ status: 'error', message: 'ID Pasien / No Rawat tidak ditemukan' });
        }

        // Target tabel validasi diubah ke reg_periksa
        const [cekPasien] = await db.execute('SELECT no_rawat FROM reg_periksa WHERE no_rawat = ?', [id_pasien]);
        
        if (cekPasien.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: `Gagal menyimpan! Pasien dengan No. Rawat ${id_pasien} tidak ditemukan di database SIMRS.` 
            });
        }

        const umurNumerikTahun = konversiUmurKeTahun(umur);

        if (umurNumerikTahun < 18) {
            return res.status(403).json({
                status: 'error',
                message: 'Data tidak dapat disimpan karena pasien termasuk dalam kategori usia anak-anak (di bawah 18 tahun).'
            });
        }

        const kelompok_umur = getKelompokUmur(umurNumerikTahun);
        const { nilaiIMT, statusGizi } = hitungIMT(berat_badan, tinggi_badan);
        
        let diagnosa_string = Array.isArray(diagnosa_penyakit) ? diagnosa_penyakit.join(', ') : diagnosa_penyakit;

        if (diagnosa_string.includes('Mifflin') && penyakit_lainnya) {
            diagnosa_string = diagnosa_string.replace('Mifflin', `Mifflin (${penyakit_lainnya})`);
        }

        const dataPerhitungan = {
            no_rawat: id_pasien, 
            id_user,
            umur_saat_dihitung: umurNumerikTahun, 
            kelompok_umur, 
            ruang_bangsal: ruang_bangsal || null,
            berat_badan_saat_dihitung: berat_badan,
            tinggi_badan_saat_dihitung: tinggi_badan,
            
            berat_badan_ideal: berat_badan_ideal || null,
            
            imt_saat_dihitung: nilaiIMT,
            status_gizi_saat_dihitung: statusGizi,
            
            is_estimasi: is_estimasi ? 1 : 0,
            lila_cm: lila_cm || null,
            ulna_cm: ulna_cm || null,
            persen_lila: persen_lila || null,
            
            diagnosa_penyakit_saat_dihitung: diagnosa_string,
            
            aktivitas_fisik: aktivitas_fisik || 'Bed rest',
            status_hemodialisa: status_hemodialisa || null,
            kategori_penambahan_energi: kategori_penambahan_energi || 'Tidak ada',
            metode_perhitungan: metode_perhitungan || 'Mifflin St Jeor',
            faktor_stres: faktor_stres || 'Normal',
            
            bmr, faktor_aktivitas_nilai, faktor_stres_nilai, penambahan_kalori,
            kebutuhan_energi_total, 
            
            protein_persen: protein_persen || null,
            lemak_persen: lemak_persen || null,
            karbohidrat_persen: karbohidrat_persen || null,
            
            protein_gram, lemak_gram, karbohidrat_gram
        };

        const insertId = await PerhitunganModel.simpan(dataPerhitungan);

        res.status(201).json({
            status: 'success',
            message: 'Riwayat perhitungan gizi medis berhasil disimpan permanen',
            data: { id_perhitungan: insertId }
        });

    } catch (error) {
        next(error);
    }
};

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

        // JOIN disesuaikan dengan SIMRS
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

        // JOIN disesuaikan dengan SIMRS dan penambahan diagnosa_pasien
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
    previewPerhitungan, 
    simpanPerhitungan,
    getRiwayat,
    getRiwayatDetail,
    updateRiwayat,
    deleteRiwayat
};