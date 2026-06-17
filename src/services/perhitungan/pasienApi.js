import { axiosInstance } from "../auth/authService";

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
    diagnosis: item.diagnosis,
    status_perhitungan: item.status_perhitungan,
    id_perhitungan: item.id_perhitungan,
    waktu_pembaruan: item.waktu_pembaruan,
  };
}

export async function getPasienList({
  search = "",
  periode = "",
  startDate = "",
  endDate = "",
  limit = 50,
  page = 1,
  status_perhitungan = "",
} = {}) {
  try {
    const params = { limit, page };

    if (search) {
      params.search = search;
    }
    if (periode) {
      params.periode = periode;
    }
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    if (status_perhitungan) {
      params.status_perhitungan = status_perhitungan;
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
