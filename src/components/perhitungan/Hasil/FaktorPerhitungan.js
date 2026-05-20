import {
  Activity,
  Flame,
  Calculator,
  ClipboardList,
} from "lucide-react";

export default function FaktorPerhitungan({
  data,
}) {

  /* AKTIVITAS */
  const getAktivitas = () => {

    switch (
      data.aktivitasFisik
    ) {

      case "ringan":
        return "Ringan";

      case "sedang":
        return "Sedang";

      case "berat":
        return "Berat";

      default:
        return "-";
    }
  };

  /* STRESS */
  const getStress = () => {

    switch (
      data.faktorStress
    ) {

      case "ringan":
        return "Ringan";

      case "sedang":
        return "Sedang";

      case "berat":
        return "Berat";

      default:
        return "-";
    }
  };

  /* METODE */
  const getMetode = () => {

    switch (
      data.metodePerhitungan
    ) {

      case "who":
        return "WHO";

      case "mifflin":
        return "Mifflin St Jeor";

      default:
        return "-";
    }
  };

  /* PENYAKIT */
  const getPenyakit = () => {

    if (
      !data.penyakit ||
      data.penyakit.length === 0
    ) {
      return "-";
    }

    return data.penyakit
      .join(", ")
      .toUpperCase();
  };

  const items = [
    {
      label: "Aktivitas",
      value: getAktivitas(),
      icon: (
        <Activity size={18} />
      ),
      color:
        "bg-blue-50 text-blue-600",
    },
    {
      label: "Stress",
      value: getStress(),
      icon: (
        <Flame size={18} />
      ),
      color:
        "bg-violet-50 text-violet-600",
    },
    {
      label: "Metode",
      value: getMetode(),
      icon: (
        <Calculator
          size={18}
        />
      ),
      color:
        "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Penyakit",
      value: getPenyakit(),
      icon: (
        <ClipboardList
          size={18}
        />
      ),
      color:
        "bg-amber-50 text-amber-600",
    },
  ];

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

      {/* TITLE */}
      <div className="mb-6">

        <h3
          className="
            text-lg
            font-bold
            text-slate-900
            mb-1
          "
        >
          Faktor Perhitungan
        </h3>

        <p
          className="
            text-sm
            text-slate-500
          "
        >
          Faktor yang digunakan
          dalam perhitungan
          kebutuhan gizi.
        </p>

      </div>

      {/* ITEMS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
        "
      >

        {items.map((item) => (

          <div
            key={item.label}
            className="
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-blue-100
              bg-slate-50/50
              p-4
            "
          >

            {/* ICON */}
            <div
              className={`
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                ${item.color}
              `}
            >
              {item.icon}
            </div>

            {/* TEXT */}
            <div>

              <p
                className="
                  text-xs
                  text-slate-500
                  mb-1
                "
              >
                {item.label}
              </p>

              <h4
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {item.value}
              </h4>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}