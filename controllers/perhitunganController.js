// ==========================================
// CONTROLLER: perhitunganController.js
// ==========================================

const db = require('../config/database');
const PerhitunganModel = require('../models/perhitunganModel');
const { kalkulasiGiziTotal, getKelompokUmur, hitungIMT } = require('../utils/rumusGizi');

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
// PREVIEW KALKULASI GIZI
// ==========================================
const previewPerhitungan = async (req, res, next) => {
    try {
        const dataInput = req.body;
        
        if (!dataInput.id_pasien) {
            return res.status(400).json({ status: 'error', message: 'ID Pasien (no_rawat) wajib diisi' });
        }

        const queryCekPasien = `
            SELECT rp.no_rawat, COALESCE(ki.tgl_masuk, rp.tgl_registrasi) AS tgl_masuk, dp.kd_penyakit 
            FROM reg_periksa rp
            LEFT JOIN kamar_inap ki ON rp.no_rawat = ki.no_rawat
            LEFT JOIN diagnosa_pasien dp ON rp.no_rawat = dp.no_rawat
            WHERE rp.no_rawat = ?
        `;
        const [cekPasien] = await db.execute(queryCekPasien, [dataInput.id_pasien]);

        if (cekPasien.length === 0) {
            return res.status(404).json({ status: 'error', message: `Gagal! Pasien dengan No. Rawat ${dataInput.id_pasien} tidak ditemukan di database SIMRS` });
        }

        const gabunganKodePenyakit = cekPasien.map(row => row.kd_penyakit).filter(Boolean).join(', ');
        const dataPasienSIMRS = cekPasien[0]; 

        if (dataInput.umur) {
            dataInput.umur = konversiUmurKeTahun(dataInput.umur);
            if (dataInput.umur < 18) {
                return res.status(403).json({ status: 'error', message: 'Perhitungan tidak dapat dilanjutkan karena pasien anak-anak.' });
            }
        } else {
            return res.status(400).json({ status: 'error', message: 'Umur pasien wajib diisi.' });
        }
        
        const hasilKalkulasi = kalkulasiGiziTotal(dataInput);

        if (dataInput.diagnosa_penyakit && dataInput.diagnosa_penyakit.includes('Mifflin') && dataInput.penyakit_lainnya) {
            hasilKalkulasi.penyakit_lainnya = dataInput.penyakit_lainnya;
        }

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
        return res.status(400).json({ success: false, message: "Gagal menghitung gizi: " + error.message });
    }
};

// ==========================================
// SIMPAN KALKULASI GIZI KE DATABASE
// ==========================================
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

        const [cekPasien] = await db.execute('SELECT no_rawat FROM reg_periksa WHERE no_rawat = ?', [id_pasien]);
        
        if (cekPasien.length === 0) {
            return res.status(404).json({ status: 'error', message: `Gagal menyimpan! Pasien dengan No. Rawat ${id_pasien} tidak ditemukan di SIMRS.` });
        }

        const umurNumerikTahun = konversiUmurKeTahun(umur);

        if (umurNumerikTahun < 18) {
            return res.status(403).json({ status: 'error', message: 'Data tidak dapat disimpan karena pasien kategori anak-anak.' });
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

module.exports = { 
    previewPerhitungan, 
    simpanPerhitungan
};