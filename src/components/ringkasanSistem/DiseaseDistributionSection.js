import { useState } from "react";
import { Info, Calendar, RotateCcw, Filter, Loader2, BarChart2, ChevronDown, ChevronUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import SummaryPanel from "./SummaryPanel";

const colors = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export default function DiseaseDistributionSection({
  data = [],
  riwayatData = [],
  startDate = "",
  endDate = "",
  onDateChange,
  onReset,
  loading = false,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [showLainnyaDropdown, setShowLainnyaDropdown] = useState(false);

  const chartData = data.map((item, index) => ({
    name: item.nama,
    jumlah: Number(item.jumlah || 0),
    persentase: `${item.persentase}%`,
    fill: colors[index % colors.length],
  }));

  const hasActiveFilter = Boolean(startDate || endDate);

  const handleStartChange = (e) => {
    const val = e.target.value;
    if (onDateChange) {
      onDateChange(val, endDate);
    }
  };

  const handleEndChange = (e) => {
    const val = e.target.value;
    if (onDateChange) {
      onDateChange(startDate, val);
    }
  };

  const handleClear = () => {
    if (onReset) {
      onReset();
    } else if (onDateChange) {
      onDateChange("", "");
    }
  };

  const handleBarClick = (entry) => {
    if (entry && entry.name === "Lainnya") {
      setShowLainnyaDropdown(!showLainnyaDropdown);
    }
  };

  return (
    <SummaryPanel
      title="Distribusi Penyakit"
      icon={BarChart2}
      action={
        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            hasActiveFilter || showFilter
              ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
          title="Filter Tanggal"
        >
          <Filter size={13} />
          <span>Filter Tanggal</span>
          {hasActiveFilter && (
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          )}
        </button>
      }
    >
      {/* FILTER INPUTS PANEL */}
      {(showFilter || hasActiveFilter) && (
        <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/80 space-y-3 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
              <Calendar size={14} className="text-blue-600" />
              <span>Filter Rentang Tanggal</span>
            </div>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mb-1">
                Tanggal Awal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartChange}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mb-1">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndChange}
                className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTENT WITH LOADING OVERLAY */}
      <div className="relative mt-4">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-2xl">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-md border border-slate-100 text-xs font-bold text-blue-600">
              <Loader2 size={16} className="animate-spin" />
              <span>Memuat data...</span>
            </div>
          </div>
        )}

        {/* BAR CHART DIAGRAM BATANG */}
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#475569" }}
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  height={35}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fontWeight: 700, fill: "#475569" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                  formatter={(value, name, props) => [
                    `${value} Pasien (${props.payload.persentase})`,
                    "Jumlah Pasien",
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Bar
                  dataKey="jumlah"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                  animationDuration={800}
                  onClick={(entry) => handleBarClick(entry)}
                  style={{ cursor: "pointer" }}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className={entry.name === "Lainnya" ? "hover:opacity-80 transition-opacity cursor-pointer" : ""}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-xs font-semibold text-slate-400">
              Tidak ada data distribusi penyakit.
            </div>
          )}
        </div>

        {/* LEGEND BADGES WITH DROPDOWN BUTTON FOR "LAINNYA" */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {chartData.map((item) => {
            const isLainnya = item.name === "Lainnya";
            if (isLainnya) {
              const mifflinCount = riwayatData.filter((i) =>
                String(i.penyakit || "").toLowerCase().includes("mifflin")
              ).length;
              const criticalIllCount = riwayatData.filter((i) => {
                const lower = String(i.penyakit || "").toLowerCase();
                return lower.includes("critical") || lower.includes("icu");
              }).length;

              return (
                <div key={item.name} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowLainnyaDropdown(!showLainnyaDropdown)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      showLainnyaDropdown
                        ? "bg-amber-500 text-white border border-amber-600 shadow-md shadow-amber-200/50"
                        : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 hover:shadow"
                    }`}
                    title="Klik untuk melihat sub-penyakit Mifflin & Critical Ill"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${showLainnyaDropdown ? "bg-white" : ""}`}
                      style={{ backgroundColor: showLainnyaDropdown ? undefined : item.fill }}
                    />
                    <span>{item.name}:</span>
                    <span>{item.jumlah}</span>
                    <span className={showLainnyaDropdown ? "text-amber-100" : "text-amber-700/80"}>({item.persentase})</span>
                    {showLainnyaDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {/* COMPACT CLEAN DROPDOWN MENU FOR MIFFLIN & CRITICAL ILL */}
                  {showLainnyaDropdown && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-48 rounded-2xl bg-white border border-amber-200 p-2.5 shadow-xl z-40 animate-in fade-in duration-150">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-100 pb-1 text-center">
                        Sub-Penyakit Lainnya
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-xs font-bold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>Mifflin</span>
                          </div>
                          <span className="text-amber-900">{mifflinCount}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50/70 border border-rose-100 text-xs font-bold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            <span>Critical Ill</span>
                          </div>
                          <span className="text-rose-900">{criticalIllCount}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={item.name}
                className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-100"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                <span>{item.name}:</span>
                <span className="text-slate-900">{item.jumlah}</span>
                <span className="text-slate-400">({item.persentase})</span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex gap-3 rounded-xl bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-500">
          <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />
          <p>
            Distribusi berdasarkan penyakit utama pasien (Diagram Batang)
            {hasActiveFilter ? " pada rentang tanggal yang dipilih." : "."}{" "}
            <span className="font-semibold text-slate-700">
              Klik tombol <span className="text-amber-700 font-bold">"Lainnya <ChevronDown size={11} className="inline" />"</span> untuk melihat rincian penyakit Mifflin & Critical Ill.
            </span>
          </p>
        </div>
      </div>
    </SummaryPanel>
  );
}