import React from "react";
import {
  Bed,
  Building2,
  Calendar,
  CheckCircle,
  RotateCcw,
  Search,
} from "lucide-react";

export default function FilterCard({
  periode,
  setPeriode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  search,
  setSearch,
  statusPerhitungan,
  setStatusPerhitungan,
  ruangan,
  setRuangan,
  statusPulang,
  setStatusPulang,
  ruanganOptions = [],
  ruanganError = "",
  error,
  onReset,
  onSearch,
}) {
  const periodOptions = [
    { label: "Semua", value: "" },
    { label: "Hari Ini", value: "Hari Ini" },
    { label: "Minggu Ini", value: "Minggu Ini" },
    { label: "Bulan Ini", value: "Bulan Ini" },
    { label: "Custom", value: "Custom" },
  ];

  const statusOptions = [
    { label: "Semua", value: "" },
    { label: "Sudah Dihitung", value: "sudah" },
    { label: "Belum", value: "belum" },
  ];

  const statusPulangOptions = [
    { label: "Semua", value: "" },
    { label: "Belum Pulang", value: "belum" },
    { label: "Sudah Pulang", value: "sudah" },
  ];

  const isCustomPeriod = periode === "Custom" || periode === "custom";
  const isCustomRangeIncomplete = isCustomPeriod && (!startDate || !endDate);
  const isInvalidCustomRange = isCustomPeriod && startDate && endDate && startDate > endDate;
  const isSearchDisabled = isCustomRangeIncomplete || isInvalidCustomRange;

  const optionButtonClass = (isActive) => `
    h-10
    px-4
    rounded-xl
    border
    text-xs
    font-bold
    transition-all
    duration-300
    ${
      isActive
        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-100 hover:bg-emerald-700"
        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
    }
  `;

  return (
    <div
      className="
        rounded-[28px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        p-5
        sm:p-7
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        mb-8
      "
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
              <Search size={18} className="text-emerald-600" />
              <h3>Cari Pasien</h3>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Cari nama pasien atau No. RM"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSearchDisabled) {
                    onSearch();
                  }
                }}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition-all
                  duration-300
                  hover:border-slate-300
                  focus:border-emerald-500
                  focus:ring-4
                  focus:ring-emerald-500/10
                "
              />

              <button
                type="button"
                onClick={onSearch}
                disabled={isSearchDisabled}
                className={`
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  px-6
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-white
                  transition-all
                  duration-300
                  sm:min-w-[116px]
                  ${
                    isSearchDisabled
                      ? "cursor-not-allowed border border-slate-100 bg-slate-200 text-slate-400"
                      : "bg-slate-900 hover:bg-slate-800 hover:shadow-md active:scale-95"
                  }
                `}
              >
                <Search size={14} />
                Cari
              </button>
            </div>

            {error && (
              <p className="mt-2 text-xs font-semibold text-rose-500">
                {error}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onReset}
            className="
              inline-flex
              h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              px-4
              text-xs
              font-bold
              text-slate-500
              transition-all
              hover:bg-slate-100/80
              hover:text-slate-800
              active:scale-95
              lg:mb-0.5
            "
          >
            <RotateCcw size={14} />
            Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Calendar size={18} className="text-emerald-600" />
              <h3>Periode Data</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {periodOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={optionButtonClass(periode === opt.value)}
                  onClick={() => setPeriode(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  Mulai
                  {isCustomPeriod && (
                    <span className="text-[10px] text-emerald-600 font-semibold lowercase">Custom</span>
                  )}
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onFocus={() => {
                    if (!isCustomPeriod) setPeriode("Custom");
                  }}
                  className={`
                    h-11
                    w-full
                    rounded-xl
                    border
                    px-3.5
                    text-sm
                    outline-none
                    transition-all
                    duration-300
                    ${
                      isCustomPeriod
                        ? "border-emerald-300 bg-emerald-50/20 text-slate-800 hover:border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }
                  `}
                />
              </label>

              <label className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  Akhir
                  {isCustomPeriod && (
                    <span className="text-[10px] text-emerald-600 font-semibold lowercase">Custom</span>
                  )}
                </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  onFocus={() => {
                    if (!isCustomPeriod) setPeriode("Custom");
                  }}
                  className={`
                    h-11
                    w-full
                    rounded-xl
                    border
                    px-3.5
                    text-sm
                    outline-none
                    transition-all
                    duration-300
                    ${
                      isCustomPeriod
                        ? "border-emerald-300 bg-emerald-50/20 text-slate-800 hover:border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }
                  `}
                />
              </label>
            </div>

            {isCustomRangeIncomplete && (
              <p className="text-xs font-semibold text-rose-500">
                Pilih tanggal mulai dan tanggal akhir untuk filter custom.
              </p>
            )}

            {isInvalidCustomRange && (
              <p className="text-xs font-semibold text-rose-500">
                Tanggal mulai tidak boleh lebih besar dari tanggal akhir.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <CheckCircle size={18} className="text-emerald-600" />
              <h3>Status Perhitungan</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={optionButtonClass(statusPerhitungan === opt.value)}
                  onClick={() => setStatusPerhitungan(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Building2 size={18} className="text-emerald-600" />
              <h3>Ruangan</h3>
            </div>

            <select
              value={ruangan}
              onChange={(e) => setRuangan(e.target.value)}
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-sm
                text-slate-800
                outline-none
                transition-all
                duration-300
                hover:border-slate-300
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-500/10
              "
            >
              <option value="">Semua Ruangan</option>
              {ruanganOptions.map((item) => (
                <option key={item.kd_bangsal} value={item.nm_bangsal}>
                  {item.nm_bangsal}
                </option>
              ))}
            </select>

            {ruanganError && (
              <p className="text-xs font-semibold text-rose-500">
                {ruanganError}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Bed size={18} className="text-emerald-600" />
              <h3>Status Pulang</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusPulangOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={optionButtonClass(statusPulang === opt.value)}
                  onClick={() => setStatusPulang(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
