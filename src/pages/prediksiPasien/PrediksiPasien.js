import { useRef, useState } from "react";
import PortalBackground from "../../components/portal/PortalBackground";
import FeedbackAlert from "../../components/common/FeedbackAlert";
import PrediksiHeader from "../../components/prediksiPasien/PrediksiHeader";
import InputPrediksi from "../../components/prediksiPasien/InputPrediksi";
import HasilPrediksi from "../../components/prediksiPasien/HasilPrediksi";
import { postPrediksi } from "../../services/prediksi/prediksiAPI";

export default function PrediksiPasien() {
  const [hari, setHari] = useState("7");
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pending = useRef(false);
  const handlePredict = async () => {
    if (pending.current) return;
    const jumlahHari = Number(hari);
    setError(null);
    setHasil(null);
    if (!Number.isInteger(jumlahHari) || jumlahHari < 1 || jumlahHari > 365) {
      setError("Jumlah hari harus berupa bilangan bulat antara 1 dan 365.");
      return;
    }
    pending.current = true;
    setLoading(true);
    try {
      const response = await postPrediksi({ hari_kedepan: jumlahHari });
      if (!Array.isArray(response.data) || !response.summary ||
          response.data.some((row) => typeof row.tanggal !== "string" || !Number.isFinite(row.prediksi) || row.prediksi < 0) ||
          ["total", "average", "maximum", "minimum"].some((key) => !Number.isFinite(response.summary[key]))) {
        throw new Error("Format hasil prediksi dari server tidak sesuai.");
      }
      setHasil(response);
    } catch (err) { setError(err.message); }
    finally { pending.current = false; setLoading(false); }
  };
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbff] px-4 py-6 text-slate-900 md:px-8">
      <PortalBackground />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6">
        <PrediksiHeader backTo="/prediksi-pasien" backLabel="Kembali ke Info Historis" />
        <InputPrediksi hari={hari} setHari={(value) => { setHari(value); setHasil(null); setError(null); }} onPredict={handlePredict} isLoading={loading} />
        {error && <FeedbackAlert type="error" message={error} onClose={() => setError(null)} />}
        <div aria-live="polite" aria-busy={loading}>
          {loading && <p className="py-8 text-center text-sm text-slate-500" role="status">Sedang menghitung prediksi pasien. Mohon tunggu...</p>}
          {!loading && !hasil && !error && <p className="py-8 text-center text-sm text-slate-500">Hasil prediksi akan ditampilkan di sini setelah Anda menekan Prediksi Sekarang.</p>}
          {hasil && (hasil.data.length ? <HasilPrediksi data={hasil.data.map((row) => ({ tanggal: row.tanggal, jumlah: row.prediksi }))} ringkasan={{
            total_pasien: hasil.summary.total, rata_rata: hasil.summary.average,
            prediksi_tertinggi: hasil.summary.maximum, prediksi_terendah: hasil.summary.minimum,
            periode: `${hasil.data[0].tanggal} s.d. ${hasil.data[hasil.data.length - 1].tanggal}`,
          }} /> : <p className="py-8 text-center text-slate-500">Belum ada hasil prediksi untuk periode ini.</p>)}
        </div>
      </div>
    </main>
  );
}
