import {
  Scale,
  Ruler,
  HeartPulse,
  Calculator,
} from "lucide-react";

export default function StatusGizi({
  data,
}) {

  /* BB & TB */
  const bb = Number(data.bb || 0);

  const tb =
    Number(data.tb || 0);

  /* IMT */
  const imt =
    bb && tb
      ? (
          bb /
          (
            (tb / 100) *
            (tb / 100)
          )
        ).toFixed(1)
      : "-";

  /* STATUS */
  const getStatus = () => {

    const nilai = Number(imt);

    if (!nilai) return "-";

    if (nilai < 18.5)
      return "Kurus";

    if (nilai <= 25)
      return "Normal";

    return "Overweight";
  };

  const items = [
    {
      label: "Berat Badan",
      value: `${bb} kg`,
      icon: (
        <Scale size={18} />
      ),
      color:
        "bg-blue-50 text-blue-600",
    },
    {
      label: "Tinggi Badan",
      value: `${tb} cm`,
      icon: (
        <Ruler size={18} />
      ),
      color:
        "bg-emerald-50 text-emerald-600",
    },
    {
      label: "IMT",
      value: `${imt} kg/m²`,
      icon: (
        <Calculator
          size={18}
        />
      ),
      color:
        "bg-violet-50 text-violet-600",
    },
    {
      label: "Status Gizi",
      value: getStatus(),
      icon: (
        <HeartPulse
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

      {/* HEADER */}
      <div className="mb-6">

        <h3
          className="
            text-lg
            font-bold
            text-slate-900
            mb-1
          "
        >
          Status Gizi
        </h3>

        <p
          className="
            text-sm
            text-slate-500
          "
        >
          Ringkasan antropometri
          dan kategori status
          gizi pasien.
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