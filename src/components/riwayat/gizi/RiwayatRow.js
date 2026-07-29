import {
  Eye,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  formatMakronutrienGram,
  getEnergiTotal,
  hasMakronutrienData,
} from "../../../utils/makronutrien";
import { getUser } from "../../../services/auth/authService";

const formatIndonesianDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

const formatIndonesianTime = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch (e) {
    return "-";
  }
};

const getRiwayatDate = (item) => (
  item?.tanggal_perhitungan ||
  item?.created_at ||
  item?.updated_at ||
  item?.tanggal
);

const getRoomName = (item) => (
  item?.ruang_bangsal ||
  item?.ruangan ||
  item?.nama_ruangan ||
  item?.bangsal ||
  "-"
);

export default function RiwayatRow({ item }) {
  const navigate = useNavigate();
  const energiTotal = getEnergiTotal(item);
  const hasMakro = hasMakronutrienData(item);
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const canModify = item.is_mine || isAdmin;
  const tanggalPerhitungan = getRiwayatDate(item);

  return (
    <tr
      className="
        border-b
        border-slate-100/70
        even:bg-slate-50/20
        hover:bg-blue-50/25
        transition-all
        duration-150
      "
    >
      {/* PASIEN */}
      <td className="px-10 py-5 text-left">
        <div className="flex flex-col items-start justify-start">
          <h4
            className="
              text-sm
              font-bold
              text-slate-800
              mb-0.5
            "
          >
            {item.nama_pasien}
          </h4>
          <p
            className="
              text-[11px]
              font-semibold
              text-slate-400
            "
          >
            No. RM: {item.no_rm}
          </p>
        </div>
      </td>

      {/* JK (JENIS KELAMIN) */}
      <td className="px-10 py-5 text-center">
        <span
          className={`
            inline-flex
            items-center
            px-2.5
            py-0.5
            rounded-lg
            text-[11px]
            font-extrabold
            border
            ${item.jenis_kelamin && item.jenis_kelamin.toUpperCase().startsWith("L") 
              ? "bg-blue-50/80 text-blue-600 border-blue-100/50" 
              : "bg-rose-50/80 text-rose-600 border-rose-100/50"
            }
          `}
        >
          {item.jenis_kelamin && item.jenis_kelamin.toUpperCase().startsWith("L") ? "L" : "P"}
        </span>
      </td>

      {/* KODE PENYAKIT */}
      <td className="px-10 py-5 text-center">
        <div
          className="
            inline-flex
            items-center
            px-2.5
            py-0.5
            rounded-lg
            bg-amber-50/80
            text-amber-700
            border
            border-amber-100/50
            text-[11px]
            font-bold
          "
        >
          {item.kode_penyakit || "-"}
        </div>
      </td>

      {/* RUANGAN */}
      <td className="px-10 py-5 text-center">
        <span
          className="
            inline-flex
            items-center
            px-2.5
            py-0.5
            rounded-lg
            bg-indigo-50/80
            text-indigo-700
            border
            border-indigo-100/50
            text-[11px]
            font-bold
          "
        >
          {getRoomName(item)}
        </span>
      </td>

      {/* ENERGI & MAKRONUTRIEN */}
      <td className="px-10 py-5 text-center">
        <div className="flex flex-col items-center justify-center">
          <h4
            className="
              text-sm
              font-extrabold
              text-slate-800
            "
          >
            {energiTotal?.toLocaleString("id-ID") || 0}{" "}
            <span className="text-xs font-normal text-slate-400">kkal</span>
          </h4>

          {hasMakro && (
            <div className="flex gap-1.5 mt-1.5 justify-center">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50/80 border border-blue-100/40 px-1.5 py-0.5 rounded-md">
                P: {formatMakronutrienGram(item, "protein")}
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50/80 border border-amber-100/40 px-1.5 py-0.5 rounded-md">
                L: {formatMakronutrienGram(item, "lemak")}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-100/40 px-1.5 py-0.5 rounded-md">
                K: {formatMakronutrienGram(item, "karbohidrat")}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* TANGGAL */}
      <td className="px-10 py-5 text-center">
        <p
          className="
            text-xs
            text-slate-600
            font-semibold
          "
        >
          {item.tanggal_perhitungan_rapi || formatIndonesianDate(tanggalPerhitungan)}
        </p>
        <p className="mt-1 text-[11px] font-bold text-slate-400">
          {item.jam_perhitungan ? `${item.jam_perhitungan} WIB` : `${formatIndonesianTime(tanggalPerhitungan)} WIB`}
        </p>
      </td>

      {/* PEMBUAT */}
      <td className="px-10 py-5 text-center">
        <div
          className={`
            inline-flex
            items-center
            px-2.5
            py-0.5
            rounded-lg
            text-[11px]
            font-bold
            border
            ${item.is_mine 
              ? "bg-emerald-50/80 text-emerald-700 border-emerald-100/50" 
              : "bg-slate-100/70 text-slate-600 border-slate-200/40"
            }
          `}
        >
          {item.created_by || "System"} {item.is_mine && "(Saya)"}
        </div>
      </td>

      {/* ACTION */}
      <td className="px-10 py-5 text-center">
        <div className="flex items-center gap-2 justify-center">
          {/* DETAIL */}
          <button
            onClick={() => {
              navigate(`/riwayat/${item.id_perhitungan}`);
            }}
            className="
              w-9
              h-9
              rounded-xl
              bg-blue-50/60
              text-blue-600
              flex
              items-center
              justify-center
              hover:bg-blue-600
              hover:text-white
              hover:shadow-md
              hover:shadow-blue-100
              transition-all
              duration-200
            "
            title="Lihat Riwayat Perhitungan"
          >
            <Eye size={16} />
          </button>

          {canModify && (
            <button
              onClick={() => {
                navigate("/assessment", {
                  state: {
                    isEditMode: true,
                    id_perhitungan: item.id_perhitungan,
                  },
                });
              }}
              className="
                w-9
                h-9
                rounded-xl
                bg-amber-50/60
                text-amber-600
                flex
                items-center
                justify-center
                hover:bg-amber-600
                hover:text-white
                hover:shadow-md
                hover:shadow-amber-100
                transition-all
                duration-200
              "
              title="Edit Perhitungan"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
