import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  previewPerhitungan,
} from "../services/perhitungan/previewPerhitunganApi";
import {
  getDiseaseValues,
} from "../components/perhitungan/assessment/JenisPenyakit";
import {
  MACRO_CONFIGS,
  isExcludedCombination,
} from "../components/perhitungan/assessment/PersentaseMakro";

export function useAssessmentHandlers(
  data,
  patient,
  hasValidationErrors
) {
  const navigate = useNavigate();
  const [submitAttempted, setSubmitAttempted] =
    useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBack = () => {
    if (data.isEditMode) {
      navigate("/riwayat");
    } else {
      navigate("/perhitungan");
    }
  };

  const handleContinue = () => {
    setSubmitAttempted(true);
    if (hasValidationErrors) {
      return;
    }
    setShowConfirm(true);
  };

  const mapAktivitasFisikToBackend = (
    aktivitas,
    isDM
  ) => {
    if (!aktivitas) return null;

    if (isDM) {
      const dmMap = {
        Istirahat: "Bed rest",
        Ringan: "Ringan",
        Sedang: "Sedang",
        Berat: "Berat",
        "Sangat berat": "Sangat Berat",
      };
      return dmMap[aktivitas] || aktivitas;
    }

    // Non-DM (CHF, Stroke, Lambung, dll)
    const nonDmMap = {
      "Berbaring di tempat tidur": "Bed rest",
      "Dapat turun dari tempat tidur": "Ringan",
      "Kerja banyak duduk / sedikit atau tidak olahraga":
        "Sedang",
      "Kerja banyak berdiri / olahraga 4-5 kali per minggu":
        "Berat",
      "Pekerjaan berat / olahraga sangat aktif":
        "Sangat Berat",
    };
    return nonDmMap[aktivitas] || aktivitas;
  };

  const mapFaktorStressToBackend = (stress, sliderVal, isDM) => {
    if (!stress) return "Normal";

    if (isDM) {
      return stress;
    }

    const num = parseFloat(sliderVal || 1.1);
    return `${num.toFixed(2)} (${stress})`;
  };

  const executeContinue = async () => {
    setShowConfirm(false);
    try {
      console.log("PATIENT:", patient);

      const penyakitOnly = getDiseaseValues(data.penyakit);
      const isDM = penyakitOnly.includes("dm");
      const isStrokeOnly =
        penyakitOnly.length === 1 &&
        penyakitOnly.includes("stroke");
      const mappedAktivitas = isStrokeOnly
        ? null
        : mapAktivitasFisikToBackend(data.aktivitasFisik, isDM);
      const mappedStress = isStrokeOnly
        ? null
        : mapFaktorStressToBackend(data.faktorStress, data.faktorStressSlider, isDM);

      const sorted = [...penyakitOnly].sort().join(",");
      const config = MACRO_CONFIGS[sorted];
      const isExcluded = isExcludedCombination(data.penyakit);

      let persen_protein = undefined;
      let persen_lemak = undefined;
      let persen_karbohidrat = undefined;

      if (config && !isExcluded) {
        if (config.type === "three-sliders") {
          persen_protein = data.persen_protein ?? config.protein.defaultVal;
          persen_lemak = data.persen_lemak ?? config.lemak.defaultVal;
          persen_karbohidrat = data.persen_karbohidrat ?? config.karbo.defaultVal;
        } else if (config.type === "one-slider") {
          persen_lemak = data.persen_lemak ?? config.lemak.defaultVal;
        }
      }

      const payload = {
        id_pasien: data.id_pasien || patient?.id_pasien || patient?.id,
        diagnosa_penyakit:
          data.penyakit?.map((item) => {
            if (item === "dm") return "DM";
            if (item === "ckd") return "CKD";
            if (item === "chf") return "CHF";
            if (item === "stroke") return "Stroke";
            if (item === "lambung") return "Lambung";
            if (item === "mifflin") return "Mifflin";
            if (item === "critical_ill") return "Critical Ill";
            return item;
          }) || [],
        penyakit_lainnya: data.penyakitLainnya || null,
        jenis_kelamin: data.jenisKelamin,
        umur: Number(data.umur),
        is_estimasi: data.isEstimasi,
        lila_cm: data.lila ? Number(data.lila) : null,
        ulna_cm: data.ulna ? Number(data.ulna) : null,
        persen_lila:
          data.isEstimasi && data.persenLila
            ? Number(data.persenLila)
            : null,
        berat_badan: Number(data.bb),
        tinggi_badan: Number(data.tb),
        aktivitas_fisik: mappedAktivitas,
        faktor_stres: mappedStress,
        kategori_penambahan_energi: data.penambahanKalori
          ?.length
          ? data.penambahanKalori.join(", ")
          : "Tidak ada",
        status_hemodialisa: data.hemodialisa || "Tidak",
        metode_perhitungan: "Mifflin St Jeor",
        persen_protein: persen_protein !== undefined ? String(persen_protein) : undefined,
        persen_lemak: persen_lemak !== undefined ? String(persen_lemak) : undefined,
        persen_karbohidrat: persen_karbohidrat !== undefined ? String(persen_karbohidrat) : undefined,
        input_persen_protein: persen_protein,
        input_persen_lemak: persen_lemak,
        input_persen_karbo: persen_karbohidrat,
      };

      console.log("PAYLOAD PREVIEW:", payload);
      const hasil =
        await previewPerhitungan(payload);
      console.log("HASIL PREVIEW:", hasil);

      navigate("/hasil", {
        state: {
          data: {
            ...data,
            id_pasien: data.id_pasien || patient?.id_pasien || patient?.id,
          },
          hasil,
        },
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return {
    submitAttempted,
    setSubmitAttempted,
    showConfirm,
    setShowConfirm,
    handleBack,
    handleContinue,
    executeContinue,
  };
}
