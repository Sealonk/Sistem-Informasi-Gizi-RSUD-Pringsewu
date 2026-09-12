import {
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CalendarDays,
} from "lucide-react";

export default function RingkasanPrediksi({ ringkasan }) {
  if (!ringkasan) return null;

  const items = [
    {
      icon: <Users size={18} className="text-violet-600" />,
      label: "Total Prediksi Periode",
      value: ringkasan.total_pasien,
      unit: "pasien",
      iconBg: "bg-violet-50",
    },
    {
      icon: <BarChart3 size={18} className="text-indigo-600" />,
      label: "Rata-rata per Hari",
      value: ringkasan.rata_rata,
      unit: "pasien",
      iconBg: "bg-indigo-50",
    },
    {
      icon: <TrendingUp size={18} className="text-emerald-600" />,
      label: "Prediksi Tertinggi",
      value: ringkasan.prediksi_tertinggi,
      unit: "pasien",
      iconBg: "bg-emerald-50",
    },
    {
      icon: <TrendingDown size={18} className="text-rose-600" />,
      label: "Prediksi Terendah",
      value: ringkasan.prediksi_terendah,
      unit: "pasien",
      iconBg: "bg-rose-50",
    },
    {
      icon: <CalendarDays size={18} className="text-amber-600" />,
      label: "Periode Prediksi",
      value: ringkasan.periode,
      unit: "",
      iconBg: "bg-amber-50",
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between min-h-[380px]">
      <div>
        <h3 className="font-bold text-slate-900 text-base mb-1">
          Ringkasan Prediksi
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Rangkuman metrik utama hasil kalkulasi model AI
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {items.map((item, index) => (
          <div key={index} className="w-full">
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-9
                    h-9
                    rounded-xl
                    ${item.iconBg}
                    flex
                    items-center
                    justify-center
                    shrink-0
                  `}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {item.label}
                </span>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  {typeof item.value === "number" ? item.value.toLocaleString("id-ID") : item.value}
                </span>
                {item.unit && (
                  <span className="text-[10px] text-slate-400 font-medium ml-1">
                    {item.unit}
                  </span>
                )}
              </div>
            </div>
            {index < items.length - 1 && (
              <div className="border-t border-slate-100 my-0.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
