import { Info } from "lucide-react";
import DonutChart from "./DonutChart";
import SummaryPanel from "./SummaryPanel";
import { diseaseItems } from "./ringkasanData";

export default function DiseaseDistributionSection() {
  return (
    <SummaryPanel title="Distribusi Penyakit (1 Bulan Terakhir)">
      <div className="mt-7 flex flex-col items-center gap-7 sm:flex-row">
        <DonutChart items={diseaseItems} />

        <div className="w-full space-y-3">
          {diseaseItems.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 text-xs font-bold text-slate-700"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
              </div>
              <span>{item.value}</span>
              <span className="min-w-[54px] text-right text-slate-500">
                ({item.percent})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex gap-3 rounded-xl bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-500">
        <Info size={16} className="mt-0.5 shrink-0 text-blue-600" />
        <p>Distribusi berdasarkan penyakit utama yang tercatat pada data pasien.</p>
      </div>
    </SummaryPanel>
  );
}
