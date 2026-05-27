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

        // 2. VALIDASI DATABASE: Cek apakah no_rawat tersebut benar-benar ada di tabel pasien
        const [cekPasien] = await db.execute('SELECT no_rawat FROM pasien WHERE no_rawat = ?', [dataInput.id_pasien]);
        
        if (cekPasien.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: `Gagal! Pasien dengan No. Rawat ${dataInput.id_pasien} tidak ditemukan di database SIMRS` 
            });
        }

        // 3. KALKULASI GIZI (Hanya berjalan jika pasien valid)
        // SINKRONISASI UMUR: Konversi unit umur sebelum kalkulasi rumus gizi dilakukan
        if (dataInput.umur) {
            dataInput.umur = konversiUmurKeTahun(dataInput.umur);
            
            // VALIDASI EKSTRA: Tolak jika umur yang diinput manual ternyata anak-anak (< 18 tahun)
            if (dataInput.umur < 18) {
                return res.status(403).json({
                    status: 'error',
                    message: 'Perhitungan tidak dapat dilanjutkan karena pasien termasuk dalam kategori usia anak-anak (di bawah 18 tahun).'
                });
            }
        } else {
            // Validasi jika field umur sama sekali tidak diisi (kosong)
            return res.status(400).json({
                status: 'error',
                message: 'Umur pasien wajib diisi untuk melakukan perhitungan.'
            });
        }
        
        const hasilKalkulasi = kalkulasiGiziTotal(dataInput);

        res.status(200).json({
            status: 'success',
            message: 'Preview perhitungan berhasil di-generate',
            data: hasilKalkulasi
        });
    } catch (error) {
        next(error);
    }
};

const simpanPerhitungan = async (req, res, next) => {
    try {
        const id_user = req.user.id_user; 
        
        const {
            id_pasien, umur, jenis_kelamin, berat_badan, tinggi_badan, ruang_bangsal,
            is_estimasi, lila_cm, ulna_cm, persen_lila,
            diagnosa_penyakit, aktivitas_fisik, status_hemodialisa, faktor_stres,
            kategori_penambahan_energi, metode_perhitungan,
            
            berat_badan_ideal, bmr, faktor_aktivitas_nilai, faktor_stres_nilai, penambahan_kalori,
            kebutuhan_energi_total, 
            protein_persen, lemak_persen, karbohidrat_persen,
            protein_gram, lemak_gram, karbohidrat_gram
        } = req.body;

        if (!id_pasien) {
            return res.status(400).json({ status: 'error', message: 'ID Pasien / No Rawat tidak ditemukan' });
        }

        // =========================================================================
        // VALIDASI DATABASE: Pastikan no_rawat benar-benar ada di tabel pasien
        // =========================================================================
        const [cekPasien] = await db.execute('SELECT no_rawat FROM pasien WHERE no_rawat = ?', [id_pasien]);
        
        if (cekPasien.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: `Gagal menyimpan! Pasien dengan No. Rawat ${id_pasien} tidak ditemukan di database.` 
            });
        }
        // =========================================================================

        // SINKRONISASI UMUR: Ubah ke nominal tahun numerik untuk kalkulasi akurat internal backend
        const umurNumerikTahun = konversiUmurKeTahun(umur);

        // VALIDASI EKSTRA: Cegah penyimpanan jika data umur di bawah 18 tahun
        if (umurNumerikTahun < 18) {
            return res.status(403).json({
                status: 'error',
                message: 'Data tidak dapat disimpan karena pasien termasuk dalam kategori usia anak-anak (di bawah 18 tahun).'
            });
        }

        const kelompok_umur = getKelompokUmur(umurNumerikTahun);
        const { nilaiIMT, statusGizi } = hitungIMT(berat_badan, tinggi_badan);
        
        const diagnosa_string = Array.isArray(diagnosa_penyakit) ? diagnosa_penyakit.join(', ') : diagnosa_penyakit;

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
        // 1. Ambil query parameter pagination & filter dari Frontend
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const search = req.query.search || '';
        const penyakit = req.query.penyakit || '';
        const tanggal = req.query.tanggal || '';

        // 2. Buat klausa WHERE dinamis berdasarkan filter
        let whereClause = 'WHERE 1=1';
        const queryParams = [];

        // Cari berdasarkan Nama Pasien atau No. RM
        if (search) {
            whereClause += ` AND (p.nm_pasien LIKE ? OR p.no_rkm_medis LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // Filter rumpun penyakit terhitung
        if (penyakit && penyakit !== 'Semua Penyakit') {
            // 1. Pecah string "CHF, DM" menjadi array ['CHF', 'DM']
            const arrayPenyakit = penyakit.split(',').map(item => item.trim()).filter(item => item !== '');
    
            // 2. Buat kondisi LIKE untuk setiap penyakit yang dicari
            arrayPenyakit.forEach(namaPenyakit => {
                whereClause += ` AND pg.diagnosa_penyakit_saat_dihitung LIKE ?`;
                queryParams.push(`%${namaPenyakit}%`);
            });
        }

        // Filter tanggal input riwayat gizi
        // SESUDAH:
        if (tanggal) {
            whereClause += ` AND DATE(pg.tanggal_perhitungan) = ?`;
            queryParams.push(tanggal);
        }

        // 3. Hitung total data yang cocok (untuk keperluan kontrol pagination)
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM perhitungan_gizi pg
            JOIN pasien p ON pg.no_rawat = p.no_rawat
            ${whereClause}
        `;
        const [[countResult]] = await db.execute(countQuery, queryParams);
        const totalData = countResult.total;

        // 4. Ambil data ringkas (Brief) sesuai layout tabel halaman histori UI
        const dataQuery = `
            SELECT 
                pg.id_perhitungan,
                p.nm_pasien AS nama_pasien,
                p.no_rkm_medis AS no_rm,
                pg.diagnosa_penyakit_saat_dihitung AS penyakit,
                pg.kebutuhan_energi_total AS total_energi,
                pg.tanggal_perhitungan 
            FROM perhitungan_gizi pg
            JOIN pasien p ON pg.no_rawat = p.no_rawat
            ${whereClause}
            ORDER BY pg.id_perhitungan DESC
            LIMIT ? OFFSET ?
        `;

        const finalQueryParams = [...queryParams, limit.toString(), offset.toString()];
        const [rows] = await db.execute(dataQuery, finalQueryParams);

        // 5. Format hasil agar sesuai dengan komponen kartu/tabel UI
        const formattedRiwayat = rows.map(item => {
            const dateObj = new Date(item.tanggal_perhitungan);
            const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric' };
            const tanggalRapi = dateObj.toLocaleDateString('id-ID', opsiTanggal);

            return {
                id_perhitungan: item.id_perhitungan,
                nama_pasien: item.nama_pasien,
                no_rm: item.no_rm, // Menampilkan No RM di bawah nama sesuai rekomendasi klinis
                penyakit: item.penyakit,
                total_energi: Math.round(item.total_energi), // Dibulatkan tanpa desimal agar rapi di list brief
                tanggal_perhitungan: tanggalRapi,
                status: "Tersimpan" // Label status pelaporan fungsional
            };
        });

        // 6. Kirim response terstruktur
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

        res.status(200).json({
            status: 'success',
            data: detail
        });
    } catch (error) {
        next(error);
    }
};

const deleteRiwayat = async (req, res, next) => {
    try {
        const { id } = req.params;
        const isDeleted = await PerhitunganModel.deleteById(id);

        if (!isDeleted) {
            return res.status(404).json({ status: 'error', message: 'Gagal menghapus, data tidak ditemukan' });
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
    deleteRiwayat
};