import SummaryPanel from "./SummaryPanel";
import { averageNutrition } from "./ringkasanData";

export default function AverageNutritionSection() {
  return (
    <SummaryPanel title="Rata-rata Hasil Perhitungan">
      <div className="mt-5 divide-y divide-slate-100">
        {averageNutrition.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${item.background} ${item.color}`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-sm font-extrabold text-slate-800">
                  {item.label}
                </span>
              </div>

              <span className={`text-sm font-extrabold ${item.color}`}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </SummaryPanel>
  );
}
