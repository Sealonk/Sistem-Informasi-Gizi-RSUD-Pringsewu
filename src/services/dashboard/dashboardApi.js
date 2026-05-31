import { axiosInstance } from "../authService";

/* ========================================
   DASHBOARD STATS
======================================== */
export const getDashboardStats = async () => {

  try {

    const response =
      await axiosInstance.get(
        "/api/dashboard/stats"
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Gagal mengambil data dashboard"
    );
  }
};

