import { BarChart3, Download } from "lucide-react";
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
      ? ringkasan.periode.replace(/\s+/g, "_").toLowerCase()
      : "periode";

    link.setAttribute("href", url);
    link.setAttribute("download", `prediksi_pasien_${periodName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="
        rounded-[32px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        p-8
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        space-y-8
      "
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-violet-600" size={22} />
          <h2 className="text-xl font-bold text-slate-800">
            Hasil Prediksi Pasien Per Hari
          </h2>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="
            h-11
            px-5
            rounded-xl
            border
            border-violet-200
            bg-white
            hover:bg-violet-50
            text-violet-600
            text-sm
            font-semibold
            flex
            items-center
            gap-2
            transition-all
            shadow-sm
            hover:shadow-md
          "
        >
          <Download size={16} />
          Unduh Hasil CSV
        </button>
      </div>

      {/* Grid Layout: Chart + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PrediksiChart data={data} />
        </div>
        <div>
          <RingkasanPrediksi ringkasan={ringkasan} />
        </div>
      </div>

      {/* Tabel Detail */}
      <TabelPrediksi data={data} />

      {/* Footer disclaimer */}
      <div className="flex items-start gap-2 text-[11px] text-slate-400">
        <span className="shrink-0">ℹ️</span>
        <p className="leading-relaxed">
          Hasil prediksi menggunakan model AI berdasarkan data historis yang tersedia. Hasil ini bersifat perkiraan/prediktif untuk keperluan perencanaan distribusi harian dan tidak menjamin jumlah kunjungan riil di masa mendatang.
        </p>
      </div>
    </div>
  );
}
