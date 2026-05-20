import {
  Eye,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function RiwayatRow({
  item,
}) {

  const navigate =
    useNavigate();

  return (

    <tr
      className="
        border-b
        border-slate-100
        hover:bg-slate-50/70
        transition-all
      "
    >

      {/* PASIEN */}
      <td
        className="
          px-6
          py-5
        "
      >

        <div>

          <h4
            className="
              text-sm
              font-semibold
              text-slate-900
              mb-1
            "
          >
            {item.nama}
          </h4>

          <p
            className="
              text-xs
              text-slate-500
            "
          >
            ID:
            {" "}
            {item.id}
          </p>

        </div>

      </td>

      {/* PENYAKIT */}
      <td
        className="
          px-6
          py-5
        "
      >

        <div
          className="
            inline-flex
            items-center
            px-3
            py-1
            rounded-xl
            bg-amber-50
            text-amber-700
            text-xs
            font-semibold
          "
        >
          {item.penyakit}
        </div>

      </td>

      {/* ENERGI */}
      <td
        className="
          px-6
          py-5
        "
      >

        <div>

          <h4
            className="
              text-sm
              font-bold
              text-slate-900
            "
          >
            {item.energi}
            {" "}
            kkal
          </h4>

          <p
            className="
              text-xs
              text-slate-500
              mt-1
            "
          >
            Total energi
          </p>

        </div>

      </td>

      {/* TANGGAL */}
      <td
        className="
          px-6
          py-5
        "
      >

        <p
          className="
            text-sm
            text-slate-700
            font-medium
          "
        >
          {item.tanggal}
        </p>

      </td>

      {/* STATUS */}
      <td
        className="
          px-6
          py-5
        "
      >

        <div
          className="
            inline-flex
            items-center
            px-3
            py-1
            rounded-xl
            bg-emerald-50
            text-emerald-700
            text-xs
            font-semibold
          "
        >
          Tersimpan
        </div>

      </td>

      {/* ACTION */}
      <td
        className="
          px-6
          py-5
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* DETAIL */}
          <button
            onClick={() =>
              navigate(
                `/riwayat/${item.id}`,
                {
                  state: item,
                }
              )
            }
            className="
              w-10
              h-10
              rounded-xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              hover:bg-blue-100
              transition-all
            "
          >

            <Eye size={18} />

          </button>

          {/* HAPUS */}
          <button
            className="
              w-10
              h-10
              rounded-xl
              bg-red-50
              text-red-600
              flex
              items-center
              justify-center
              hover:bg-red-100
              transition-all
            "
          >

            <Trash2
              size={18}
            />

          </button>

        </div>

      </td>

    </tr>
  );
}