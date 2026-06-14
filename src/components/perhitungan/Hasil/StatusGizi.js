import {
  Scale,
  Ruler,
  HeartPulse,
  Calculator,
} from "lucide-react";

export default function StatusGizi({
  data,
}) {

  const isChanged = (field, currentValue) => {
    if (!data.originalValues) return false;
    const originalValue = data.originalValues[field];
    const cleanCurrent = String(currentValue ?? "").trim().toLowerCase();
    const cleanOriginal = String(originalValue ?? "").trim().toLowerCase();
    return cleanCurrent !== cleanOriginal;
  };

  const renderChangedBadge = (field, currentValue) => {
    if (isChanged(field, currentValue)) {
      return (
        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          Diubah
        </span>
      );
    }
    return null;
  };

  /* BB & TB */
  const bb = Number(data.bb || 0);

  const tb =
    Number(data.tb || 0);

  /* IMT */
  const tinggiM = tb / 100;

let imt = "-";

if (bb && tb) {

  imt =
    (
      bb /
      (tinggiM * tinggiM)
    ).toFixed(2);
}

  /* STATUS */
  const getStatus = () => {

  if (
    !bb ||
    !tb
  ) {
    return "-";
  }

  const nilaiIMT =
    bb /
    Math.pow(tb / 100, 2);

  if (nilaiIMT < 17) {
    return "KEKURANGAN BB TINGKAT BERAT";
  }

  if (nilaiIMT < 18.5) {
    return "KEKURANGAN BB TINGKAT RINGAN";
  }

  if (nilaiIMT <= 25) {
    return "NORMAL";
  }

  if (nilaiIMT <= 27) {
    return "KELEBIHAN BB TINGKAT RINGAN";
  }

  return "KELEBIHAN BB TINGKAT BERAT";
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
      badge: renderChangedBadge("bb", data.bb),
    },
    {
      label: "Tinggi Badan",
      value: `${tb} cm`,
      icon: (
        <Ruler size={18} />
      ),
      color:
        "bg-emerald-50 text-emerald-600",
      badge: renderChangedBadge("tb", data.tb),
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
                  flex
                  items-center
                  flex-wrap
                "
              >
                {item.value}
                {item.badge}
              </h4>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}