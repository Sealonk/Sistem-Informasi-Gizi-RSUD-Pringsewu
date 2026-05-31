import { Activity } from "lucide-react";

import SectionCard from "../../common/SectionCard";
import SelectField from "../../common/SelectField";

export default function AktivitasFisik({
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

  let aktivitasOptions = [];

  if (isDM) {

    aktivitasOptions = [
      {
        label: "Istirahat (+10% energi basal)",
        value: "Istirahat",
      },
      {
        label: "Ringan (+20% energi basal)",
        value: "Ringan",
      },
      {
        label: "Sedang (+30% energi basal)",
        value: "Sedang",
      },
      {
        label: "Berat (+40% energi basal)",
        value: "Berat",
      },
      {
        label: "Sangat Berat (+50% energi basal)",
        value: "Sangat berat",
      },
    ];

  } else if (isCHF) {

    aktivitasOptions = [
      {
        label: "Berbaring di tempat tidur",
        value: "Berbaring di tempat tidur",
      },
      {
        label: "Dapat turun dari tempat tidur",
        value: "Dapat turun dari tempat tidur",
      },
      {
        label:
          "Kerja banyak duduk / sedikit atau tidak olahraga",
        value:
          "Kerja banyak duduk / sedikit atau tidak olahraga",
      },
      {
        label:
          "Kerja banyak berdiri / olahraga 4-5 kali per minggu",
        value:
          "Kerja banyak berdiri / olahraga 4-5 kali per minggu",
      },
      {
        label:
          "Pekerjaan berat / olahraga sangat aktif",
        value:
          "Pekerjaan berat / olahraga sangat aktif",
      },
    ];

  } else {

    aktivitasOptions = [
      {
        label: "Berbaring di tempat tidur",
        value: "Berbaring di tempat tidur",
      },
      {
        label: "Dapat turun dari tempat tidur",
        value: "Dapat turun dari tempat tidur",
      },
      {
        label:
          "Kerja banyak duduk / sedikit atau tidak olahraga",
        value:
          "Kerja banyak duduk / sedikit atau tidak olahraga",
      },
      {
        label:
          "Kerja banyak berdiri / olahraga 4-5 kali per minggu",
        value:
          "Kerja banyak berdiri / olahraga 4-5 kali per minggu",
      },
      {
        label:
          "Pekerjaan berat / olahraga sangat aktif",
        value:
          "Pekerjaan berat / olahraga sangat aktif",
      },
    ];
  }

  const getDescription = () => {
    if (disabled) {
      return "Tidak diperlukan untuk kondisi klinis ini.";
    }

    if (isDM) {
      switch (data.aktivitasFisik) {
        case "Istirahat":
          return "Istirahat — Tambahan kebutuhan energi sebesar 10% dari energi basal.";
        case "Ringan":
          return "Ringan — Tambahan kebutuhan energi sebesar 20% dari energi basal.";
        case "Sedang":
          return "Sedang — Tambahan kebutuhan energi sebesar 30% dari energi basal.";
        case "Berat":
          return "Berat — Tambahan kebutuhan energi sebesar 40% dari energi basal.";
        case "Sangat berat":
          return "Sangat Berat — Tambahan kebutuhan energi sebesar 50% dari energi basal.";
        default:
          return (
            <span>
              Pilihan aktivitas fisik:
              <br />• Istirahat (+10% energi basal)
              <br />• Ringan (+20% energi basal)
              <br />• Sedang (+30% energi basal)
              <br />• Berat (+40% energi basal)
              <br />• Sangat Berat (+50% energi basal)
            </span>
          );
      }
    }

    // Non-DM (CHF, Stroke, Lambung, dll)
    switch (data.aktivitasFisik) {
      case "Berbaring di tempat tidur":
        return "Berbaring di tempat tidur — Faktor pengali aktivitas: 1.2";
      case "Dapat turun dari tempat tidur":
        return "Dapat turun dari tempat tidur — Faktor pengali aktivitas: 1.3";
      case "Kerja banyak duduk / sedikit atau tidak olahraga":
        return "Kerja banyak duduk — Faktor pengali aktivitas: 1.6";
      case "Kerja banyak berdiri / olahraga 4-5 kali per minggu":
        return "Kerja banyak berdiri — Faktor pengali aktivitas: 1.8";
      case "Pekerjaan berat / olahraga sangat aktif":
        return "Pekerjaan berat — Faktor pengali aktivitas: 2.0";
      default:
        return (
          <span>
            Pilihan aktivitas fisik:
            <br />• Berbaring di tempat tidur (faktor 1.2)
            <br />• Dapat turun dari tempat tidur (faktor 1.3)
            <br />• Kerja banyak duduk (faktor 1.6)
            <br />• Kerja banyak berdiri (faktor 1.8)
            <br />• Pekerjaan berat (faktor 2.0)
          </span>
        );
    }
  };

  return (

    <SectionCard
      compact={true}
      title="Aktivitas Fisik"
      subtitle="Pilih tingkat aktivitas pasien"
      icon={<Activity size={17} />}
    >

      <SelectField
        label=""
        placeholder={
          disabled
            ? "Di-disable untuk kondisi klinis ini"
            : "Pilih Aktivitas"
        }
        value={data.aktivitasFisik}
        onChange={(value) =>
          setData({
            ...data,
            aktivitasFisik: value,
          })
        }
        options={aktivitasOptions}
        error={
          showErrors
            ? errors.aktivitasFisik
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