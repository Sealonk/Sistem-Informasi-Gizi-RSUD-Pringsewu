import { ArrowLeft } from "lucide-react";

export default function AssessmentHeader({ onBack }) {
  return (
    <div className="mb-10">
      <button
        type="button"
        onClick={onBack}
        className="
          flex
          items-center
          gap-2
          text-slate-500
          text-sm
          mb-6
          hover:text-emerald-600
          transition-all
        "
      >
        <ArrowLeft size={18} />
        Kembali ke Pilih Pasien
      </button>

      <h1
        className="
          text-2xl
          sm:text-3xl
          font-bold
          text-slate-900
          tracking-tight
          mb-3
        "
      >
        Assessment Gizi
      </h1>

      <p
        className="
          text-slate-500
          text-sm
          sm:text-base
        "
      >
        Lengkapi data pasien untuk melakukan perhitungan kebutuhan gizi
      </p>
    </div>
  );
}
