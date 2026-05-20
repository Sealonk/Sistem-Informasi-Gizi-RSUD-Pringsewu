import { Flame } from "lucide-react";

import SectionCard from "../../common/SectionCard";
import SelectField from "../../common/SelectField";

export default function FaktorStress({
  data,
  setData,
  errors = {},
  showErrors = false,
}) {

  const stressOptions = [
    {
      label: "Normal",
      value: "normal",
    },
    {
      label: "Ringan",
      value: "ringan",
    },
    {
      label: "Sedang",
      value: "sedang",
    },
    {
      label: "Berat",
      value: "berat",
    },
  ];

  const getDescription = () => {

    switch (
      data.faktorStress
    ) {

      case "normal":
        return "Contoh: pasien stabil tanpa kondisi metabolik berat.";

      case "ringan":
        return "Contoh: infeksi ringan atau pasca operasi kecil.";

      case "sedang":
        return "Contoh: penyakit kronis stabil atau operasi sedang.";

      case "berat":
        return "Contoh: luka bakar, sepsis, trauma berat.";

      default:
        return "Pilih tingkat stress metabolik pasien.";
    }
  };

  return (

    <SectionCard
      compact={true}
      title="Faktor Stress"
      subtitle="Pilih tingkat stress metabolik"
      icon={<Flame size={20} />}
    >

      {/* SELECT */}
      <SelectField
        label=""
        placeholder="Pilih Faktor Stress"
        value={data.faktorStress}
        onChange={(value) => setData({ ...data, faktorStress: value })}
        options={stressOptions}
      />
      {showErrors && errors.faktorStress && (
        <p className="mt-2 text-xs text-rose-600 font-medium">⚠ {errors.faktorStress}</p>
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