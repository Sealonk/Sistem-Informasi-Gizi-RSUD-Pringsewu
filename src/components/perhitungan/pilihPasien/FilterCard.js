import React from "react";
import { Calendar, Search, RotateCcw } from "lucide-react";

export default function FilterCard({
  periode,
  setPeriode,
  selectedDate,
  setSelectedDate,
  search,
  setSearch,
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
        mb-8
      "
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Periode Data */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Calendar size={18} className="text-emerald-600" />
            <h3>1. Periode Data</h3>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {periodOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`
                  h-11
                  px-4
                  rounded-xl
                  border
                  text-xs
                  font-bold
                  transition-all
                  duration-300
                  ${
                    periode === opt.value
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-100 hover:bg-emerald-700"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }
                `}
                onClick={() => setPeriode(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={periode !== "Custom"}
              className={`
                h-12
                rounded-xl
                border
                px-4
                text-sm
                w-full
                outline-none
                transition-all
                duration-300
                ${
                  periode !== "Custom"
                    ? "bg-slate-50/50 text-slate-400 border-slate-100 cursor-not-allowed"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50"
                }
              `}
            />

            {periode === "Custom" && !selectedDate && (
              <p className="mt-2 text-xs font-semibold text-rose-500">
                ⚠️ Pilih tanggal terlebih dahulu untuk filter custom.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Cari Pasien */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Search size={18} className="text-emerald-600" />
              <h3>2. Cari Pasien</h3>
            </div>

            <button
              onClick={onReset}
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                font-bold
                text-slate-500
                hover:text-slate-800
                hover:bg-slate-100/80
                px-3
                py-1.5
                rounded-xl
                transition-all
              "
            >
              <RotateCcw size={13} />
              Reset Filter
            </button>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Cari berdasarkan nama pasien atau No. RM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-12
                rounded-xl
                border
                border-slate-200
                hover:border-slate-300
                px-4
                text-sm
                w-full
                text-slate-800
                outline-none
                focus:border-emerald-500
                focus:ring-4
                focus:ring-emerald-50/50
                transition-all
                duration-300
              "
            />

            <button
              onClick={onSearch}
              disabled={periode === "Custom" && !selectedDate}
              className={`
                h-12
                px-6
                rounded-xl
                text-xs
                font-bold
                tracking-wider
                uppercase
                text-white
                flex
                items-center
                gap-2
                transition-all
                duration-300
                ${
                  periode === "Custom" && !selectedDate
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-100"
                    : "bg-slate-900 hover:bg-slate-800 hover:shadow-md"
                }
              `}
            >
              <Search size={14} />
              Cari
            </button>
          </div>

          {error && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              ⚠️ {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}