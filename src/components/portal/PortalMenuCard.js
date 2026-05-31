import { ArrowRight } from "lucide-react";

export default function PortalMenuCard({ menu, onOpen }) {
  const Icon = menu.icon;

  const getTheme = () => {
    switch (menu.path) {
      case "/ringkasan-sistem":
        return {
          gradient: "from-indigo-500 to-purple-600",
          iconBg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
          btnBg: "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-100",
          glow: "hover:shadow-indigo-500/8 hover:border-indigo-200/80",
          badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-100",
          label: "Dashboard Ringkasan"
        };
      case "/perhitungan":
        return {
          gradient: "from-emerald-500 to-teal-600",
          iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
          btnBg: "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-100",
          glow: "hover:shadow-emerald-500/8 hover:border-emerald-200/80",
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
          label: "Kalkulasi Kebutuhan"
        };
      case "/riwayat":
        return {
          gradient: "from-blue-500 to-sky-600",
          iconBg: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
          btnBg: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-100",
          glow: "hover:shadow-blue-500/8 hover:border-blue-200/80",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
          label: "Riwayat Perhitungan"
        };
      default:
        return {
          gradient: "from-blue-600 to-blue-600",
          iconBg: "bg-blue-50 text-blue-600",
          btnBg: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white",
          glow: "hover:shadow-blue-500/8",
          badgeColor: "bg-blue-50 text-blue-700",
          label: "Modul"
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      onClick={() => onOpen(menu.path)}
      className={`
        group
        relative
        overflow-hidden
        cursor-pointer
        bg-white/80
        backdrop-blur-md
        border
        border-slate-200/80
        rounded-[32px]
        shadow-sm
        p-8
        flex
        flex-col
        items-center
        text-center
        transition-all
        duration-500
        ease-out
        hover:-translate-y-2
        hover:shadow-2xl
        ${theme.glow}
      `}
    >
      {/* Decorative top color accent bar */}
      <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${theme.gradient}`} />

      {/* Decorative inner background glow on hover */}
      <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-[0.03] blur-xl transition-all duration-500`} />

      {/* Module Category Badge */}
      <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold mb-6 ${theme.badgeColor}`}>
        {theme.label}
      </span>

      {/* Icon Container */}
      <div
        className={`
          w-20
          h-20
          rounded-[24px]
          flex
          items-center
          justify-center
          transition-all
          duration-500
          mb-5
          ${theme.iconBg}
        `}
      >
        <Icon size={34} className="transition-transform duration-500 group-hover:scale-110" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-blue-900">
        {menu.title}
      </h3>

      <p className="text-slate-500 text-sm mb-8 leading-relaxed h-12 flex items-center justify-center max-w-[260px]">
        {menu.description}
      </p>

      <button
        type="button"
        className={`
          px-6
          h-11
          rounded-xl
          font-semibold
          text-xs
          tracking-wider
          uppercase
          transition-all
          duration-300
          flex
          items-center
          gap-2
          ${theme.btnBg}
        `}
      >
        <span>Akses Modul</span>
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
      </button>
    </div>
  );
}
