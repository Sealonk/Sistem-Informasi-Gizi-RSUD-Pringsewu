const BASE_URL = (process.env.REACT_APP_PREDIKSI_API_URL || "/prediction-api").replace(/\/$/, "");

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(`${BASE_URL}${path}`, { ...options, signal: controller.signal });
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
