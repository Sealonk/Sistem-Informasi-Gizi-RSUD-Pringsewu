import { Sliders, Sparkles } from "lucide-react";
import InputField from "../common/InputField";
import SelectField from "../common/SelectField";

export default function InputPrediksi({
  periode,
  setPeriode,
  totalPasien,
  setTotalPasien,
  onPredict,
  isLoading,
}) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];
  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const options = [];
  years.forEach((year) => {
    months.forEach((month) => {
      options.push({
        value: `${month.value}-${year}`,
        label: `${month.label} ${year}`,
      });
    });
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!periode || !totalPasien) return;
    onPredict();
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
      "
    >
      {/* Title Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sliders className="text-slate-700" size={20} />
        <h2 className="text-lg font-bold text-slate-800">Input Prediksi</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Periode Dropdown */}
          <SelectField
            label="Pilih Periode (Bulan & Tahun)"
            value={periode}
            onChange={setPeriode}
            options={options}
            placeholder="Pilih periode..."
          />

          {/* Total Pasien Input */}
          <InputField
            label="Total Pasien Selama 1 Bulan"
            type="number"
            placeholder="Masukkan total pasien"
            value={totalPasien}
            onChange={(val) => {
              // Convert to empty string or parsed integer
              if (val === "") setTotalPasien("");
              else {
                const parsed = parseInt(val, 10);
                setTotalPasien(isNaN(parsed) ? "" : parsed);
              }
            }}
            suffix="pasien"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || !periode || !totalPasien}
            className={`
              h-14
              px-8
              rounded-2xl
              bg-slate-900
              hover:bg-slate-800
              text-white
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              transition-all
              shadow-sm
              hover:shadow-md
              disabled:opacity-50
              disabled:cursor-not-allowed
              ${isLoading ? "animate-pulse" : ""}
            `}
          >
            <Sparkles size={18} />
            {isLoading ? "Memproses..." : "Prediksi Sekarang"}
          </button>
        </div>
      </form>

      {/* Info Footnote */}
      <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <span className="shrink-0 text-sm">ℹ️</span>
        <p className="leading-relaxed">
          Masukkan total jumlah pasien selama 1 bulan untuk mendapatkan prediksi jumlah pasien per hari.
          Sistem akan membagi total tersebut secara harian menggunakan bobot dari data kunjungan historis 3 bulan terakhir (jika tersedia) atau secara acak berfluktuasi secara alami jika data historis belum mencukupi.
        </p>
      </div>
    </div>
  );
}
