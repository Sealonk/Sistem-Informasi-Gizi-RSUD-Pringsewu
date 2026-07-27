import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Flame, Beef, Droplets, Wheat } from "lucide-react";
import SummaryPanel from "./SummaryPanel";

export default function AverageNutritionSection({ data }) {
  const protein = Number(data?.protein_gram || 0);
  const lemak = Number(data?.lemak_gram || 0);
  const karbo = Number(data?.karbohidrat_gram || 0);
  const energi = Number(data?.energi_kkal || 0);

  const totalMacro = protein + lemak + karbo;

  const pieData = [
    { name: "Protein", value: protein, color: "#3b82f6", unit: "g" },
    { name: "Lemak", value: lemak, color: "#eab308", unit: "g" },
    { name: "Karbohidrat", value: karbo, color: "#10b981", unit: "g" },
  ].filter((item) => item.value > 0);

  const averageNutrition = [
    {
      label: "Energi",
      value: `${energi} kkal`,
      icon: Flame,
      cardBg: "bg-orange-50/50",
      cardBorder: "border-orange-100",
      iconBg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      label: "Protein",
      value: `${protein} g`,
      icon: Beef,
      cardBg: "bg-blue-50/50",
      cardBorder: "border-blue-100",
      iconBg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      label: "Lemak",
      value: `${lemak} g`,
      icon: Droplets,
      cardBg: "bg-yellow-50/50",
      cardBorder: "border-yellow-100",
      iconBg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      label: "Karbohidrat",
      value: `${karbo} g`,
      icon: Wheat,
      cardBg: "bg-emerald-50/50",
      cardBorder: "border-emerald-100",
      iconBg: "bg-emerald-100",
      color: "text-emerald-600",
    },
  ];

  return (
    <SummaryPanel title="Rata-rata Hasil Perhitungan">
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        {/* PIE CHART */}
        <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
          {totalMacro > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={800}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} g`, name]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-400">
              Tidak Ada Data
            </div>
          )}

          {totalMacro > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-extrabold text-slate-800">{energi}</span>
              <span className="text-[10px] font-bold text-slate-400">kkal/hari</span>
            </div>
          )}
        </div>

        {/* METRICS GRID */}
        <div className="w-full grid grid-cols-2 gap-2.5">
          {averageNutrition.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`rounded-2xl border p-3 ${item.cardBg} ${item.cardBorder} transition-all hover:scale-[1.02] duration-200`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.iconBg} ${item.color}`}>
                    <Icon size={15} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{item.label}</span>
                </div>
                <span className={`text-base font-extrabold ${item.color}`}>{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </SummaryPanel>
  );
}