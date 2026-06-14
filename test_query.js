const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const db = require('../backend/config/database');

async function check() {
  try {
    const [rows] = await db.execute('SELECT id_perhitungan, no_rawat, diagnosa_penyakit_saat_dihitung, aktivitas_fisik, status_hemodialisa, faktor_stres, kebutuhan_energi_total FROM  perhitungan_gizi ORDER BY id_perhitungan DESC LIMIT 5');
    console.log("LAST 5 ROWS:", JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
