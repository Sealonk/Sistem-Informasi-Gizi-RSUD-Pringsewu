import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList, UsersRound } from "lucide-react";

export default function PilihPasienHeader({ statistik }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/75 backdrop-blur-md p-5 sm:p-8 shadow-sm mb-8 hover:shadow-md transition-all duration-300">
      {/* Left Decorative Accent Strip */}
      <div className="absolute left-0 inset-y-0 w-2 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-l-[32px]" />

      <div className="flex items-start justify-between gap-6 flex-wrap pl-2">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100">
            <UsersRound size={24} />
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1 tracking-wider uppercase">
              Beranda &gt; Perhitungan Gizi
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Perhitungan Gizi
            </h1>

            <p className="text-sm text-slate-500 mb-4">
              Pilih data pasien sebelum melakukan assessment gizi.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium">
              <ClipboardList size={16} />
              {statistik
                ? `Total ${statistik.total_pasien} pasien ditemukan`
                : "Memuat data pasien..."}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/portal")}
          className="h-12 px-5 rounded-2xl border border-emerald-200 bg-white text-emerald-600 text-sm font-semibold flex items-center gap-2 hover:bg-emerald-50 hover:shadow-md transition-all duration-300"
        >
          <ArrowLeft size={18} />
          Kembali ke Portal
        </button>
      </div>
    </div>
  );
}
