import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Database, Users } from "lucide-react";
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
    <main className="relative min-h-screen overflow-hidden bg-[#f8fbff] px-4 py-6 text-slate-900 md:px-8">
      <PortalBackground />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6">
        <PrediksiHeader title="Informasi Historis Pasien" description="Lihat informasi data historis pasien sebelum memulai prediksi jumlah pasien harian." />
        <section className="rounded-[32px] border border-slate-200/80 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-8" aria-busy={loading}>
          <div className="mb-6 flex items-center gap-3">
            <Database className="text-violet-600" size={22} />
            <div><h2 className="text-lg font-bold">Data Historis Pasien</h2><p className="mt-1 text-sm text-slate-500">Periode dan jumlah data pasien yang tersedia di sistem.</p></div>
          </div>
          {loading && <p role="status" className="py-10 text-center text-sm text-slate-500">Memuat informasi historis...</p>}
          {!loading && error && <div className="space-y-4"><FeedbackAlert type="error" message={error} /><button type="button" onClick={() => setAttempt((value) => value + 1)} className="rounded-xl border border-violet-200 px-5 py-3 text-sm font-semibold text-violet-700">Coba Lagi</button></div>}
          {!loading && !error && info && <>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {items.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-violet-100 bg-white p-5">
                <Icon size={20} className="mb-4 text-violet-500" />
                <dt className="text-sm font-medium text-slate-500">{label}</dt><dd className="mt-2 text-lg font-bold text-slate-900">{value}</dd>
              </div>)}
            </dl>
            {info.total_pasien === 0 && <p className="mt-4 text-sm text-slate-500">Belum ada data pasien pada periode historis ini.</p>}
          </>}
        </section>
        <section className="flex flex-col items-start justify-between gap-6 rounded-[32px] border border-violet-100 bg-violet-50/80 p-5 sm:p-8 md:flex-row md:items-center">
          <div><h2 className="text-lg font-bold text-slate-900">Prediksi Jumlah Pasien</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">Pilih jumlah hari yang ingin diprediksi. Hasil akan ditampilkan dalam grafik, ringkasan, dan tabel harian.</p></div>
          <Link to="/prediksi-pasien/prediksi" className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-violet-700">Mulai Prediksi <ArrowRight size={18} /></Link>
        </section>
      </div>
    </main>
  );
}
