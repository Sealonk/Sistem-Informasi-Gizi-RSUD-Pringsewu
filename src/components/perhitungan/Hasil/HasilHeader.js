import {
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function HasilHeader({
  data,
}) {
  const isChanged = (field, currentValue) => {
    if (!data.originalValues) return false;
    const originalValue = data.originalValues[field];
    const cleanCurrent = String(currentValue ?? "").trim().toLowerCase();
    const cleanOriginal = String(originalValue ?? "").trim().toLowerCase();
    return cleanCurrent !== cleanOriginal;
  };

  const renderChangedBadge = (field, currentValue) => {
    if (isChanged(field, currentValue)) {
      return (
        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-250">
          Diubah
        </span>
      );
    }
    return null;
  };

  /* TANGGAL */
  const tanggal =
    data.tanggal ||
    new Date().toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  // Helper to format or display date
  const renderTanggalMasuk = () => {
    if (!data.tanggal_masuk || data.tanggal_masuk === "-") return "-";
    const dateStr = String(data.tanggal_masuk);
    if (/[a-zA-Z]/.test(dateStr) || dateStr.includes(" ")) {
      return dateStr;
    }
    try {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      }
    } catch (e) {
      // ignore
    }
    return dateStr;
  };

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        p-5
        sm:p-8
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        ease-out
      "
    >
      {/* Decorative Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-[32px]" />

      {/* Decorative Glow Circle */}
      <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 opacity-[0.03] blur-xl" />

      <div
        className="
          flex
          flex-col
          gap-6
          relative
          z-10
        "
      >
        {/* TOP ROW: AVATAR, NAME, VALIDATION BADGE */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-5 border-b border-slate-100/80 pb-5">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* AVATAR */}
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-gradient-to-br
                from-blue-500
                to-indigo-600
                text-white
                flex
                items-center
                justify-center
                shrink-0
                shadow-lg
                shadow-blue-200/50
              "
            >
              <UserRound size={28} strokeWidth={2} />
            </div>

            {/* NAME */}
            <div>
              <h1
                className="
                  text-2xl
                  font-extrabold
                  tracking-tight
                  text-slate-800
                  mb-1
                  leading-tight
                "
              >
                {data.nama || "Nama Pasien"}
              </h1>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Rincian Informasi Medis Pasien
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div
            className="
              inline-flex
              items-center
              gap-1.5
              px-4
              py-2
              rounded-xl
              bg-emerald-50
              text-emerald-700
              border
              border-emerald-100/60
              text-xs
              font-extrabold
              shrink-0
              shadow-sm
              shadow-emerald-50/50
            "
          >
            <ShieldCheck size={14} className="text-emerald-600" />
            Data Valid
          </div>
        </div>

        {/* DETAILS GRID */}
        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-6
            gap-4
          "
        >
          {/* RM */}
          <div className="bg-slate-50/40 border border-slate-100/80 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50/80 hover:border-slate-200/50">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              No. RM
            </p>
            <h4 className="text-sm font-bold text-slate-800 leading-tight">
              {data.noRM || "RM-0000"}
            </h4>
          </div>

          {/* KODE PENYAKIT */}
          <div className="bg-slate-50/40 border border-slate-100/80 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50/80 hover:border-slate-200/50">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Kode Penyakit
            </p>
            <h4 className="text-sm font-bold text-slate-800 leading-tight">
              {data.diagnosis || "-"}
            </h4>
          </div>

          {/* UMUR */}
          <div className="bg-slate-50/40 border border-slate-100/80 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50/80 hover:border-slate-200/50">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Umur
            </p>
            <h4 className="text-sm font-bold text-slate-800 leading-tight flex items-center flex-wrap">
              {data.umur || "0"} Tahun
              {renderChangedBadge("umur", data.umur)}
            </h4>
          </div>

          {/* JK */}
          <div className="bg-slate-50/40 border border-slate-100/80 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50/80 hover:border-slate-200/50">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Jenis Kelamin
            </p>
            <h4 className="text-sm font-bold text-slate-800 leading-tight flex items-center flex-wrap">
              {data.jenisKelamin === "P" || data.jenisKelamin === "Perempuan" ? "Perempuan" : "Laki-laki"}
              {renderChangedBadge("jenisKelamin", data.jenisKelamin)}
            </h4>
          </div>

          {/* TANGGAL MASUK */}
          <div className="bg-slate-50/40 border border-slate-100/80 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50/80 hover:border-slate-200/50">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Tanggal Masuk
            </p>
            <h4 className="text-sm font-bold text-slate-800 leading-tight">
              {renderTanggalMasuk()}
            </h4>
          </div>

          {/* TANGGAL PERHITUNGAN */}
          <div className="bg-slate-50/40 border border-slate-100/80 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50/80 hover:border-slate-200/50">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Tanggal Perhitungan
            </p>
            <h4 className="text-sm font-bold text-slate-800 leading-tight">
              {tanggal}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}