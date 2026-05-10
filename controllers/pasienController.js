const db = require('../config/database');
const { hitungIMT } = require('../utils/rumusGizi');

const getAllPasien = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const queryStats = `
            SELECT 
                COUNT(*) AS total_pasien,
                SUM(CASE WHEN jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_perempuan,
                SUM(CASE WHEN DATE(tanggal_masuk) = CURDATE() THEN 1 ELSE 0 END) AS pasien_hari_ini
            FROM pasien
        `;
        const [[statsData]] = await db.execute(queryStats);

        const queryList = `
            SELECT 
                p.id_pasien, p.nama_pasien, p.umur, p.jenis_kelamin, p.status_gizi,
                GROUP_CONCAT(mp.nama_penyakit SEPARATOR ', ') AS diagnosis
            FROM pasien p
            LEFT JOIN pasien_diagnosa pd ON p.id_pasien = pd.id_pasien
            LEFT JOIN master_penyakit mp ON pd.id_penyakit = mp.id_penyakit
            GROUP BY p.id_pasien
            ORDER BY p.id_pasien DESC
            LIMIT ? OFFSET ?
        `;
        
        const [listPasien] = await db.query(queryList, [limit, offset]);

        res.status(200).json({
            status: 'success',
            data: {
                statistik: {
                    total_pasien: statsData.total_pasien || 0,
                    laki_laki: statsData.total_laki_laki || 0,
                    perempuan: statsData.total_perempuan || 0,
                    hari_ini: statsData.pasien_hari_ini || 0
                },
                pasien: listPasien,
                pagination: {
                    halaman_sekarang: page,
                    limit_per_halaman: limit
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const getPasienById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const queryPasien = 'SELECT * FROM pasien WHERE id_pasien = ?';
        const [[pasien]] = await db.execute(queryPasien, [id]);

        if (!pasien) {
            return res.status(404).json({ status: 'error', message: 'Data pasien tidak ditemukan' });
        }

        const queryPenyakit = 'SELECT id_penyakit FROM pasien_diagnosa WHERE id_pasien = ?';
        const [penyakitRaw] = await db.execute(queryPenyakit, [id]);
        
        const id_penyakit_array = penyakitRaw.map(p => p.id_penyakit);

        res.status(200).json({
            status: 'success',
            data: {
                ...pasien,
                diagnosa: id_penyakit_array
            }
        });
    } catch (error) {
        next(error);
    }
};

const createPasien = async (req, res, next) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const { nama_pasien, umur, berat_badan, tinggi_badan, jenis_kelamin, diagnosa } = req.body;

        if (!nama_pasien || !umur || !berat_badan || !tinggi_badan || !jenis_kelamin) {
            throw new Error('Semua field identitas dan antropometri wajib diisi');
        }

        const { nilaiIMT, statusGizi } = hitungIMT(berat_badan, tinggi_badan);

        const queryInsertPasien = `
            INSERT INTO pasien (nama_pasien, umur, jenis_kelamin, berat_badan, tinggi_badan, imt, status_gizi)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [resultPasien] = await connection.execute(queryInsertPasien, [
            nama_pasien, umur, jenis_kelamin, berat_badan, tinggi_badan, nilaiIMT, statusGizi
        ]);

        const idPasienBaru = resultPasien.insertId;

        if (diagnosa && Array.isArray(diagnosa) && diagnosa.length > 0) {
            const queryInsertDiagnosa = 'INSERT INTO pasien_diagnosa (id_pasien, id_penyakit) VALUES (?, ?)';
            for (let id_penyakit of diagnosa) {
                await connection.execute(queryInsertDiagnosa, [idPasienBaru, id_penyakit]);
            }
        }

        await connection.commit();

        res.status(201).json({
            status: 'success',
            message: 'Data pasien berhasil disimpan',
            data: {
                id_pasien: idPasienBaru,
                imt: nilaiIMT,
                status_gizi: statusGizi
            }
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

const updatePasien = async (req, res, next) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const { id } = req.params;
        const { nama_pasien, umur, berat_badan, tinggi_badan, jenis_kelamin, diagnosa } = req.body;

        const { nilaiIMT, statusGizi } = hitungIMT(berat_badan, tinggi_badan);

        const queryUpdatePasien = `
            UPDATE pasien 
            SET nama_pasien = ?, umur = ?, jenis_kelamin = ?, berat_badan = ?, tinggi_badan = ?, imt = ?, status_gizi = ?
            WHERE id_pasien = ?
        `;
        await connection.execute(queryUpdatePasien, [
            nama_pasien, umur, jenis_kelamin, berat_badan, tinggi_badan, nilaiIMT, statusGizi, id
        ]);

        await connection.execute('DELETE FROM pasien_diagnosa WHERE id_pasien = ?', [id]);

        if (diagnosa && Array.isArray(diagnosa) && diagnosa.length > 0) {
            const queryInsertDiagnosa = 'INSERT INTO pasien_diagnosa (id_pasien, id_penyakit) VALUES (?, ?)';
            for (let id_penyakit of diagnosa) {
                await connection.execute(queryInsertDiagnosa, [id, id_penyakit]);
            }
        }

        await connection.commit();

        res.status(200).json({
            status: 'success',
            message: 'Data pasien berhasil diperbarui'
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};

const deletePasien = async (req, res, next) => {
    try {
        const { id } = req.params;

        const queryDelete = 'DELETE FROM pasien WHERE id_pasien = ?';
        const [result] = await db.execute(queryDelete, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Data pasien tidak ditemukan' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Data pasien berhasil dihapus'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllPasien,
    getPasienById,
    createPasien,
    updatePasien,
    deletePasien
};