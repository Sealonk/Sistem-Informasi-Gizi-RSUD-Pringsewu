import { Flame } from "lucide-react";

import SectionCard from "../../common/SectionCard";
import SelectField from "../../common/SelectField";

export default function FaktorStress({
  data,
  setData,
  errors = {},
  showErrors = false,
  disabled = false,
}) {

  const isDM =
    data.penyakit?.includes("dm");

  const isCHF =
    data.penyakit?.includes("chf");

  const dmOptions = [
    {
      label: "Ringan (10%)",
      value: "Ringan",
    },
    {
      label: "Sedang (20%)",
      value: "Sedang",
    },
    {
      label: "Berat (30%)",
      value: "Berat",
    },
  ];

  const chfOptions = [
    {
      label: "Tidak Ada Stress",
      value: "Tidak ada stress",
    },
    {
      label: "Stress Ringan",
      value: "Stress Ringan",
    },
    {
      label: "Stress Ringan Sepsis",
      value: "Stress Ringan Sepsis",
    },
    {
      label: "Stress Berat",
      value: "Stress Berat",
    },
    {
      label: "Stress Sangat Berat",
      value: "Stress Sangat Berat",
    },
  ];

  const standardOptions = [
    {
      label: "Tidak Ada Stress",
      value: "Tidak ada stress",
    },
    {
      label: "Stress Ringan",
      value: "Stress Ringan",
    },
    {
      label: "Stress Ringan Sepsis",
      value: "Stress Ringan Sepsis",
    },
    {
      label: "Stress Berat",
      value: "Stress Berat",
    },
    {
      label: "Stress Sangat Berat",
      value: "Stress Sangat Berat",
    },
  ];

  const stressOptions =
    isDM
      ? dmOptions
      : isCHF
      ? chfOptions
      : standardOptions;

  const getDescription = () => {
    if (disabled) {
      return "Tidak diperlukan untuk kondisi klinis ini.";
    }

    if (isDM) {
      switch (data.faktorStress) {
        case "Ringan":
          return "Ringan — Tambahan kebutuhan energi sebesar 10%.";
        case "Sedang":
          return "Sedang — Tambahan kebutuhan energi sebesar 20%.";
        case "Berat":
          return "Berat — Tambahan kebutuhan energi sebesar 30%.";
        default:
          return (
            <span>
              Pilihan faktor stress:
              <br />• Ringan (10%)
              <br />• Sedang (20%)
              <br />• Berat (30%)
            </span>
          );
      }
    }

    // Non-DM (CHF, Stroke, Lambung, dll)
    switch (data.faktorStress) {
      case "Tidak ada stress":
        return "Tidak Ada Stress — Faktor pengali stress: 1.1";
      case "Stress Ringan":
        return "Stress Ringan — Faktor pengali stress: 1.3";
      case "Stress Ringan Sepsis":
        return "Stress Ringan Sepsis — Faktor pengali stress: 1.5";
      case "Stress Berat":
        return "Stress Berat — Faktor pengali stress: 1.6";
      case "Stress Sangat Berat":
        return "Stress Sangat Berat — Faktor pengali stress: 1.7";
      default:
        return (
          <span>
            Pilihan faktor stress:
            <br />• Tidak Ada Stress (faktor 1.1)
            <br />• Stress Ringan (faktor 1.3)
            <br />• Stress Ringan Sepsis (faktor 1.5)
            <br />• Stress Berat (faktor 1.6)
            <br />• Stress Sangat Berat (faktor 1.7)
          </span>
        );
    }
  };

  return (

    <SectionCard
      compact={true}
      title="Faktor Stress"
      subtitle="Pilih tingkat stress metabolik"
      icon={<Flame size={20} />}
    >

      <SelectField
        label=""
        placeholder={
          disabled
            ? "Di-disable untuk kondisi klinis ini"
            : "Pilih Faktor Stress"
        }
        value={data.faktorStress}
        onChange={(value) =>
          setData({
            ...data,
            faktorStress: value,
          })
        }
        options={stressOptions}
        error={
          showErrors
            ? errors.faktorStress
            : ""
        }
        disabled={disabled}
      />

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