import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;
const TOKEN_KEY = "token";
const USER_KEY = "user";

// API Endpoints
const API_ENDPOINTS = {
  auth: {
    login: `/api/auth/login`,
    logout: `/api/auth/logout`,
    register: `/api/auth/register`,
    refreshToken: `/api/auth/refresh-token`,
    verifyToken: `/api/auth/verify-token`,
    forgotPasswordAdmin: `/api/auth/forgot-password-admin`,
    resetPasswordAdmin: `/api/auth/reset-password-admin`,
  },
};

// Konfigurasi axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { API_ENDPOINTS, axiosInstance };

const getAuthPayload = (responseData) => {
  return responseData?.data || responseData || {};
};

/**
 * LOGIN USER
 * Melakukan login ke sistem
 * @param {object} data - { username, password }
 * @returns {Promise} response data dengan token dan user info
 */
export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.auth.login, data);
    const authPayload = getAuthPayload(response.data);
    const token = authPayload.token || response.data?.token;
    const user = authPayload.user || response.data?.user || null;

    if (!token) {
      throw new Error("Token tidak ditemukan dari server");
    }

    // Simpan token
    saveToken(token);

    // Simpan user info
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    if (error.message === "Token tidak ditemukan dari server") {
      throw error;
    }

    throw new Error(
      error.response?.data?.message || "Login gagal, server bermasalah"
    );
  }
};

export const forgotPasswordAdmin = async (email) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.auth.forgotPasswordAdmin,
      { email }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Gagal mengirim tautan pemulihan password admin"
    );
  }
};

export const resetPasswordAdmin = async ({ token, newPassword }) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.auth.resetPasswordAdmin,
      {
        token,
        newPassword,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Gagal mereset password admin"
    );
  }
};

/**
 * LOGOUT USER
 * Menghapus token dan session dari localStorage.
 * Jika backend menyediakan endpoint logout, request akan dikirim lebih dulu.
 */
export const logoutUser = async () => {
  try {
    if (getToken()) {
      await axiosInstance.post(API_ENDPOINTS.auth.logout);
    }
  } catch {
    // Tetap lanjut logout lokal meskipun request logout ke server gagal.
  } finally {
    clearAuthData();
  }
};

/**
 * SIMPAN TOKEN
 * Menyimpan token ke localStorage
 * @param {string} token - Token dari server
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * CEK TOKEN
 * Mengambil token dari localStorage
 * @returns {string|null} Token jika ada, null jika tidak ada
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * CEK AUTHENTICATED
 * Mengecek apakah user sudah login atau tidak
 * @returns {boolean} true jika login, false jika tidak
 */
export const isAuthenticated = () => {
  return Boolean(getToken());
};

/**
 * AMBIL USER
 * Mengambil data user dari localStorage
 * @returns {object|null} Data user jika ada, null jika tidak ada
 */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

/**
 * HAPUS DATA AUTH
 * Membersihkan semua data auth dari localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
