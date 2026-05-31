import {
  axiosInstance,
} from "../authService";

export const previewPerhitungan =
async (payload) => {

  try {

    const response =
      await axiosInstance.post(
        "/api/perhitungan/preview",
        payload
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Gagal melakukan preview perhitungan"
    );
  }
};