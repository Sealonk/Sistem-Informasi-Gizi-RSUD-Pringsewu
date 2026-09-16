import { getToken } from "../auth/authService";

const BASE_URL = (process.env.REACT_APP_PREDIKSI_API_URL || "/prediction-api").replace(/\/$/, "");

async function request(path, options = {}) {
  const token = getToken();
  if (!token) throw new Error("Silakan login terlebih dahulu untuk mengakses layanan prediksi.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    if (response.status === 401 || response.status === 403) {
      const errorPayload = await response.json().catch(() => ({}));
      const detail = typeof errorPayload.detail === "string" ? errorPayload.detail : errorPayload.message;
      if (detail === "Not authenticated") {
        throw new Error("Token login belum diterima layanan prediksi. Silakan hubungi pengelola aplikasi.");
      }
      throw new Error(detail || (response.status === 401
        ? "Layanan prediksi menolak token login. Silakan login kembali."
        : "Anda tidak memiliki akses ke layanan prediksi."));
    }
    const payload = await response.json();
    if (!response.ok) throw new Error(typeof payload.detail === "string" ? payload.detail : payload.message || "Permintaan prediksi gagal. Silakan coba lagi.");
    return payload;
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Server terlalu lama merespons. Silakan coba lagi.");
    if (error instanceof TypeError || error instanceof SyntaxError) throw new Error("Layanan prediksi belum dapat diakses. Silakan coba lagi nanti.");
    throw error;
  } finally { clearTimeout(timeout); }
}
export const getInfoHistoris = () => request("/api/info-historis");
export const postPrediksi = ({ hari_kedepan }) => request("/api/predict", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ hari_kedepan }),
});
