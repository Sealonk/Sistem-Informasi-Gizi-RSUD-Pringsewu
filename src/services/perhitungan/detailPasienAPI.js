import { axiosInstance } from "../auth/authService";

export const getDetailPasien = async (idPasien) => {
  try {
    const response = await axiosInstance.get(`/api/pasien/${idPasien}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw new Error(
      error.response?.data?.message || "Gagal mengambil detail pasien"
    );
  }
};
