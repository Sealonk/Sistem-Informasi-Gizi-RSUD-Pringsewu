import { useNavigate } from "react-router-dom";
import { CheckCircle2, User } from "lucide-react";

export default function SuccessModal({
  isOpen,
  isEdit,
  patientName,
  noRM,
  statusGizi,
  energi,
  protein,
  lemak,
  karbohidrat,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const getStatusGiziColor = (status) => {
    if (!status) return { bg: "bg-slate-50 border-slate-100", text: "text-slate-600" };
    const cleanStatus = status.toLowerCase();
    if (cleanStatus.includes("kurang") || cleanStatus.includes("buruk") || cleanStatus.includes("kurus")) {
      return { bg: "bg-rose-50 border-rose-100", text: "text-rose-700" };
    }
    if (cleanStatus.includes("lebih") || cleanStatus.includes("obes") || cleanStatus.includes("gemuk")) {
      return { bg: "bg-amber-50 border-amber-100", text: "text-amber-700" };
    }
    if (cleanStatus.includes("baik") || cleanStatus.includes("normal")) {
      return { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" };
    }
    return { bg: "bg-blue-50 border-blue-100", text: "text-blue-700" };
  };

  const statusGiziTheme = getStatusGiziColor(statusGizi);

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-[32px]
          bg-white
          p-6
          sm:p-8
          shadow-2xl
          border
          border-white
          relative
          overflow-hidden
        "
      >
        {/* DECORATIVE GLOW */}
        <div
          className="
            absolute
            top-[-60px]
            right-[-60px]
            w-[150px]
            h-[150px]
            rounded-full
            blur-3xl
            bg-emerald-100/40
            pointer-events-none
          "
        />

        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-white flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-50/50">
            <CheckCircle2 size={32} />
          </div>
        </div>

        {/* TITLE */}
        <h3
          className="
            text-2xl
            font-bold
            text-slate-900
            text-center
            mb-2
          "
        >
          {isEdit ? "Riwayat Berhasil Diperbarui" : "Riwayat Berhasil Disimpan"}
        </h3>

        {/* DESC */}
        <p
          className="
            text-sm
            leading-relaxed
            text-slate-500
            text-center
            mb-6
          "
        >
          {isEdit 
            ? "Data hasil perhitungan pasien telah berhasil diperbarui ke riwayat perhitungan gizi."
            : "Data hasil perhitungan pasien telah berhasil disimpan ke riwayat perhitungan gizi."}
        </p>

        {/* PATIENT SUMMARY CARD */}
        {patientName && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-50/70 border border-white space-y-3.5">
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 border-b border-white pb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-white rounded-xl border border-white text-slate-500 shrink-0">
                  <User size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pasien</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{patientName}</p>
                  <p className="text-[11px] text-slate-500">{noRM || "-"}</p>
                </div>
              </div>
              
              {statusGizi && (
                <div className="shrink-0 flex flex-col items-end">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">Status Gizi</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusGiziTheme.bg} ${statusGiziTheme.text}`}>
                    {statusGizi}
                  </span>
                </div>
              )}
            </div>

            {/* Nutrients mini grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Energi */}
              <div className="p-2.5 bg-white rounded-xl border border-white">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Kebutuhan Energi</p>
                <p className="text-sm font-bold text-slate-800">
                  {Math.round(energi).toLocaleString("id-ID")} <span className="text-[10px] font-medium text-slate-500">kkal</span>
                </p>
              </div>

              {/* Protein */}
              <div className="p-2.5 bg-white rounded-xl border border-white">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Protein</p>
                <p className="text-sm font-bold text-slate-800">
                  {Math.round(protein)} <span className="text-[10px] font-medium text-slate-500">gr</span>
                </p>
              </div>

              {/* Lemak */}
              <div className="p-2.5 bg-white rounded-xl border border-white">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Lemak</p>
                <p className="text-sm font-bold text-slate-800">
                  {Math.round(lemak)} <span className="text-[10px] font-medium text-slate-500">gr</span>
                </p>
              </div>

              {/* Karbohidrat */}
              <div className="p-2.5 bg-white rounded-xl border border-white">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Karbohidrat</p>
                <p className="text-sm font-bold text-slate-800">
                  {Math.round(karbohidrat)} <span className="text-[10px] font-medium text-slate-500">gr</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
          "
        >
          {/* PORTAL */}
          <button
            onClick={() => navigate("/portal")}
            className="
              flex-1
              h-12
              rounded-2xl
              bg-slate-100
              text-slate-700
              text-xs
              font-bold
              hover:bg-slate-200
              transition-all
              duration-300
            "
          >
            Portal
          </button>

          {/* HITUNG LAGI */}
          <button
            onClick={() => navigate("/perhitungan")}
            className="
              flex-1
              h-12
              rounded-2xl
              bg-blue-50
              text-blue-600
              text-xs
              font-bold
              hover:bg-blue-100
              transition-all
              duration-300
            "
          >
            Hitung Lagi
          </button>

          {/* RIWAYAT */}
          <button
            onClick={() => navigate("/riwayat")}
            className="
              flex-1
              h-12
              rounded-2xl
              bg-blue-600
              text-white
              text-xs
              font-bold
              shadow-lg
              shadow-blue-100/50
              hover:bg-blue-700
              hover:shadow-blue-200/50
              transition-all
              duration-300
            "
          >
            Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}
