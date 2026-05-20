import { Activity } from "lucide-react";

import SectionCard from "../../common/SectionCard";
import SelectField from "../../common/SelectField";

export default function AktivitasFisik({
  data,
  setData,
  errors = {},
  showErrors = false,
}) {

  const aktivitasOptions = [
    {
      label: "Bed Rest",
      value: "bedrest",
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
      data.aktivitasFisik
    ) {

      case "bedrest":
        return "Contoh: pasien tirah baring total di tempat tidur.";

      case "ringan":
        return "Contoh: aktivitas terbatas di tempat tidur, duduk, atau berjalan ringan.";

      case "sedang":
        return "Contoh: pasien masih dapat melakukan aktivitas harian normal.";

      case "berat":
        return "Contoh: aktivitas fisik tinggi atau kondisi tertentu.";

      default:
        return "Pilih tingkat aktivitas pasien.";
    }
  };

  return (

    <SectionCard
  compact={true}
  title="Aktivitas Fisik"
  subtitle="Pilih tingkat aktivitas pasien"
  icon={<Activity size={17} />}
    >

      {/* SELECT */}
      <SelectField
        label=""
        placeholder="Pilih Aktivitas"
        value={data.aktivitasFisik}
        onChange={(value) => setData({ ...data, aktivitasFisik: value })}
        options={aktivitasOptions}
      />
      {showErrors && errors.aktivitasFisik && (
        <p className="mt-2 text-xs text-rose-600 font-medium">⚠ {errors.aktivitasFisik}</p>
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