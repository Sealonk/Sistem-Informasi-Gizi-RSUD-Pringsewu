import { ChevronDown } from "lucide-react";

export default function PortalMenuCard({ menu, onOpen }) {
  const Icon = menu.icon;

  return (
    <div
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
        <Icon size={38} />
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-3">
        {menu.title}
      </h3>

      <p className="text-slate-600 text-sm mb-6 h-10 flex items-center">
        {menu.description}
      </p>

      <button
        type="button"
        onClick={() => onOpen(menu.path)}
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
  );
}
