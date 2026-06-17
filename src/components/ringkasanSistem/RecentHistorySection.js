import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getRiwayat } from "../../services/riwayat/riwayatApi";

import SummaryPanel from "./SummaryPanel";

const getStatusGiziStyle = (status) => {
  if (!status) return 'bg-slate-100 text-slate-600';
  const s = status.toLowerCase();
  if (s.includes('normal')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (s.includes('kurus') || s.includes('kekurangan')) return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (s.includes('kelebihan') || s.includes('overweight')) return 'bg-orange-50 text-orange-700 border border-orange-200';
  if (s.includes('obesitas')) return 'bg-red-50 text-red-700 border border-red-200';
  return 'bg-slate-100 text-slate-600 border border-slate-200';
};

export default function RecentHistorySection({
  data = [],
}) {

  const navigate =
    useNavigate();

  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    async function fetchRealHistories() {
      try {
        const res = await getRiwayat({ page: 1, limit: 100 });
        if (res && res.status === "success" && res.data && res.data.riwayat) {
          setHistoryList(res.data.riwayat);
        }
      } catch (err) {
        console.error("Gagal memuat real histories untuk matching:", err);
      }
    }
    fetchRealHistories();
  }, [data]);

  const histories =
    Array.isArray(data)
      ? data
      : [];

  return (

    <SummaryPanel
      title="Riwayat Perhitungan Terakhir"
      className="overflow-hidden"
      action={
        <button
          onClick={() => navigate("/riwayat")}
          className="text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-4 py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-100"
        >
          Lihat Semua
        </button>
      }
    >

      {histories.length === 0 ? (

        <div
          className="
            mt-5
            flex
            min-h-[132px]
            flex-col
            items-center
            justify-center
            rounded-xl
            bg-slate-50
            px-4
            text-center
          "
        >

          <ClipboardList
            size={28}
            className="
              mb-3
              text-slate-400
            "
          />

          <p
            className="
              text-sm
              font-bold
              text-slate-700
            "
          >
            Belum ada riwayat perhitungan.
          </p>

          <p
            className="
              mt-1
              text-xs
              font-medium
              text-slate-500
            "
          >
            Data terbaru akan muncul
            setelah perhitungan disimpan.
          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table
            className="
              w-full
              min-w-[1060px]
              text-left
            "
          >

            <thead className="border-b-2 border-slate-200/80">

              <tr
                className="
                  text-xs
                  font-extrabold
                  uppercase
                  text-slate-400
                "
              >

                <th className="pb-3 pr-4">
                  Pasien
                </th>

                <th className="pb-3 pr-4">
                  Tgl Masuk
                </th>

                <th className="pb-3 pr-4">
                  Kode Penyakit
                </th>

                <th className="pb-3 pr-4">
                  Energi
                </th>

                <th className="pb-3 pr-4">
                  Makronutrien
                </th>

                <th className="pb-3 pr-4">
                  Status Gizi
                </th>

                <th className="pb-3 pr-4">
                  Tanggal
                </th>

                <th className="pb-3 text-right">
                  Detail
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {histories.map(
                (item, index) => (

                  <tr
                    key={`${item.nama_pasien}-${index}`}
                    className={`
                      text-sm
                      text-slate-700
                      hover:bg-blue-50/40
                      hover:shadow-sm
                      transition-all
                      duration-200
                      ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}
                    `}
                  >

                    {/* PASIEN */}
                    <td className="py-4 pr-4">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-blue-600
                          "
                        >
                          <UserRound size={18} />
                        </div>

                        <div>

                          <p
                            className="
                              font-extrabold
                              text-slate-900
                            "
                          >
                            {item.nama_pasien || "-"}
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-xs
                              font-medium
                              text-slate-400
                            "
                          >
                            No. RM: {item.no_rm || "-"}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* TGL MASUK */}
                    <td className="py-4 pr-4">
                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-xs
                          font-bold
                          text-slate-500
                        "
                      >
                        <CalendarDays size={13} className="text-blue-500" />
                        <span>{item.tanggal_masuk || "-"}</span>
                      </div>
                    </td>

                    {/* KODE PENYAKIT */}
                    <td className="py-4 pr-4">

                      <span
                        className="
                          inline-flex
                          rounded-xl
                          bg-amber-50
                          px-3
                          py-1
                          text-xs
                          font-bold
                          text-amber-700
                        "
                      >
                        {item.kode_penyakit || "-"}
                      </span>

                    </td>

                    {/* ENERGI */}
                    <td
                      className="
                        py-4
                        pr-4
                        font-extrabold
                        text-slate-900
                      "
                    >
                      {item.energi || 0} kkal
                    </td>

                    {/* MAKRONUTRIEN */}
                    <td className="py-4 pr-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="font-semibold text-blue-600">
                          P: {item.makronutrien?.protein ?? "-"}%
                        </span>
                        <span className="font-semibold text-yellow-600">
                          L: {item.makronutrien?.lemak ?? "-"}%
                        </span>
                        <span className="font-semibold text-emerald-600">
                          K: {item.makronutrien?.karbohidrat ?? "-"}%
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-4 pr-4">

                      <span
                        className={`inline-flex rounded-xl px-3 py-1 text-xs font-bold ${getStatusGiziStyle(item.status_gizi)}`}
                      >
                        {item.status_gizi || "-"}
                      </span>

                    </td>

                    {/* TANGGAL */}
                    <td className="py-4 pr-4">

                      <div
                        className="
                          flex
                          flex-col
                          text-xs
                          font-bold
                          text-slate-500
                        "
                      >

                        <span>
                          {item.tanggal || "-"}
                        </span>

                        <span className="mt-1">
                          {item.jam || "-"} WIB
                        </span>

                      </div>

                    </td>

                    {/* DETAIL */}
<td className="py-4 text-right">

  <button
    type="button"
    onClick={() => {
      let calculationId = item.id_perhitungan || item.id || item.id_riwayat;
      
      if (!calculationId && historyList.length > 0) {
        // Filter candidates by RM and Name
        const candidates = historyList.filter((h) => {
          const normMatch = String(h.no_rm || "").trim().toLowerCase() === String(item.no_rm || "").trim().toLowerCase();
          const nameMatch = String(h.nama_pasien || "").trim().toLowerCase() === String(item.nama_pasien || "").trim().toLowerCase();
          return normMatch && nameMatch;
        });

        if (candidates.length === 1) {
          calculationId = candidates[0].id_perhitungan;
        } else if (candidates.length > 1) {
          // Find the one with the closest energy
          const itemEnergy = parseFloat(String(item.energi || "").replace(/[^\d.]/g, ""));
          let bestMatch = candidates[0];
          let minDiff = Infinity;

          candidates.forEach((cand) => {
            const candEnergy = parseFloat(String(cand.total_energi || "").replace(/[^\d.]/g, ""));
            if (!isNaN(itemEnergy) && !isNaN(candEnergy)) {
              const diff = Math.abs(itemEnergy - candEnergy);
              if (diff < minDiff) {
                minDiff = diff;
                bestMatch = cand;
              }
            }
          });
          calculationId = bestMatch.id_perhitungan;
        }
      }

      console.log("Navigating to detail with item:", item, "Resolved ID:", calculationId);
      navigate(
        `/riwayat/${calculationId}`
      );
    }}
    className="
      inline-flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      bg-blue-50
      text-blue-600
      transition-all
      hover:bg-blue-100
    "
  >

    <ArrowRight size={18} />

  </button>

</td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </SummaryPanel>
  );
}