import { BarChart3, Download, Info } from "lucide-react";
import PrediksiChart from "./PrediksiChart";
import RingkasanPrediksi from "./RingkasanPrediksi";
import TabelPrediksi from "./TabelPrediksi";

export default function HasilPrediksi({ data = [], ringkasan = {} }) {
  const handleDownloadCSV = () => {
    if (!data || data.length === 0) return;

    let csvContent = "Tanggal,Prediksi Pasien\n";
    data.forEach((row) => {
      csvContent += `${row.tanggal},${row.jumlah}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const periodName = ringkasan?.periode
      ? ringkasan.periode.replace(/[^a-zA-Z0-9-]+/g, "_").toLowerCase()
      : "periode";

    link.setAttribute("href", url);
    link.setAttribute("download", `prediksi_pasien_${periodName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="prediction-panel prediction-results space-y-7 p-5 sm:p-8">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="prediction-section-heading">
          <span className="prediction-section-icon"><BarChart3 size={20} aria-hidden="true" /></span>
          <h2 className="text-lg font-bold text-slate-800">
            Hasil Prediksi Pasien Per Hari
          </h2>
        </div>

        <button
          onClick={handleDownloadCSV}
          type="button"
          className="prediction-secondary"
        >
          <Download size={16} />
          Unduh Hasil CSV
        </button>
      </div>

      {/* Grid Layout: Chart + Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="min-w-0 xl:col-span-2">
          <PrediksiChart data={data} />
        </div>
        <div>
          <RingkasanPrediksi ringkasan={ringkasan} />
        </div>
      </div>

      {/* Tabel Detail */}
      <TabelPrediksi data={data} />

      {/* Footer disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
        <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p className="leading-relaxed">
          Hasil prediksi menggunakan model AI berdasarkan data historis yang tersedia. Hasil ini bersifat perkiraan/prediktif untuk keperluan perencanaan distribusi harian dan tidak menjamin jumlah kunjungan riil di masa mendatang.
        </p>
      </div>
    </div>
  );
}
