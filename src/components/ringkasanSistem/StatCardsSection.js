import {
  Calculator,
  ClipboardList,
  FolderKanban,
} from "lucide-react";

const toneClass = {
  blue: {
    icon: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    value: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
    stroke: "#2563eb",
    fill: "rgba(37, 99, 235, 0.08)",
    gradient: "from-blue-500 to-indigo-600",
    glow: "hover:shadow-blue-500/8 hover:border-blue-200/80"
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    value: "bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent",
    stroke: "#10b981",
    fill: "rgba(16, 185, 129, 0.08)",
    gradient: "from-emerald-500 to-teal-600",
    glow: "hover:shadow-emerald-500/8 hover:border-emerald-200/80"
  },
  purple: {
    icon: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    value: "bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent",
    stroke: "#8b5cf6",
    fill: "rgba(139, 92, 246, 0.08)",
    gradient: "from-purple-500 to-indigo-600",
    glow: "hover:shadow-purple-500/8 hover:border-purple-200/80"
  },
};

export default function StatCardsSection({
  data,
}) {

  const stats = [
    {
      title: "Total Perhitungan",
      value:
        data?.total_perhitungan_bulan_ini || 0,
      caption: "Selama 1 bulan terakhir",
      tone: "blue",
      icon: Calculator,
      trend: "M8 42 L24 26 L38 31 L54 15 L68 22 L82 8",
    },
    {
      title: "Perhitungan Hari Ini",
      value:
        data?.perhitungan_hari_ini || 0,
      caption: "Data hari ini",
      tone: "green",
      icon: ClipboardList,
      trend: "M8 40 L20 24 L32 30 L46 14 L60 22 L76 6 L92 18",
    },
    {
      title: "Total Riwayat",
      value:
        data?.total_riwayat_keseluruhan || 0,
      caption: "Data tersimpan",
      tone: "purple",
      icon: FolderKanban,
      trend: "M8 36 L24 20 L38 25 L52 10 L66 18 L80 6 L92 16",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {stats.map((item) => {

        const Icon = item.icon;
        const tone = toneClass[item.tone];

        return (
          <article
            key={item.title}
            className={`
              group
              relative
              overflow-hidden
              flex 
              min-h-[150px] 
              items-center 
              justify-between 
              rounded-[28px] 
              border 
              border-slate-200/80 
              bg-white/75 
              backdrop-blur-md 
              p-6 
              shadow-sm 
              transition-all 
              duration-500 
              ease-out
              hover:-translate-y-1.5
              hover:shadow-xl
              ${tone.glow}
            `}
          >
            {/* Top accent bar */}
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${tone.gradient}`} />

            {/* Inner background hover glow */}
            <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gradient-to-br ${tone.gradient} opacity-0 group-hover:opacity-[0.03] blur-xl transition-all duration-500`} />

            <div className="flex items-center gap-5 relative z-10">
              <div
                className={`
                  flex 
                  h-16 
                  w-16 
                  items-center 
                  justify-center 
                  rounded-[20px] 
                  transition-all 
                  duration-500 
                  ${tone.icon}
                `}
              >
                <Icon size={30} strokeWidth={2} className="transition-transform duration-500 group-hover:scale-110" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {item.title}
                </p>

                <p className={`mt-1 text-3xl font-extrabold leading-none py-1 ${tone.value}`}>
                  {item.value}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-400">
                  {item.caption}
                </p>
              </div>
            </div>

            <svg
              viewBox="0 0 100 56"
              className="hidden h-16 w-24 shrink-0 md:block relative z-10 transition-transform duration-500 group-hover:scale-105"
              aria-hidden="true"
            >
              <path
                d={`${item.trend} L92 56 L8 56 Z`}
                fill={tone.fill}
                stroke="none"
              />

              <path
                d={item.trend}
                fill="none"
                stroke={tone.stroke}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </article>
        );
      })}
    </section>
  );
}