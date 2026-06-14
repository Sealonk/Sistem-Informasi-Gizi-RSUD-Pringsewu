import { ChevronRight } from "lucide-react";

export default function PasienRow({ patient, onSelect }) {
  return (
    <tr
      className="
        group
        transition-all
        duration-300
      "
    >
      {/* NAMA PASIEN */}
      <td
        className="
          pl-6
          py-5
          rounded-l-2xl
          border-y
          border-l
          border-slate-200/70
          bg-white/80
          group-hover:bg-emerald-50/20
          group-hover:border-emerald-200/50
          transition-all
          duration-300
        "
      >
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-0.5">
            {patient.nama}
          </h3>
          <div className="text-[11px] text-slate-400 font-medium">
            Masuk: {patient.tanggal || "-"}
          </div>
        </div>
      </td>

      {/* RM */}
      <td
        className="
          px-4
          py-5
          text-xs
          font-bold
          text-slate-600
          border-y
          border-slate-200/70
          bg-white/80
          group-hover:bg-emerald-50/20
          group-hover:border-emerald-200/50
          transition-all
          duration-300
        "
      >
        {patient.rm}
      </td>

      {/* DIAGNOSIS (JENIS PENYAKIT) */}
      <td
        className="
          px-4
          py-5
          border-y
          border-slate-200/70
          bg-white/80
          group-hover:bg-emerald-50/20
          group-hover:border-emerald-200/50
          transition-all
          duration-300
        "
      >
        <span
          className="
            inline-flex
            items-center
            rounded-xl
            bg-slate-50
            px-3
            py-1
            text-xs
            font-bold
            text-slate-600
            border
            border-slate-200/60
          "
        >
          {patient.diagnosis || "-"}
        </span>
      </td>

      {/* UMUR */}
      <td
        className="
          px-4
          py-5
          text-xs
          font-bold
          text-slate-600
          border-y
          border-slate-200/70
          bg-white/80
          group-hover:bg-emerald-50/20
          group-hover:border-emerald-200/50
          transition-all
          duration-300
        "
      >
        {patient.umur} tahun
      </td>

      {/* JENIS KELAMIN */}
      <td
        className="
          px-4
          py-5
          border-y
          border-slate-200/70
          bg-white/80
          group-hover:bg-emerald-50/20
          group-hover:border-emerald-200/50
          transition-all
          duration-300
        "
      >
        <span
          className={`
            inline-flex
            items-center
            rounded-xl
            px-3
            py-1
            text-xs
            font-bold
            border
            ${
              patient.jk === "Perempuan"
                ? "bg-rose-50/80 text-rose-600 border-rose-100"
                : "bg-sky-50/80 text-sky-600 border-sky-100"
            }
          `}
        >
          {patient.jk}
        </span>
      </td>

      {/* BUTTON PILIH */}
      <td
        className="
          pr-6
          py-5
          text-right
          rounded-r-2xl
          border-y
          border-r
          border-slate-200/70
          bg-white/80
          group-hover:bg-emerald-50/20
          group-hover:border-emerald-200/50
          transition-all
          duration-300
        "
      >
        <button
          onClick={() => onSelect(patient)}
          className="
            group/btn
            inline-flex
            items-center
            gap-1.5
            h-10
            px-4
            rounded-xl
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            text-xs
            font-bold
            tracking-wider
            uppercase
            shadow-sm
            hover:shadow-md
            hover:shadow-emerald-50/50
            transition-all
            duration-300
          "
        >
          Pilih
          <ChevronRight
            size={14}
            className="transition-transform duration-300 group-hover/btn:translate-x-1"
          />
        </button>
      </td>
    </tr>
  );
}