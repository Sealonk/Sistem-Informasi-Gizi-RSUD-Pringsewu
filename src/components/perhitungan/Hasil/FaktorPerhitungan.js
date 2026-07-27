import {
  Activity,
  Flame,
  Calculator,
  ClipboardList,
  Droplet,
} from "lucide-react";

export default function FaktorPerhitungan({
  data,
}) {

  const isChanged = (field, currentValue) => {
    if (!data.originalValues) return false;
    const originalValue = data.originalValues[field];

    if (Array.isArray(currentValue)) {
      const origArray = Array.isArray(originalValue) ? originalValue : [];
      if (currentValue.length !== origArray.length) return true;
      const sortedCurrent = [...currentValue].sort();
      const sortedOrig = [...origArray].sort();
      return sortedCurrent.some((val, idx) => val !== sortedOrig[idx]);
    }

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

  /* AKTIVITAS */
  const getAktivitas = () => {
    const val = data.aktivitasFisikLabel || data.aktivitasFisik;
    if (!val) return "-";
    return String(val);
  };

  /* STRESS */
  const getStress = () => {
    const val = data.faktorStressLabel || data.faktorStress;
    if (!val) return "-";
    return String(val);
  };

  /* METODE */
  const getMetode = () => {
    if (!data.metodePerhitungan) return "-";
    const s = String(data.metodePerhitungan).toLowerCase().trim();
    switch (s) {
      case "who":
        return "WHO";
      case "mifflin":
      case "mifflin st jeor":
      case "mifflin_st_jeor":
        return "Mifflin St Jeor";
      case "harris benedict":
      case "harris_benedict":
        return "Harris Benedict";
      default:
        return data.metodePerhitungan;
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
      .map(item => item === "critical_ill" ? "critical ill" : item)
      .join(", ")
      .toUpperCase();
  };

  const penyakitArray = Array.isArray(data.penyakit)
    ? data.penyakit
    : typeof data.penyakit === "string"
    ? data.penyakit.split(",").map((p) => p.trim().toLowerCase())
    : [];

  const hasCkd = penyakitArray.some(
    (p) => String(p).toLowerCase().trim() === "ckd" || String(p).toLowerCase().trim().startsWith("ckd")
  );

  const getHemodialisaValue = () => {
    const val = data.hemodialisa || data.status_hemodialisa || data.statusHemodialisa;
    if (!val) return "-";
    const cleanVal = String(val).trim().toLowerCase();
    if (cleanVal === "ya" || cleanVal === "iya") return "Ya (Hemodialisa)";
    if (cleanVal === "tidak") return "Tidak Hemodialisa";
    return val;
  };

  const items = [
    {
      label: "Aktivitas",
      value: getAktivitas(),
      icon: <Activity size={18} />,
      color: "bg-blue-50 text-blue-600",
      badge: renderChangedBadge("aktivitasFisik", data.aktivitasFisik),
    },
    {
      label: "Stress",
      value: getStress(),
      icon: <Flame size={18} />,
      color: "bg-violet-50 text-violet-600",
      badge: renderChangedBadge("faktorStress", data.faktorStress),
    },
    {
      label: "Metode",
      value: getMetode(),
      icon: <Calculator size={18} />,
      color: "bg-emerald-50 text-emerald-600",
      badge: renderChangedBadge("metodePerhitungan", data.metodePerhitungan),
    },
    {
      label: "Jenis Perhitungan",
      value: getPenyakit(),
      icon: <ClipboardList size={18} />,
      color: "bg-amber-50 text-amber-600",
      badge: renderChangedBadge("penyakit", data.penyakit),
    },
    ...(hasCkd
      ? [
          {
            label: "Status Hemodialisa",
            value: getHemodialisaValue(),
            icon: <Droplet size={18} />,
            color: "bg-teal-50 text-teal-600",
            badge: renderChangedBadge(
              "hemodialisa",
              data.hemodialisa || data.status_hemodialisa
            ),
          },
        ]
      : []),
    {
      label: "BBI",
      value: `${data.bbi || 0} kg`,
      icon: <Calculator size={18} />,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      label: "BMR",
      value: `${data.bmr || 0} kkal`,
      icon: <Flame size={18} />,
      color: "bg-rose-50 text-rose-600",
    },
    {
      label: "Faktor Aktivitas",
      value: `${data.faktorAktivitasNilai ?? 0}`,
      icon: <Activity size={18} />,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Faktor Stress",
      value: `${data.faktorStressNilai ?? 0}`,
      icon: <Flame size={18} />,
      color: "bg-fuchsia-50 text-fuchsia-600",
    },
    {
      label: "Penambahan Kalori",
      value: `${data.penambahanKaloriNilai || 0} kkal`,
      icon: <Calculator size={18} />,
      color: "bg-orange-50 text-orange-600",
      badge: renderChangedBadge("penambahanKalori", data.penambahanKalori),
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
        print:p-4
        print:rounded-2xl
        print-break-inside-avoid
        shadow-sm
      "
    >

      {/* TITLE */}
      <div className="mb-6 print:mb-3">

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
          print:gap-2.5
        "
      >

        {items.map((item) => (

          <div
            key={item.label}
            className="
              flex
              items-center
              gap-4
              print:gap-2.5
              rounded-2xl
              print:rounded-xl
              border
              border-blue-100
              bg-slate-50/50
              p-4
              print:p-2.5
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
