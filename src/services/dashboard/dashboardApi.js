import { axiosInstance } from "../auth/authService";

export const getDashboardStats = async (params = {}) => {

  try {

    const response =
      await axiosInstance.get(
        "/api/dashboard/stats",
        { params }
      );

    return response.data;

  } catch (error) {

    throw new Error(
      error.response?.data?.message ||
      "Gagal mengambil data dashboard"
    );
  }
};

