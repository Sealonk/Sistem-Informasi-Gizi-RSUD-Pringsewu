import { axiosInstance } from "../auth/authService";

export const postPrediksi = async ({ bulan, tahun, total_pasien }) => {
  try {
    const response = await axiosInstance.post("/api/prediksi/predict", {
      bulan,
      tahun,
      total_pasien,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal melakukan prediksi pasien"
    );
  }
};
