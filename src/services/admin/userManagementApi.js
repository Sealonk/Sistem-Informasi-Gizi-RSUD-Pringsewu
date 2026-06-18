import { axiosInstance } from "../auth/authService";

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users");
    return Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mengambil daftar user"
    );
  }
};

export const tambahUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/tambah", payload);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal menambahkan user baru"
    );
  }
};

export const resetPasswordUser = async ({
  id_user_target,
  password_baru,
}) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/reset-password-petugas",
      {
        id_user_target,
        password_baru,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mereset password user"
    );
  }
};

export const hapusUser = async (id_user) => {
  try {
    const response = await axiosInstance.delete(`/api/users/${id_user}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal menghapus user"
    );
  }
};
