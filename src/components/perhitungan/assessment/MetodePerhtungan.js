import { Calculator } from "lucide-react";

import SectionCard from "../../common/SectionCard";
import SelectField from "../../common/SelectField";

export default function MetodePerhitungan({
  data,
  setData,
  errors = {},
  showErrors = false,
}) {

  /* UMUR */
  const umur =
    Number(data.umur || 0);

  /* REKOMENDASI */
  const rekomendasi =
    umur < 18
      ? "WHO"
      : "Mifflin St Jeor";

  /* OPTIONS */
  const metodeOptions = [
    {
      label: "Mifflin St Jeor",
      value: "mifflin",
    },
    {
      label: "WHO",
      value: "who",
    },
  ];

  /* DESCRIPTION */
  const getDescription = () => {

    switch (
      data.metodePerhitungan
    ) {

      case "mifflin":
        return "Direkomendasikan untuk pasien dewasa dengan kebutuhan energi modern.";

      case "who":
        return "Direkomendasikan untuk pasien usia anak dan remaja.";

      default:
        return "Pilih metode perhitungan kebutuhan energi pasien.";
    }
  };

  return (

    <SectionCard
      compact={true}
      title="Metode Perhitungan"
      subtitle="Pilih metode kebutuhan energi"
      icon={<Calculator size={20} />}
    >

      {/* REKOMENDASI */}
      <div
        className="
          mb-4
          rounded-2xl
          border
          border-blue-100
          bg-blue-50/70
          px-4
          py-3
        "
      >

        <p
          className="
            text-xs
            text-blue-700
            leading-relaxed
          "
        >
          Rekomendasi sistem:
          <span className="font-semibold">
            {" "}
            {rekomendasi}
          </span>
        </p>

      </div>

      {/* SELECT */}
      <SelectField
        label=""
        placeholder="Pilih Metode"
        value={data.metodePerhitungan}
        onChange={(value) => setData({ ...data, metodePerhitungan: value })}
        options={metodeOptions}
      />
      {showErrors && errors.metodePerhitungan && (
        <p className="mt-2 text-xs text-rose-600 font-medium">⚠ {errors.metodePerhitungan}</p>
      )}

      {/* DESCRIPTION */}
      <p
        className="
          mt-4
          text-sm
          leading-relaxed
          text-slate-500
        "
      >
        {getDescription()}
      </p>

    </SectionCard>
  );
}