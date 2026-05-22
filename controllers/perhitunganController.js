// ==========================================
// CONTROLLER: perhitunganController.js
// ==========================================

const db = require('../config/database');
const PerhitunganModel = require('../models/perhitunganModel');
const { kalkulasiGiziTotal, getKelompokUmur, hitungIMT } = require('../utils/rumusGizi');

const previewPerhitungan = (req, res, next) => {
    try {
        // req.body berisi data form dari halaman Assessment
        const dataInput = req.body;
        
        // Memanggil fungsi kalkulasi utama
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
            // id_pasien dari frontend sekarang berisi data no_rawat dari SIMRS (Contoh: '2023/01/01/000002')
            id_pasien, umur, jenis_kelamin, berat_badan, tinggi_badan, ruang_bangsal,
            
            // Data Estimasi (Jika Ada)
            is_estimasi, lila_cm, ulna_cm, persen_lila,
            
            // Data Klinis
            diagnosa_penyakit, aktivitas_fisik, status_hemodialisa, faktor_stres,
            kategori_penambahan_energi, metode_perhitungan,
            
            // Hasil Kalkulasi (dari response preview)
            bmr, faktor_aktivitas_nilai, faktor_stres_nilai, penambahan_kalori,
            kebutuhan_energi_total, protein_gram, lemak_gram, karbohidrat_gram
        } = req.body;

        if (!id_pasien) {
            return res.status(400).json({ status: 'error', message: 'ID Pasien / No Rawat tidak ditemukan' });
        }

        // Generate data otomatis
        const kelompok_umur = getKelompokUmur(umur);
        const { nilaiIMT, statusGizi } = hitungIMT(berat_badan, tinggi_badan);
        
        // Memastikan diagnosa penyakit yang dikirim adalah string
        const diagnosa_string = Array.isArray(diagnosa_penyakit) ? diagnosa_penyakit.join(', ') : diagnosa_penyakit;

        // Susun objek data 
        const dataPerhitungan = {
            no_rawat: id_pasien, // <--- DIMAPPING KE SINI AGAR SESUAI DENGAN TABEL SIMRS
            id_user,
            umur_saat_dihitung: umur,
            kelompok_umur, 
            ruang_bangsal: ruang_bangsal || null,
            berat_badan_saat_dihitung: berat_badan,
            tinggi_badan_saat_dihitung: tinggi_badan,
            imt_saat_dihitung: nilaiIMT,
            status_gizi_saat_dihitung: statusGizi,
            
            is_estimasi: is_estimasi ? 1 : 0,
            lila_cm: lila_cm || null,
            ulna_cm: ulna_cm || null,
            persen_lila: persen_lila || null,
            
            diagnosa_penyakit_saat_dihitung: diagnosa_string,
            
            // PENYEMPURNAAN: Ditambahkan fallback ('Bed rest' dan 'Normal') agar sesuai dengan ENUM database NOT NULL
            aktivitas_fisik: aktivitas_fisik || 'Bed rest',
            status_hemodialisa: status_hemodialisa || null,
            kategori_penambahan_energi: kategori_penambahan_energi || 'Tidak ada',
            metode_perhitungan: metode_perhitungan || 'Mifflin St Jeor',
            faktor_stres: faktor_stres || 'Normal',
            
            bmr, faktor_aktivitas_nilai, faktor_stres_nilai, penambahan_kalori,
            kebutuhan_energi_total, protein_gram, lemak_gram, karbohidrat_gram
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

/**
 * 3. MENGAMBIL SEMUA RIWAYAT (DENGAN FILTER)
 */
const getRiwayat = async (req, res, next) => {
    try {
        // Menangkap filter dari query URL frontend (contoh: ?search=budi&penyakit=DM)
        const filters = {
            search: req.query.search || '',
            penyakit: req.query.penyakit || '',
            tanggal: req.query.tanggal || ''
        };

        const dataRiwayat = await PerhitunganModel.findAllRiwayat(filters);

        res.status(200).json({
            status: 'success',
            message: 'Data riwayat berhasil diambil',
            data: dataRiwayat
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 4. MENGAMBIL DETAIL SATU RIWAYAT
 */
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

/**
 * 5. MENGHAPUS RIWAYAT PERHITUNGAN
 */
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