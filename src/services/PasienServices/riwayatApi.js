import { axiosInstance } from "../authService";

/* ========================================
   GET RIWAYAT
======================================== */
export const getRiwayat = async ({
  page = 1,
  limit = 10,
  search = "",
  penyakit = "",
  tanggal = "",
  filter_user = "all",
}) => {

  try {

    const response =
      await axiosInstance.get(
        "/api/perhitungan/riwayat",
        {
          params: {
            page,
            limit,
            search,
            penyakit:
              penyakit === "Semua Penyakit"
                ? ""
                : penyakit,
            tanggal,
            filter_user,
          },
        }
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Gagal mengambil data riwayat"
    );
  }
};

/* ========================================
   DETAIL RIWAYAT
======================================== */
export const getRiwayatDetail = async (id) => {

  try {

    const response =
      await axiosInstance.get(
        `/api/perhitungan/riwayat/${id}`
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Gagal mengambil detail riwayat"
    );
  }
};

/* ========================================
   DELETE RIWAYAT
======================================== */
export const deleteRiwayat = async (id) => {

  try {

    const response =
      await axiosInstance.delete(
        `/api/perhitungan/riwayat/${id}`
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Gagal menghapus riwayat"
    );
  }
};

/* ========================================
   UPDATE RIWAYAT
======================================== */
export const updateRiwayat = async (id, payload) => {
  try {
    const response = await axiosInstance.put(
      `/api/perhitungan/riwayat/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
      "Gagal memperbarui riwayat perhitungan"
    );
  }
};