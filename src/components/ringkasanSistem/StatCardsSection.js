import { stats } from "./ringkasanData";

const toneClass = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    value: "text-blue-600",
    stroke: "#2563eb",
    fill: "rgba(37, 99, 235, 0.12)",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
    value: "text-emerald-600",
    stroke: "#22c55e",
    fill: "rgba(34, 197, 94, 0.12)",
  },
  purple: {
    icon: "bg-purple-50 text-purple-600",
    value: "text-purple-600",
    stroke: "#9333ea",
    fill: "rgba(147, 51, 234, 0.12)",
  },
};

export default function StatCardsSection() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((item) => {
        const Icon = item.icon;
        const tone = toneClass[item.tone];

        return (
          <article
            key={item.title}
            className="flex min-h-[150px] items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-soft"
          >
            <div className="flex items-center gap-5">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tone.icon}`}
              >
                <Icon size={32} strokeWidth={2.2} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">{item.title}</p>
                <p className={`mt-2 text-3xl font-extrabold ${tone.value}`}>
                  {item.value}
                </p>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  {item.caption}
                </p>
              </div>
            </div>

            <svg
              viewBox="0 0 100 56"
              className="hidden h-16 w-28 shrink-0 md:block"
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
                strokeWidth="4"
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
