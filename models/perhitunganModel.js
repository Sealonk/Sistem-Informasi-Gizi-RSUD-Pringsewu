// ==========================================
// MODEL: perhitunganModel.js
// ==========================================

const db = require('../config/database');

const Perhitungan = {
    /**
     * Menyimpan data riwayat perhitungan gizi ke database (Snapshot)
     * @param {Object} data - Objek berisi seluruh variabel yang akan di-insert
     * @returns {Promise<number>} - Mengembalikan ID perhitungan yang baru saja dibuat
     */
    simpan: async (data) => {
        // Mengubah id_pasien menjadi no_rawat
        const queryInsert = `
            INSERT INTO perhitungan_gizi (
                no_rawat, id_user, umur_saat_dihitung, kelompok_umur, ruang_bangsal,
                berat_badan_saat_dihitung, tinggi_badan_saat_dihitung, imt_saat_dihitung, status_gizi_saat_dihitung,
                is_estimasi, lila_cm, ulna_cm, persen_lila,
                diagnosa_penyakit_saat_dihitung, aktivitas_fisik, status_hemodialisa,
                kategori_penambahan_energi, metode_perhitungan, faktor_stres, 
                bmr, faktor_aktivitas_nilai, faktor_stres_nilai, penambahan_kalori,
                kebutuhan_energi_total, protein_gram, lemak_gram, karbohidrat_gram
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.no_rawat, data.id_user, data.umur_saat_dihitung, data.kelompok_umur, data.ruang_bangsal,
            data.berat_badan_saat_dihitung, data.tinggi_badan_saat_dihitung, data.imt_saat_dihitung, data.status_gizi_saat_dihitung,
            data.is_estimasi, data.lila_cm, data.ulna_cm, data.persen_lila,
            data.diagnosa_penyakit_saat_dihitung, data.aktivitas_fisik, data.status_hemodialisa,
            data.kategori_penambahan_energi, data.metode_perhitungan, data.faktor_stres,
            data.bmr, data.faktor_aktivitas_nilai, data.faktor_stres_nilai, data.penambahan_kalori,
            data.kebutuhan_energi_total, data.protein_gram, data.lemak_gram, data.karbohidrat_gram
        ];

        const [result] = await db.execute(queryInsert, values);
        return result.insertId;
    },

    /**
     * Mengambil semua riwayat perhitungan dengan fitur Filter
     * @param {Object} filters - Objek berisi search, penyakit, dan tanggal
     */
    findAllRiwayat: async (filters) => {
        // PERBAIKAN: Menggunakan MAX() untuk mencegah duplikasi baris akibat JOIN dengan tabel SIMRS
        let query = `
            SELECT pg.*, 
                   MAX(p.nm_pasien) AS nama_pasien, 
                   MAX(p.no_rkm_medis) AS no_rm 
            FROM perhitungan_gizi pg
            JOIN pasien p ON pg.no_rawat = p.no_rawat
            WHERE 1=1
        `;
        const values = [];

        // Filter berdasarkan nama pasien (menggunakan nm_pasien)
        if (filters.search) {
            query += ` AND p.nm_pasien LIKE ?`;
            values.push(`%${filters.search}%`);
        }
        
        // Filter berdasarkan jenis penyakit (kecuali jika dipilih "Semua Penyakit" atau kosong)
        if (filters.penyakit && filters.penyakit !== 'Semua Penyakit') {
            query += ` AND pg.diagnosa_penyakit_saat_dihitung LIKE ?`;
            values.push(`%${filters.penyakit}%`);
        }
        
        // Filter berdasarkan tanggal perhitungan
        if (filters.tanggal) {
            query += ` AND DATE(pg.tanggal_perhitungan) = ?`;
            values.push(filters.tanggal);
        }

        // PERBAIKAN: Menambahkan GROUP BY untuk menyatukan baris yang ganda
        query += ` GROUP BY pg.id_perhitungan ORDER BY pg.tanggal_perhitungan DESC`;

        const [rows] = await db.execute(query, values);
        return rows;
    },

    /**
     * Mengambil detail satu riwayat spesifik beserta data pasiennya
     * @param {number} id_perhitungan 
     */
    findDetailById: async (id_perhitungan) => {
        // PERBAIKAN: Menggunakan MAX() dan GROUP BY
        const query = `
            SELECT pg.*, 
                   MAX(p.nm_pasien) AS nama_pasien, 
                   MAX(p.no_rkm_medis) AS no_rm, 
                   MAX(p.jk) AS jenis_kelamin 
            FROM perhitungan_gizi pg
            JOIN pasien p ON pg.no_rawat = p.no_rawat
            WHERE pg.id_perhitungan = ?
            GROUP BY pg.id_perhitungan
        `;
        const [rows] = await db.execute(query, [id_perhitungan]);
        return rows[0]; 
    },

    /**
     * Mengambil riwayat perhitungan gizi berdasarkan no_rawat
     * @param {string} no_rawat 
     * @returns {Promise<Array>} - Daftar riwayat perhitungan
     */
    findByPasienId: async (no_rawat) => {
        const query = `
            SELECT * FROM perhitungan_gizi 
            WHERE no_rawat = ? 
            ORDER BY tanggal_perhitungan DESC
        `;
        const [rows] = await db.execute(query, [no_rawat]);
        return rows;
    },

    /**
     * Menghapus sebuah riwayat perhitungan secara spesifik
     * @param {number} id_perhitungan 
     * @returns {Promise<boolean>}
     */
    deleteById: async (id_perhitungan) => {
        const query = 'DELETE FROM perhitungan_gizi WHERE id_perhitungan = ?';
        const [result] = await db.execute(query, [id_perhitungan]);
        return result.affectedRows > 0;
    }
};

module.exports = Perhitungan;