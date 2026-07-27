import {
  Flame,
  Beef,
  Droplets,
  Wheat,
} from "lucide-react";

export default function SummaryCard({
  hasil,
}) {
  const formatNumber = (value) => {
    const numericValue =
      Number(value);

    if (!Number.isFinite(numericValue)) {
      return "0";
    }

    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const cards = [
    {
      title: "Energi",
      value:
        hasil?.energi || 0,
      unit: "kkal",
      icon: (
        <Flame size={20} />
      ),
      color:
        "bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
      gradient: "from-orange-500 to-red-500",
      valueClass: "bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent",
      glow: "hover:shadow-orange-500/5 hover:border-orange-200/80"
    },
    {
      title: "Protein",
      value:
        hasil?.protein || 0,
      unit: "gram",
      icon: (
        <Beef size={20} />
      ),
      color:
        "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
      gradient: "from-blue-500 to-indigo-500",
      valueClass: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
      glow: "hover:shadow-blue-500/5 hover:border-blue-200/80"
    },
    {
      title: "Lemak",
      value:
        hasil?.lemak || 0,
      unit: "gram",
      icon: (
        <Droplets size={20} />
      ),
      color:
        "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white",
      gradient: "from-yellow-400 to-amber-500",
      valueClass: "bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent",
      glow: "hover:shadow-yellow-500/5 hover:border-yellow-200/80"
    },
    {
      title: "Karbohidrat",
      value:
        hasil?.karbohidrat ||
        0,
      unit: "gram",
      icon: (
        <Wheat size={20} />
      ),
      color:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
      gradient: "from-emerald-500 to-teal-500",
      valueClass: "bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent",
      glow: "hover:shadow-emerald-500/5 hover:border-emerald-200/80"
    },
  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-5
        print-grid-cols-4
      "
    >

      {cards.map((item) => (

        <div
          key={item.title}
          className={`
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200/80
            bg-white/75
            backdrop-blur-md
            p-6
            print:p-3
            print:rounded-2xl
            print-break-inside-avoid
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            transition-all
            duration-300
            ${item.glow}
          `}
        >
          {/* Top colored gradient accent line */}
          <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${item.gradient}`} />

          {/* Inner hover background glow */}
          <div className={`absolute -right-8 -top-8 w-20 h-20 rounded-full bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] blur-lg transition-all duration-500`} />

          {/* TOP */}
          <div
            className="
              flex
              items-center
              justify-between
              mb-5
              print:mb-2
              relative
              z-10
            "
          >

            {/* TITLE */}
            <p
              className="
                text-sm
                print:text-xs
                font-semibold
                text-slate-500
              "
            >
              {item.title}
            </p>

            {/* ICON */}
            <div
              className={`
                w-11
                h-11
                print:w-8
                print:h-8
                rounded-xl
                flex
                items-center
                justify-center
                transition-all
                duration-500
                ${item.color}
              `}
            >
              {item.icon}
            </div>

          </div>

          {/* VALUE */}
          <div
            className="
              flex
              items-end
              gap-2
              relative
              z-10
            "
          >

            <h2
              className={`
                text-4xl
                print:text-2xl
                font-extrabold
                tracking-tight
                leading-none
                py-1
                ${item.valueClass}
              `}
            >
              {formatNumber(item.value)}
            </h2>

            <span
              className="
                text-sm
                print:text-xs
                font-medium
                text-slate-400
                mb-1
              "
            >
              {item.unit}
            </span>

          </div>

        </div>

      ))}

    </div>
  );
}
