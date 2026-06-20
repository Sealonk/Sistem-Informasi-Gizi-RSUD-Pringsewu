// ==========================================
// CONTROLLER: pasienController.js
// ==========================================

const PasienModel = require('../models/pasienModel'); // Import Model Pengganti Query Langsung
const { getKelompokUmur, hitungIMT } = require('../utils/sharedRumus');

// ==========================================
// FUNGSI: MENGAMBIL DAFTAR RUANGAN DINAMIS
// ==========================================
const getDaftarRuangan = async (req, res, next) => {
    try {
        const rows = await PasienModel.getAllBangsal();
        res.status(200).json({
            status: 'success',
            message: 'Daftar ruangan berhasil diambil',
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// FUNGSI: LIST ALL PASIEN (DENGAN FILTER & BACK-CHECK DATA)
// ==========================================
const getAllPasien = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const search = req.query.search || '';
        const periode = req.query.periode || ''; 
        const startDate = req.query.startDate || '';
        const endDate = req.query.endDate || '';
        const status_perhitungan = req.query.status_perhitungan || '';
        const ruangan = req.query.ruangan || '';
        const status_pulang = req.query.status_pulang || '';

        // 1. Pembuatan parameter WHERE dinamis untuk diserahkan ke model
        let whereClause = '';
        const queryParams = [];

        if (search) {
            whereClause += ` AND (p.nm_pasien LIKE ? OR p.no_rkm_medis LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        const dateColumn = `COALESCE(ki.tgl_masuk, rp.tgl_registrasi)`;
        if (periode === 'hari_ini') {
            whereClause += ` AND DATE(${dateColumn}) = CURDATE()`;
        } else if (periode === 'minggu_ini') {
            whereClause += ` AND YEARWEEK(${dateColumn}, 1) = YEARWEEK(CURDATE(), 1)`;
        } else if (periode === 'bulan_ini') {
            whereClause += ` AND MONTH(${dateColumn}) = MONTH(CURDATE()) AND YEAR(${dateColumn}) = YEAR(CURDATE())`;
        } else if (periode === 'custom' && startDate && endDate) {
            whereClause += ` AND DATE(${dateColumn}) BETWEEN ? AND ?`;
            queryParams.push(startDate, endDate);
        }

        if (ruangan) {
            whereClause += ` AND b.nm_bangsal = ?`;
            queryParams.push(ruangan);
        }

        if (status_pulang === 'sudah') {
            whereClause += ` AND ki.tgl_keluar IS NOT NULL`;
        } else if (status_pulang === 'belum') {
            whereClause += ` AND ki.tgl_keluar IS NULL AND ki.no_rawat IS NOT NULL`;
        } else if (status_pulang === 'rawat_jalan') {
            whereClause += ` AND ki.no_rawat IS NULL`;
        }

        let validPasienFilter = '';
        if (status_perhitungan === 'sudah') {
            validPasienFilter = 'WHERE id_perhitungan IS NOT NULL';
        } else if (status_perhitungan === 'belum') {
            validPasienFilter = 'WHERE id_perhitungan IS NULL';
        }

        // 2. Eksekusi query via pemanggilan Fungsi Model
        const statsData = await PasienModel.getStats(whereClause, queryParams, validPasienFilter);
        const totalDitemukan = await PasienModel.countAll(whereClause, queryParams, validPasienFilter);
        const rowsPasien = await PasienModel.findAll(whereClause, queryParams, validPasienFilter, limit, offset);

        if (search && rowsPasien.length === 0) {
            const suspect = await PasienModel.checkPediatricSuspect(search);
            if (suspect) {
                const isBulanAtauHari = suspect.sttsumur.toLowerCase().includes('bl') || suspect.sttsumur.toLowerCase().includes('hr');
                const isAnakAnak = isBulanAtauHari || (suspect.sttsumur.toLowerCase().includes('th') && parseInt(suspect.umurdaftar) < 18);
                if (isAnakAnak) return res.status(403).json({ status: 'error', message: 'Pasien ditemukan, namun sistem belum mendukung kategori pediatri (anak-anak).' });
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

            let waktu_pembaruan_rapi = null;
            if (item.waktu_pembaruan) {
                const tglObj = new Date(item.waktu_pembaruan);
                waktu_pembaruan_rapi = `${tglObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, ${tglObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
            }

            let status_pulang_text = '-';
            if (!item.tgl_masuk_inap) {
                status_pulang_text = 'Rawat Jalan (Poli)';
            } else if (item.tgl_keluar) {
                status_pulang_text = 'Sudah Pulang';
            } else {
                status_pulang_text = 'Masih Dirawat';
            }

            return {
                id_pasien: item.id_pasien, 
                nama_pasien: item.nama_pasien,
                no_rm: item.no_rm,
                umur: `${item.umurdaftar} ${item.sttsumur}`,
                jenis_kelamin: item.jenis_kelamin,
                tanggal_masuk: item.tanggal_masuk,
                ruangan: item.ruangan || 'Poli / Rawat Jalan',
                status_pulang: status_pulang_text,
                tanggal_keluar: item.tgl_keluar || null,
                diagnosis: penyakitArr.join(' + '),
                diagnosis_array: penyakitArr,
                penyakit_lainnya: penyakitLainnya,
                nama_penyakit_asli: item.nama_penyakit_asli,
                status_perhitungan: item.id_perhitungan ? 'Sudah Dihitung' : 'Belum',
                id_perhitungan: item.id_perhitungan || null, 
                waktu_pembaruan: waktu_pembaruan_rapi,
                
                // [NILAI BARU]: Diperlukan frontend untuk mendeteksi apakah pasien punya kunjungan lama
                total_riwayat_lampau: parseInt(item.total_riwayat_lampau) || 0
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
                    total_ditemukan: totalDitemukan,
                    halaman_sekarang: page,
                    limit_per_halaman: limit
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// FUNGSI: GET DETAIL PASIEN BY NO_RAWAT
// ==========================================
const getPasienById = async (req, res, next) => {
    try {
        const { id } = req.params; 

        // Eksekusi fungsi pencarian data detail via model
        const pasien = await PasienModel.findById(id);

        if (!pasien) return res.status(404).json({ status: 'error', message: 'Data pasien tidak ditemukan di SIMRS' });

        const isBulanAtauHari = pasien.sttsumur.toLowerCase().includes('bl') || pasien.sttsumur.toLowerCase().includes('hr');
        const isAnakAnak = isBulanAtauHari || (pasien.sttsumur.toLowerCase().includes('th') && parseInt(pasien.umurdaftar) < 18);

        if (isAnakAnak) return res.status(403).json({ status: 'error', message: 'Pasien ditemukan, namun sistem belum mendukung kategori pediatri.' });

        // [LOGIKA INTERKONEKSI BARU]: Tarik rekam medis gizi lampau miliknya berdasarkan Nomor Rekam Medis
        const riwayatLampauRaw = await PasienModel.findHistoryByNoRm(pasien.no_rm, id);
        
        const riwayatLampauFormatted = riwayatLampauRaw.map(h => {
            const tglObj = new Date(h.tanggal_perhitungan);
            return {
                id_perhitungan: h.id_perhitungan,
                no_rawat: h.no_rawat,
                tanggal_hitung: tglObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                status_gizi: h.status_gizi,
                energi_kkal: Math.round(h.energi),
                ruangan: h.ruangan || 'Poli / Rawat Jalan',
                penyakit: h.penyakit
            };
        });

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

        let waktu_pembaruan_rapi = null;
        if (pasien.waktu_pembaruan) {
            const tglObj = new Date(pasien.waktu_pembaruan);
            waktu_pembaruan_rapi = `${tglObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, ${tglObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        let status_pulang_text = '-';
        if (!pasien.tgl_masuk_inap) {
            status_pulang_text = 'Rawat Jalan (Poli)';
        } else if (pasien.tgl_keluar) {
            status_pulang_text = 'Sudah Pulang';
        } else {
            status_pulang_text = 'Masih Dirawat';
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
                ruangan: pasien.ruangan || 'Poli / Rawat Jalan',
                status_pulang: status_pulang_text,
                tanggal_keluar: pasien.tgl_keluar || null,
                diagnosis: diagnosa_array.length > 0 ? diagnosa_array.join(' + ') : '-',
                diagnosa_kategori: diagnosa_array,
                penyakit_lainnya: penyakitLainnya,
                nama_penyakit_asli: pasien.nama_penyakit_asli,
                status_perhitungan: pasien.id_perhitungan ? 'Sudah Dihitung' : 'Belum',
                id_perhitungan: pasien.id_perhitungan || null,
                waktu_pembaruan: waktu_pembaruan_rapi,
                
                // [ARRAY BARU]: Dikirim ke frontend untuk me-render riwayat rekam medis lama pasien
                riwayat_perhitungan_lampau: riwayatLampauFormatted
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllPasien, getPasienById, getDaftarRuangan };