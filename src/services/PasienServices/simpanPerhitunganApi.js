import { axiosInstance } from "../authService";

export const savePerhitungan = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/perhitungan/simpan",
      payload
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal menyimpan perhitungan gizi"
    );
  }
};
