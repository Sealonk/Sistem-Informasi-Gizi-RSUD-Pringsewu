import {
  ArrowRight,
  Calculator,
  History,
  TrendingUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function QuickActionSection() {

  const navigate =
    useNavigate();

  return (

    <section
      className="
        rounded-[32px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        p-6
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
      "
    >

      {/* HEADER */}
      <div className="mb-6">

        <h2
          className="
            text-lg
            font-bold
            text-slate-900
          "
        >
          Aksi Cepat Pelayanan
        </h2>

        <p
          className="
            text-sm
            text-slate-500
          "
        >
          Akses cepat untuk memulai tugas kalkulasi gizi baru atau memantau riwayat rekam medis pasien.
        </p>

      </div>

      {/* ACTIONS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
        "
      >

        {/* MULAI */}
        <button
          type="button"
          onClick={() =>
            navigate("/perhitungan")
          }
          className="
            group
            relative
            overflow-hidden
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-200/60
            bg-white/50
            p-5
            transition-all
            duration-300
            hover:bg-blue-50/50
            hover:border-blue-200/80
            hover:shadow-lg
            hover:shadow-blue-500/5
            hover:-translate-y-0.5
          "
        >
          {/* Accent top gradient stripe */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex items-center gap-4 relative z-10">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
                transition-all
                duration-300
                group-hover:bg-blue-600
                group-hover:text-white
              "
            >
              <Calculator size={22} className="transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="text-left">

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-800
                  transition-colors
                  duration-300
                  group-hover:text-blue-900
                "
              >
                Mulai Perhitungan Gizi
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                  font-medium
                "
              >
                Pilih pasien aktif SIMRS dan lakukan asesmen asuhan gizi.
              </p>

            </div>

          </div>

          <ArrowRight
            size={18}
            className="
              text-blue-500
              transition-transform
              duration-300
              group-hover:translate-x-1.5
              relative
              z-10
            "
          />

        </button>

        {/* RIWAYAT */}
        <button
          type="button"
          onClick={() =>
            navigate("/riwayat")
          }
          className="
            group
            relative
            overflow-hidden
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-200/60
            bg-white/50
            p-5
            transition-all
            duration-300
            hover:bg-indigo-50/50
            hover:border-indigo-200/80
            hover:shadow-lg
            hover:shadow-indigo-500/5
            hover:-translate-y-0.5
          "
        >
          {/* Accent top gradient stripe */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex items-center gap-4 relative z-10">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-indigo-50
                text-indigo-600
                transition-all
                duration-300
                group-hover:bg-indigo-600
                group-hover:text-white
              "
            >
              <History size={22} className="transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="text-left">

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-800
                  transition-colors
                  duration-300
                  group-hover:text-indigo-900
                "
              >
                Lihat Riwayat Asuhan
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                  font-medium
                "
              >
                Buka, cari, dan tinjau rekapitulasi riwayat perhitungan pasien.
              </p>

            </div>

          </div>

          <ArrowRight
            size={18}
            className="
              text-indigo-500
              transition-transform
              duration-300
              group-hover:translate-x-1.5
              relative
              z-10
            "
          />

        </button>

        {/* PREDIKSI */}
        <button
          type="button"
          onClick={() =>
            navigate("/prediksi-pasien")
          }
          className="
            group
            relative
            overflow-hidden
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-slate-200/60
            bg-white/50
            p-5
            transition-all
            duration-300
            hover:bg-violet-50/50
            hover:border-violet-200/80
            hover:shadow-lg
            hover:shadow-violet-500/5
            hover:-translate-y-0.5
          "
        >
          {/* Accent top gradient stripe */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex items-center gap-4 relative z-10">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-violet-50
                text-violet-600
                transition-all
                duration-300
                group-hover:bg-violet-600
                group-hover:text-white
              "
            >
              <TrendingUp size={22} className="transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="text-left">

              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-800
                  transition-colors
                  duration-300
                  group-hover:text-violet-900
                "
              >
                Prediksi Pasien
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-slate-400
                  font-medium
                "
              >
                Analisis tren dan prediksi kebutuhan gizi pasien secara cerdas.
              </p>

            </div>

          </div>

          <ArrowRight
            size={18}
            className="
              text-violet-500
              transition-transform
              duration-300
              group-hover:translate-x-1.5
              relative
              z-10
            "
          />

        </button>

      </div>

    </section>
  );
}