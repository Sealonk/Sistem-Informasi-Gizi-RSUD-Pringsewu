import {
  History,
  FileClock,
  ArrowLeft,
  User,
  Database,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/authService";

export default function RiwayatHeader() {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        p-8
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        ease-out
      "
    >
      {/* Decorative Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-[32px]" />

      {/* Decorative Glow Circle */}
      <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 opacity-[0.03] blur-xl" />

      <div
        className="
          flex
          items-start
          justify-between
          gap-6
          flex-wrap
          relative
          z-10
        "
      >
        {/* LEFT */}
        <div
          className="
            flex
            items-start
            gap-5
          "
        >
          {/* ICON */}
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              text-white
              flex
              items-center
              justify-center
              shrink-0
              shadow-lg
              shadow-blue-200/50
            "
          >
            <History size={24} />
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            {/* BREADCRUMB */}
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Beranda &gt; Riwayat
            </div>

            {/* TITLE */}
            <h1
              className="
                text-2xl
                font-extrabold
                tracking-tight
                text-slate-800
                mb-1.5
              "
            >
              Riwayat Perhitungan
            </h1>

            {/* DESC */}
            <p
              className="
                text-sm
                text-slate-500
                max-w-xl
                mb-4
                leading-relaxed
              "
            >
              Daftar hasil perhitungan kebutuhan gizi pasien yang telah disimpan sebelumnya.
            </p>

            {/* BADGES ROW */}
            <div className="flex flex-wrap gap-2.5 items-center">
              {/* DATABASE STATUS */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  rounded-xl
                  bg-emerald-50
                  text-emerald-700
                  text-xs
                  font-bold
                  border
                  border-emerald-100/60
                "
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Database size={13} />
                Database Sinkron
              </div>

              {/* INFO AUTO SAVE */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  rounded-xl
                  bg-blue-50/60
                  text-blue-600
                  text-xs
                  font-semibold
                  border
                  border-blue-100/50
                "
              >
                <FileClock size={13} />
                Tersimpan Otomatis
              </div>

              {/* USER OPERATOR */}
              {user && (
                <div
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-1.5
                    rounded-xl
                    bg-slate-100/80
                    text-slate-600
                    text-xs
                    font-semibold
                    border
                    border-slate-200/40
                    backdrop-blur-sm
                  "
                >
                  <User size={13} className="text-slate-500" />
                  Petugas: <span className="font-bold text-slate-700">{user.nama_lengkap}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => navigate("/portal")}
          className="
            h-11
            px-5
            rounded-2xl
            border
            border-slate-200
            bg-white
            text-slate-600
            text-sm
            font-bold
            flex
            items-center
            gap-2
            hover:bg-slate-50
            hover:text-slate-800
            hover:border-slate-300
            transition-all
            duration-200
            hover:shadow-sm
          "
        >
          <ArrowLeft size={16} />
          Kembali ke Portal
        </button>
      </div>
    </div>
  );
}