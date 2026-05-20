import {
  Flame,
  Beef,
  Droplets,
  Wheat,
} from "lucide-react";

export default function SummaryCard({
  hasil,
}) {

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
        "bg-orange-50 text-orange-600",
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
        "bg-blue-50 text-blue-600",
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
        "bg-yellow-50 text-yellow-600",
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
        "bg-emerald-50 text-emerald-600",
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
      "
    >

      {cards.map((item) => (

        <div
          key={item.title}
          className="
            rounded-[24px]
            border
            border-blue-100
            bg-white
            p-5
            shadow-sm
          "
        >

          {/* TOP */}
          <div
            className="
              flex
              items-center
              justify-between
              mb-5
            "
          >

            {/* TITLE */}
            <p
              className="
                text-sm
                font-medium
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
                rounded-xl
                flex
                items-center
                justify-center
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
            "
          >

            <h2
              className="
                text-4xl
                font-bold
                tracking-tight
                text-slate-900
                leading-none
              "
            >
              {item.value}
            </h2>

            <span
              className="
                text-sm
                font-medium
                text-slate-500
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