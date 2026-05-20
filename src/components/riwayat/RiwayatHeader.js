import {
  History,
  FileClock,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function RiwayatHeader() {

  const navigate =
    useNavigate();

  return (

    <div
      className="
        rounded-[24px]
        border
        border-blue-100
        bg-white
        p-6
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-6
          flex-wrap
        "
      >

        {/* LEFT */}
        <div
          className="
            flex
            items-start
            gap-4
          "
        >

          {/* ICON */}
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >

            <History size={24} />

          </div>

          {/* CONTENT */}
          <div className="flex-1">

            {/* TITLE */}
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                mb-2
              "
            >
              Riwayat Perhitungan
            </h1>

            {/* DESC */}
            <p
              className="
                text-sm
                text-slate-500
                mb-4
              "
            >
              Daftar hasil
              perhitungan kebutuhan
              gizi pasien yang telah
              disimpan sebelumnya.
            </p>

            {/* INFO */}
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                bg-blue-50
                text-blue-600
                text-sm
                font-medium
              "
            >

              <FileClock
                size={16}
              />

              Riwayat tersimpan
              otomatis pada sistem

            </div>

          </div>

        </div>

        {/* BUTTON */}
        <button
          onClick={() =>
            navigate("/portal")
          }
          className="
            h-12
            px-5
            rounded-2xl
            border
            border-blue-200
            bg-white
            text-blue-600
            text-sm
            font-semibold
            flex
            items-center
            gap-2
            hover:bg-blue-50
            transition-all
          "
        >

          <ArrowLeft
            size={18}
          />

          Kembali ke Portal

        </button>

      </div>

    </div>
  );
}