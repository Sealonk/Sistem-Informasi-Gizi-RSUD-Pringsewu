import { Info } from "lucide-react";

import DonutChart from "./DonutChart";
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
}) {

  const diseaseItems =
    data.map((item, index) => ({
      label: item.nama,
      value: item.jumlah,
      percent: `${item.persentase}%`,
      color:
        colors[index % colors.length],
    }));

  const maxValue =
    diseaseItems.length > 0
      ? Math.max(
          ...diseaseItems.map((d) => d.value)
        )
      : 0;

  return (

    <SummaryPanel title="Distribusi Penyakit">

      <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row">

        <DonutChart
          items={diseaseItems}
        />

        <div className="w-full space-y-1.5">

          {diseaseItems.map((item) => (

            <div
              key={item.label}
              className="group relative rounded-xl px-3 py-2.5 hover:bg-slate-50/80 transition-all duration-200"
            >

              {/* Background progress bar */}
              <div
                className="absolute inset-y-0 left-0 rounded-xl opacity-[0.08] transition-all duration-500"
                style={{
                  width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  backgroundColor: item.color,
                }}
              />

              <div className="relative grid grid-cols-[1fr_auto_auto] items-center gap-4 text-xs font-bold text-slate-700">

                <div className="flex items-center gap-2">

                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        item.color,
                    }}
                  />

                  <span>
                    {item.label}
                  </span>

                </div>

                <span>
                  {item.value}
                </span>

                <span className="min-w-[54px] text-right text-slate-500">
                  ({item.percent})
                </span>

              </div>

            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex gap-3 rounded-xl bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-500">

        <Info
          size={16}
          className="mt-0.5 shrink-0 text-blue-600"
        />

        <p>
          Distribusi berdasarkan penyakit utama pasien.
        </p>

      </div>

    </SummaryPanel>
  );
}