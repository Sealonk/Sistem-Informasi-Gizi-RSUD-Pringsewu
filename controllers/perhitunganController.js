const db = require('../config/database');
const PerhitunganModel = require('../models/perhitunganModel');
const { kalkulasiGiziTotal, getKelompokUmur, hitungIMT } = require('../utils/rumusGizi');

/**
 * 1. PREVIEW PERHITUNGAN
 * Fungsi ini dipanggil secara real-time saat user berada di "Step 8: Preview".
 * Tidak menyimpan data ke database, hanya mengembalikan hasil kalkulasi matematika.
 */
const previewPerhitungan = (req, res, next) => {
    try {
        const dataInput = req.body;

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

/**
 * 2. SIMPAN PERHITUNGAN
 * Fungsi ini dipanggil saat tombol "Simpan" di klik pada halaman akhir perhitungan.
 * Menyimpan snapshot historis agar data tidak berubah meski BB pasien berubah tahun depan.
 */
const simpanPerhitungan = async (req, res, next) => {
    try {
        const id_user = req.user.id_user; 
        
        const {
            id_pasien,
            umur,
            jenis_kelamin,
            berat_badan,
            tinggi_badan,
            diagnosa_penyakit,
            aktivitas_fisik,
            status_hemodialisa,
            penambahan_kalori,
            faktor_stres,
            
            bmr,
            faktor_aktivitas_nilai,
            faktor_stres_nilai,
            kebutuhan_energi_total,
            protein_gram,
            lemak_gram,
            karbohidrat_gram
        } = req.body;

        if (!id_pasien) {
            return res.status(400).json({ status: 'error', message: 'ID Pasien tidak ditemukan' });
        }

        const kelompok_umur = getKelompokUmur(umur);
        const { nilaiIMT, statusGizi } = hitungIMT(berat_badan, tinggi_badan);

        const diagnosa_string = Array.isArray(diagnosa_penyakit) ? diagnosa_penyakit.join(', ') : diagnosa_penyakit;

        const dataPerhitungan = {
            id_pasien,
            id_user,
            umur_saat_dihitung: umur,
            kelompok_umur,
            berat_badan_saat_dihitung: berat_badan,
            tinggi_badan_saat_dihitung: tinggi_badan,
            imt_saat_dihitung: nilaiIMT,
            status_gizi_saat_dihitung: statusGizi,
            diagnosa_penyakit_saat_dihitung: diagnosa_string,
            aktivitas_fisik,
            status_hemodialisa,
            penambahan_kalori,
            faktor_stres,
            bmr,
            faktor_aktivitas_nilai,
            faktor_stres_nilai,
            kebutuhan_energi_total,
            protein_gram,
            lemak_gram,
            karbohidrat_gram
        };

        const insertId = await PerhitunganModel.simpan(dataPerhitungan);

        res.status(201).json({
            status: 'success',
            message: 'Riwayat perhitungan gizi medis berhasil disimpan permanen',
            data: {
                id_perhitungan: insertId
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    previewPerhitungan,
    simpanPerhitungan
};