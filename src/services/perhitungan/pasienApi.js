import { axiosInstance } from "../auth/authService";

const getBeratBadan = (item) =>
  item.berat_badan ??
  item.bb ??
  item.BB ??
  item.berat_badan_saat_masuk ??
  item.berat_badan_saat_dihitung ??
  "";

const getTinggiBadan = (item) =>
  item.tinggi_badan ??
  item.tb ??
  item.TB ??
  item.tinggi_badan_saat_masuk ??
  item.tinggi_badan_saat_dihitung ??
  "";

export function mapPasien(item) {
  return {
    id: item.id_pasien,
    nama: item.nama_pasien,
    rm: item.no_rm,
    umur: item.umur,
    jk: item.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
    tanggal: new Date(item.tanggal_masuk).toLocaleDateString("id-ID"),
    dateISO: item.tanggal_masuk,
    tanggal_masuk: item.tanggal_masuk,
    bb: getBeratBadan(item),
    tb: getTinggiBadan(item),
    diagnosis: item.diagnosis,
    jenis_perhitungan:
      item.jenis_perhitungan ||
      item.metode_perhitungan ||
      item.jenisPerhitungan ||
      item.metodePerhitungan ||
      item.diagnosis ||
      "",
    diagnosis_array: item.diagnosis_array || item.diagnosa_kategori || [],
    penyakit_lainnya: item.penyakit_lainnya || "",
    status_perhitungan: item.status_perhitungan,
    ruangan: item.ruangan,
    status_pulang: item.status_pulang,
    tanggal_keluar: item.tanggal_keluar,
    id_perhitungan: item.id_perhitungan,
    waktu_pembaruan: item.waktu_pembaruan,
  };
}

export async function getPasienList({
  search = "",
  periode = "",
  startDate = "",
  endDate = "",
  tanggal_awal = "",
  tanggal_akhir = "",
  limit = 50,
  page = 1,
  status_perhitungan = "",
  ruangan = "",
  status_pulang = "",
} = {}) {
  try {
    const params = { limit, page };

    if (search) {
      params.search = search;
    }
    if (periode) {
      params.periode = periode;
    }

    const tglAwal = startDate || tanggal_awal;
    const tglAkhir = endDate || tanggal_akhir;

    if (tglAwal) {
      params.startDate = tglAwal;
      params.tanggal_awal = tglAwal;
    }
    if (tglAkhir) {
      params.endDate = tglAkhir;
      params.tanggal_akhir = tglAkhir;
    }
    if (status_perhitungan) {
      params.status_perhitungan = status_perhitungan;
    }
    if (ruangan) {
      params.ruangan = ruangan;
    }
    if (status_pulang) {
      params.status_pulang = status_pulang;
    }

    const response = await axiosInstance.get("/api/pasien", { params });

    return {
      statistik: response.data.data.statistik,
      pagination: response.data.data.pagination,
      pasien: response.data.data.pasien.map(mapPasien),
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil data pasien"
    );
  }
}

export async function getDaftarRuangan() {
  try {
    const response = await axiosInstance.get("/api/pasien/ruangan");
    return response.data.data || [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil daftar ruangan"
    );
  }
}
