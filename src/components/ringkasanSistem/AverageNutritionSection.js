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
      cardBg: "bg-orange-50/50",
      cardBorder: "border-orange-100",
      iconBg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      label: "Protein",
      value: `${data?.protein_gram || 0} g`,
      icon: Beef,
      cardBg: "bg-blue-50/50",
      cardBorder: "border-blue-100",
      iconBg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      label: "Lemak",
      value: `${data?.lemak_gram || 0} g`,
      icon: Droplets,
      cardBg: "bg-yellow-50/50",
      cardBorder: "border-yellow-100",
      iconBg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      label: "Karbohidrat",
      value: `${data?.karbohidrat_gram || 0} g`,
      icon: Wheat,
      cardBg: "bg-emerald-50/50",
      cardBorder: "border-emerald-100",
      iconBg: "bg-emerald-100",
      color: "text-emerald-600",
    },
  ];

  return (

    <SummaryPanel title="Rata-rata Hasil Perhitungan">

      <div className="mt-5 grid grid-cols-2 gap-3">

        {averageNutrition.map((item) => {

          const Icon =
            item.icon;

          return (

            <div
              key={item.label}
              className={`rounded-2xl border p-4 ${item.cardBg} ${item.cardBorder}`}
            >

              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} ${item.color}`}
              >
                <Icon size={22} />
              </div>

              <span className={`text-lg font-extrabold ${item.color}`}>
                {item.value}
              </span>

              <p className="mt-0.5 text-xs text-slate-500">
                {item.label}
              </p>

            </div>
          );
        })}
      </div>

    </SummaryPanel>
  );
}