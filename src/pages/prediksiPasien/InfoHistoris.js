import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Database, LoaderCircle, TrendingUp, Users } from "lucide-react";
import PortalBackground from "../../components/portal/PortalBackground";
import PrediksiHeader from "../../components/prediksiPasien/PrediksiHeader";
import FeedbackAlert from "../../components/common/FeedbackAlert";
import { getInfoHistoris } from "../../services/prediksi/prediksiAPI";

const formatDate = (value) => new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function InfoHistoris() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getInfoHistoris().then((data) => {
      if (!data || !Number.isFinite(data.total_pasien) || !Number.isFinite(data.jumlah_hari) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal_awal) || !/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal_akhir)) {
        throw new Error("Format informasi historis dari server tidak sesuai.");
      }
      if (active) setInfo(data);
    }).catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  const items = info ? [
    { label: "Tanggal Awal", value: formatDate(info.tanggal_awal), icon: CalendarDays },
    { label: "Tanggal Akhir", value: formatDate(info.tanggal_akhir), icon: CalendarDays },
    { label: "Jumlah Hari", value: `${info.jumlah_hari.toLocaleString("id-ID")} hari`, icon: Database },
    { label: "Total Pasien", value: `${info.total_pasien.toLocaleString("id-ID")} pasien`, icon: Users },
  ] : [];

  return (
    <main className="prediction-page relative min-h-screen overflow-hidden bg-[#f8fbff] px-4 py-6 text-slate-900 md:px-8">
      <PortalBackground />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6">
        <PrediksiHeader title="Informasi Historis Pasien" description="Lihat informasi data historis pasien sebelum memulai prediksi jumlah pasien harian." />
        <section className="prediction-panel p-5 sm:p-8" aria-busy={loading}>
          <div className="prediction-section-heading mb-6">
            <span className="prediction-section-icon"><Database size={20} aria-hidden="true" /></span>
            <div><h2 className="text-lg font-bold">Data Historis Pasien</h2><p className="mt-1 text-sm text-slate-500">Periode dan jumlah data pasien yang tersedia di sistem.</p></div>
          </div>
          {loading && <div role="status" className="prediction-empty"><LoaderCircle size={26} className="animate-spin motion-reduce:animate-none text-violet-500" aria-hidden="true" /><p>Memuat informasi historis...</p></div>}
          {!loading && error && <div className="space-y-4"><FeedbackAlert type="error" message={error} /><button type="button" onClick={() => setAttempt((value) => value + 1)} className="prediction-secondary">Coba Lagi</button></div>}
          {!loading && !error && info && <>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {items.map(({ label, value, icon: Icon }) => <div key={label} className="prediction-stat">
                <span className="prediction-stat-icon"><Icon size={18} aria-hidden="true" /></span>
                <dt className="text-sm font-medium text-slate-500">{label}</dt><dd className="mt-2 text-xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</dd>
              </div>)}
            </dl>
            {info.total_pasien === 0 && <p className="mt-4 text-sm text-slate-500">Belum ada data pasien pada periode historis ini.</p>}
          </>}
        </section>
        <section className="prediction-panel prediction-next">
          <div className="prediction-section-heading"><span className="prediction-section-icon shrink-0"><TrendingUp size={22} aria-hidden="true" /></span><div><h2 className="text-lg font-bold text-slate-900">Prediksi Jumlah Pasien</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">Pilih jumlah hari yang ingin diprediksi. Hasil akan ditampilkan dalam grafik, ringkasan, dan tabel harian.</p></div></div>
          <Link to="/prediksi-pasien/prediksi" className="prediction-primary shrink-0">Mulai Prediksi <ArrowRight size={18} className="prediction-cta-arrow" aria-hidden="true" /></Link>
        </section>
      </div>
    </main>
  );
}
