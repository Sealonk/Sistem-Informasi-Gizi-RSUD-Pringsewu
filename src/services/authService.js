import axios from "axios";

const BASE_URL = "http://localhost:5000";

// API Endpoints
const API_ENDPOINTS = {
  auth: {
    login: `/api/auth/login`,
    logout: `/api/auth/logout`,
    register: `/api/auth/register`,
    refreshToken: `/api/auth/refresh-token`,
    verifyToken: `/api/auth/verify-token`,
  },
  pasien: {
    getAll: `/api/pasien`,
    getById: `/api/pasien/:id`,
    create: `/api/pasien`,
    update: `/api/pasien/:id`,
    delete: `/api/pasien/:id`,
  },
  perhitungan: {
    getAll: `/api/perhitungan`,
    getById: `/api/perhitungan/:id`,
    create: `/api/perhitungan`,
    update: `/api/perhitungan/:id`,
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

/**
 * LOGIN USER
 * Melakukan login ke sistem
 * @param {object} data - { username, password }
 * @returns {Promise} response data dengan token dan user info
 */
export const loginUser = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.auth.login,
      data
    );

    const token = response.data.data.token;
    const user = response.data.data.user;

    // Simpan token
    saveToken(token);

    // Simpan user info
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    // Simpan status login
    localStorage.setItem("isLogin", "true");

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Login gagal, server bermasalah"
    );
  }
};

/**
 * LOGOUT USER
 * Menghapus token dan session dari localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isLogin");
};

/**
 * SIMPAN TOKEN
 * Menyimpan token ke localStorage
 * @param {string} token - Token dari server
 */
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * CEK TOKEN
 * Mengambil token dari localStorage
 * @returns {string|null} Token jika ada, null jika tidak ada
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * CEK AUTHENTICATED
 * Mengecek apakah user sudah login atau tidak
 * @returns {boolean} true jika login, false jika tidak
 */
export const isAuthenticated = () => {
  return localStorage.getItem("isLogin") === "true";
};