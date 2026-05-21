import { ChevronRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { recentHistories } from "./ringkasanData";

const statusClass = {
  Normal: "bg-emerald-50 text-emerald-600",
  Overweight: "bg-amber-50 text-amber-600",
  Kurus: "bg-yellow-50 text-yellow-600",
};

export default function RecentHistorySection() {
  const navigate = useNavigate();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-sm font-extrabold text-slate-900">
          Riwayat Perhitungan Terakhir
        </h2>
        <button
          type="button"
          onClick={() => navigate("/riwayat")}
          className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-600 transition-colors hover:bg-blue-100"
        >
          <span>Lihat Semua</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-bold text-slate-500">
              <th className="px-4 py-3">Nama Pasien</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Metode</th>
              <th className="px-4 py-3">Energi (kkal)</th>
              <th className="px-4 py-3">Status Gizi</th>
              <th className="px-4 py-3">Penyakit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentHistories.map((item) => (
              <tr key={`${item.patient}-${item.time}`} className="text-xs">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{item.patient}</p>
                      <p className="mt-0.5 font-medium text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold text-slate-800">{item.date}</p>
                  <p className="mt-0.5 font-medium text-slate-500">{item.time}</p>
                </td>
                <td className="px-4 py-4 font-bold text-slate-700">{item.method}</td>
                <td className="px-4 py-4 font-bold text-slate-700">{item.energy}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 font-extrabold ${
                      statusClass[item.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 font-bold text-slate-700">{item.disease}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
