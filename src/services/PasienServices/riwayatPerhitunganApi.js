import { axiosInstance } from "../authService";

export const getRiwayatPerhitungan = async () => {

  try {

    const response =
      await axiosInstance.get(
        "/api/perhitungan/riwayat"
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Gagal mengambil riwayat"
    );
  }
};