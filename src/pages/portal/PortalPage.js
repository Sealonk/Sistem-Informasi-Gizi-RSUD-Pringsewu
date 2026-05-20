import { useNavigate } from "react-router-dom";

import {
  Calculator,
  History,
  ChevronDown,
  Home,
} from "lucide-react";

export default function PortalPage() {
  const navigate = useNavigate();

  const menus = [
    {
      title: "Perhitungan Gizi",
      description: "Lakukan perhitungan kebutuhan gizi pasien berdasarkan asesmen dan kondisi klinis.",
      icon: <Calculator size={38} />,
      path: "/perhitungan",
    },
    {
      title: "Riwayat",
      description: "Lihat riwayat perhitungan gizi pasien yang telah dilakukan.",
      icon: <History size={38} />,
      path: "/riwayat",
    },
  ];

  return (
    <div
      className="
        min-h-screen
        bg-[#f8fbff]
        relative
        overflow-hidden
      "
    >

      {/* BACKGROUND BLUR */}
      <div
        className="
          absolute
          top-[-120px]
          left-[-120px]
          w-[350px]
          h-[350px]
          bg-blue-200/40
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]
          w-[350px]
          h-[350px]
          bg-sky-100/40
          rounded-full
          blur-3xl
        "
      />

      {/* CONTENT */}
      <div
        className="
          relative
          z-10
          px-6
          py-8
          max-w-7xl
          mx-auto
        "
      >

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 mb-10">
        <div className="px-6 py-5 max-w-7xl mx-auto flex items-center justify-between">
          {/* LOGO & TITLE */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-700">RSUD PRINGSEWU</h1>
              <p className="text-xs text-slate-500">Sistem Informasi Instalasi Gizi</p>
            </div>
          </div>

          {/* USER MENU */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold">
              P
            </div>
            <span className="text-sm font-medium text-slate-700">Petugas Gizi</span>
            <ChevronDown size={18} className="text-slate-400" />
          </button>
        </div>
      </div>

        {/* GREETING */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Selamat datang, Petugas Gizi 👋
          </h2>
          <p className="text-slate-600">
            Portal Sistem Informasi Instalasi Gizi RSUD Pringsewu
          </p>
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">

          {menus.map((menu, index) => (

            <div
              key={index}
              className="
                bg-white
                border
                border-slate-200
                rounded-3xl
                shadow-sm
                p-8
                flex
                flex-col
                items-center
                justify-center
                text-center
                hover:shadow-md
                transition-all
              "
            >

              {/* ICON */}
              <div
                className="
                  w-20
                  h-20
                  rounded-3xl
                  bg-blue-50
                  flex
                  items-center
                  justify-center
                  text-blue-600
                  mb-6
                "
              >
                {menu.icon}
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3">
                {menu.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-slate-600 text-sm mb-6 h-10 flex items-center">
                {menu.description}
              </p>

              {/* BUTTON */}
              <button
                onClick={() => navigate(menu.path)}
                className="
                  px-6
                  py-2
                  bg-blue-50
                  text-blue-600
                  rounded-lg
                  font-medium
                  text-sm
                  hover:bg-blue-100
                  transition-colors
                  flex
                  items-center
                  gap-2
                "
              >
                <span>Buka</span>
                <ChevronDown size={16} className="rotate-180" />
              </button>

            </div>

          ))}

        </div>

        {/* BACK TO HOME SECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Home size={24} className="text-blue-600" />
            <div>
              <h4 className="font-semibold text-slate-900">Kembali ke Beranda Utama</h4>
              <p className="text-sm text-slate-500">Kembali ke halaman beranda sistem.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/portal")}
            className="
              px-6
              py-2
              bg-blue-600
              text-white
              rounded-lg
              font-medium
              text-sm
              hover:bg-blue-700
              transition-colors
            "
          >
            Ke Beranda
          </button>
        </div>

      </div>
    </div>
  );
}