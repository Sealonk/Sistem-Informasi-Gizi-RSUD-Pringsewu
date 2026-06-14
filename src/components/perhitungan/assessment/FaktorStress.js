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

  // Konfigurasi pilihan angka pengali stress metabolik
  const CONFIG_STRES = {
    "Stress Ringan": {
      options: [1.2, 1.3, 1.4],
      default: 1.3
    },
    "Stress Ringan Sepsis": {
      options: [1.4, 1.5],
      default: 1.5
    },
    "Stress Berat": {
      options: [1.5, 1.6],
      default: 1.6
    },
    "Stress Sangat Berat": {
      options: [1.6, 1.7],
      default: 1.7
    }
  };

  const currentConfig = CONFIG_STRES[data.faktorStress];

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

    const activeSlider = data.faktorStressSlider || 1.1;

    switch (data.faktorStress) {
      case "Tidak ada stress":
        return `Tidak Ada Stress — Faktor pengali stress terkunci pada: 1.10.`;
      case "Stress Ringan":
        return `Stress Ringan (pilihan: 1.2, 1.3, 1.4) — Faktor pengali saat ini: ${activeSlider.toFixed(2)}.`;
      case "Stress Ringan Sepsis":
        return `Stress Ringan Sepsis (pilihan: 1.4, 1.5) — Faktor pengali saat ini: ${activeSlider.toFixed(2)}.`;
      case "Stress Berat":
        return `Stress Berat (pilihan: 1.5, 1.6) — Faktor pengali saat ini: ${activeSlider.toFixed(2)}.`;
      case "Stress Sangat Berat":
        return `Stress Sangat Berat (pilihan: 1.6, 1.7) — Faktor pengali saat ini: ${activeSlider.toFixed(2)}.`;
      default:
        return (
          <span>
            Pilihan faktor stress:
            <br />• Tidak Ada Stress (faktor 1.10)
            <br />• Stress Ringan (1.2, 1.3, 1.4)
            <br />• Stress Ringan Sepsis (1.4, 1.5)
            <br />• Stress Berat (1.5, 1.6)
            <br />• Stress Sangat Berat (1.6, 1.7)
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
      theme="emerald"
    >
      <SelectField
        label=""
        placeholder={
          disabled
            ? "Di-disable untuk kondisi klinis ini"
            : "Pilih Faktor Stress"
        }
        value={data.faktorStress}
        onChange={(value) => {
          let sliderVal = 1.1;
          if (value === "Stress Ringan") sliderVal = 1.30;
          else if (value === "Stress Ringan Sepsis") sliderVal = 1.50;
          else if (value === "Stress Berat") sliderVal = 1.60;
          else if (value === "Stress Sangat Berat") sliderVal = 1.70;

          setData({
            ...data,
            faktorStress: value,
            faktorStressSlider: sliderVal,
          });
        }}
        options={stressOptions}
        error={
          showErrors
            ? errors.faktorStress
            : ""
        }
        disabled={disabled}
      />

      {/* TAMPILKAN CHECKBOX UNTUK PILIHAN ANGKA PENGALI */}
      {!disabled && !isDM && currentConfig && (
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Pilih Angka Pengali Stress:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {currentConfig.options.map((val) => (
              <label
                key={val}
                className={`flex items-center gap-2.5 text-sm font-medium cursor-pointer select-none py-2 px-3 rounded-2xl border transition-all ${
                  data.faktorStressSlider === val
                    ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <input
                  type="checkbox"
                  checked={data.faktorStressSlider === val}
                  onChange={() => {
                    setData({
                      ...data,
                      faktorStressSlider: val,
                    });
                  }}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>{val.toFixed(1)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

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