import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PasienRow({
  patient,
}) {

  const navigate = useNavigate();

  return (

    <tr className="border-b border-slate-100 hover:bg-blue-50/40 transition-all duration-300">

      {/* NAMA */}
      <td className="px-6 py-5">
        <div>
          <h3 className="text-[15px] font-semibold text-slate-900 mb-1">{patient.nama}</h3>
          <div className="text-sm text-slate-500">{patient.tanggal}</div>
        </div>
      </td>

      {/* RM */}
      <td className="px-6 py-5 text-sm text-slate-600">{patient.rm}</td>

      {/* UMUR */}
      <td className="px-6 py-5 text-sm text-slate-600">{patient.umur}</td>

      {/* JK */}
      <td className="px-6 py-5 text-sm text-slate-600">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${patient.jk === 'Perempuan' ? 'bg-pink-100 text-pink-700' : 'bg-sky-100 text-sky-700'}`}>
          {patient.jk}
        </span>
      </td>

      {/* RUANGAN */}
      <td className="px-6 py-5 text-sm text-slate-600">{patient.ruangan}</td>

      {/* BUTTON */}
      <td className="px-6 py-5 text-right">
        <button
          onClick={() => navigate("/assessment")}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-2xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-300"
        >
          Pilih
          <ChevronRight size={16} />
        </button>
      </td>

    </tr>
  );
}