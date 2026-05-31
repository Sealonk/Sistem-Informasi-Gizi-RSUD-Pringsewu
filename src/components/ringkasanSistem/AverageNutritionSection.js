import {
  Flame,
  Beef,
  Droplets,
  Wheat,
} from "lucide-react";

import SummaryPanel from "./SummaryPanel";

export default function AverageNutritionSection({
  data,
}) {

  const averageNutrition = [
    {
      label: "Energi",
      value: `${data?.energi_kkal || 0} kkal`,
      icon: Flame,
      background: "bg-orange-50",
      color: "text-orange-600",
    },
    {
      label: "Protein",
      value: `${data?.protein_gram || 0} g`,
      icon: Beef,
      background: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Lemak",
      value: `${data?.lemak_gram || 0} g`,
      icon: Droplets,
      background: "bg-yellow-50",
      color: "text-yellow-600",
    },
    {
      label: "Karbohidrat",
      value: `${data?.karbohidrat_gram || 0} g`,
      icon: Wheat,
      background: "bg-emerald-50",
      color: "text-emerald-600",
    },
  ];

  return (

    <SummaryPanel title="Rata-rata Hasil Perhitungan">

      <div className="mt-5 divide-y divide-slate-100">

        {averageNutrition.map((item) => {

          const Icon =
            item.icon;

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