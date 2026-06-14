import { useState } from "react";
import PortalBackground from "../../components/portal/PortalBackground";
import FeedbackAlert from "../../components/common/FeedbackAlert";
import PrediksiHeader from "../../components/prediksiPasien/PrediksiHeader";
import InputPrediksi from "../../components/prediksiPasien/InputPrediksi";
import HasilPrediksi from "../../components/prediksiPasien/HasilPrediksi";
import { postPrediksi } from "../../services/prediksi/prediksiAPI";

export default function PrediksiPasien() {
  const [periode, setPeriode] = useState(() => {
    const d = new Date();
    return `${d.getMonth() + 1}-${d.getFullYear()}`;
  });
  const [totalPasien, setTotalPasien] = useState("");
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    if (!periode || !totalPasien) return;

    try {
      setLoading(true);
      setError(null);

      const [bulanStr, tahunStr] = periode.split("-");
      const bulan = parseInt(bulanStr, 10);
      const tahun = parseInt(tahunStr, 10);
      const total = parseInt(totalPasien, 10);

      const response = await postPrediksi({
        bulan,
        tahun,
        total_pasien: total,
      });

      if (response.status === "success") {
        setHasil(response.data);
      } else {
        setError(response.message || "Gagal menghitung prediksi pasien");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan koneksi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-6 text-slate-900 md:px-8 relative overflow-hidden">
      <PortalBackground />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6">
        {/* Header */}
        <PrediksiHeader />

        {/* Error Alert */}
        {error && (
          <FeedbackAlert
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Input Form */}
        <InputPrediksi
          periode={periode}
          setPeriode={setPeriode}
          totalPasien={totalPasien}
          setTotalPasien={setTotalPasien}
          onPredict={handlePredict}
          isLoading={loading}
        />

        {/* Hasil Prediksi */}
        {hasil && (
          <HasilPrediksi
            data={hasil.prediksi_harian}
            ringkasan={hasil.ringkasan}
          />
        )}
      </div>
    </main>
  );
}
