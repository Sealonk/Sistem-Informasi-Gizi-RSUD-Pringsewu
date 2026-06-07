import { Stethoscope, AlertTriangle } from "lucide-react";

import SectionCard from "../../common/SectionCard";

export const calculationTypeValues = ["critical_ill", "mifflin"];

export function getDiseaseValues(penyakitArray) {
  return (penyakitArray || []).filter(
    (item) => !calculationTypeValues.includes(item)
  );
}

export function isValidCombination(penyakitArray) {
  const diseaseValues = getDiseaseValues(penyakitArray);

  if (!diseaseValues.length) return false;

  const validCombinations = [
    ["dm"],
    ["dm", "ckd"],
    ["dm", "ckd", "chf"],
    ["dm", "chf"],
    ["dm", "lambung"],
    ["dm", "stroke"],
    ["ckd"],
    ["ckd", "chf"],
    ["ckd", "lambung"],
    ["ckd", "stroke"],
    ["chf"],
    ["chf", "lambung"],
    ["chf", "stroke"],
    ["lambung"],
    ["stroke"],
  ];

  const sorted = [...diseaseValues].sort();

  return validCombinations.some((combo) => {
    const sortedCombo = [...combo].sort();
    if (sortedCombo.length !== sorted.length) return false;
    return sortedCombo.every((val, idx) => val === sorted[idx]);
  });
}

export default function JenisPenyakit({
  data,
  setData,
}) {
  const selectedDiseaseValues = getDiseaseValues(data.penyakit);
  const showUnsupportedCombination =
    selectedDiseaseValues.length > 0 &&
    !isValidCombination(selectedDiseaseValues);

  const penyakitOptions = [
    {
      label: "Diabetes Mellitus",
      value: "dm",
      short: "DM",
    },
    {
      label: "CKD",
      value: "ckd",
      short: "CKD",
    },
    {
      label: "CHF",
      value: "chf",
      short: "CHF",
    },
    {
      label: "Lambung",
      value: "lambung",
      short: "LMB",
    },
    {
      label: "Stroke",
      value: "stroke",
      short: "STR",
    },
    {
      label: "Critical Ill",
      value: "critical_ill",
      short: "CI",
    },
    {
      label: "Mifflin",
      value: "mifflin",
      short: "MIF",
    },
  ];

  const handleToggle = (value) => {

    const current =
      data.penyakit || [];

    const exists =
      current.includes(value);

    if (exists) {

      setData({
        ...data,
        penyakit: current.filter(
          (item) => item !== value
        ),
      });

    } else {

      setData({
        ...data,
        penyakit: [
          ...current,
          value,
        ],
      });
    }
  };

  return (

    <SectionCard
      title="Jenis Perhitungan"
      subtitle="Pilih jenis penyakit utama pasien yang mempengaruhi kebutuhan gizi dan perhitungan nutrisi"
      icon={<Stethoscope size={26} />}
    >

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        {penyakitOptions.map((item) => {

          const active =
            data.penyakit?.includes(
              item.value
            );

          return (

            <button
              key={item.value}
              type="button"
              onClick={() =>
                handleToggle(item.value)
              }
              className={`
                relative
                overflow-hidden
                text-left
                rounded-[28px]
                border
                p-6
                transition-all
                duration-300
                group

                ${
                  active
                    ? `
                      border-blue-500
                      bg-gradient-to-br
                      from-blue-50
                      to-white
                      shadow-lg
                      shadow-blue-100
                      -translate-y-1
                    `
                    : `
                      border-blue-100
                      bg-white/80
                      hover:border-blue-200
                      hover:bg-blue-50/40
                      hover:-translate-y-1
                    `
                }
              `}
            >

              {/* GLOW */}
              <div
                className={`
                  absolute
                  top-[-30px]
                  right-[-30px]
                  w-[100px]
                  h-[100px]
                  rounded-full
                  blur-3xl
                  transition-all

                  ${
                    active
                      ? "bg-blue-200/50"
                      : "bg-blue-100/20"
                  }
                `}
              />

              {/* CONTENT */}
              <div className="relative z-10">

                {/* TOP */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-8
                  "
                >

                  {/* SHORT */}
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-bold
                      transition-all

                      ${
                        active
                          ? `
                            bg-blue-600
                            text-white
                            shadow-lg
                            shadow-blue-100
                          `
                          : `
                            bg-blue-50
                            text-blue-600
                          `
                      }
                    `}
                  >
                    {item.short}
                  </div>

                  {/* CHECK */}
                  <div
                    className={`
                      w-6
                      h-6
                      rounded-full
                      border-2
                      flex
                      items-center
                      justify-center
                      transition-all

                      ${
                        active
                          ? `
                            border-blue-600
                            bg-blue-600
                          `
                          : `
                            border-slate-300
                            bg-white
                          `
                      }
                    `}
                  >

                    {active && (
                      <div
                        className="
                          w-2
                          h-2
                          rounded-full
                          bg-white
                        "
                      />
                    )}

                  </div>

                </div>

                {/* TITLE */}
                <h3
                  className="
                    text-lg
                    font-bold
                    text-slate-900
                    tracking-tight
                    mb-2
                  "
                >
                  {item.label}
                </h3>

                {/* STATUS */}
                <p
                  className={`
                    text-sm
                    font-medium

                    ${
                      active
                        ? "text-blue-600"
                        : "text-slate-500"
                    }
                  `}
                >
                  {active
                    ? "Dipilih"
                    : "Belum dipilih"}
                </p>

              </div>

            </button>

          );
        })}

      </div>

      {showUnsupportedCombination && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
          <div className="mt-0.5 text-amber-500">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">Kombinasi Belum Didukung</p>
            <p className="text-sm text-amber-700 leading-relaxed">Kombinasi yang Anda pilih belum didukung oleh sistem perhitungan gizi. Silakan periksa kembali pilihan pasien.</p>
          </div>
        </div>
      )}

    </SectionCard>
  );
}
