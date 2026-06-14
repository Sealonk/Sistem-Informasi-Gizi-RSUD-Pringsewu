import { useMemo } from "react";
import {
  getDiseaseValues,
  isValidCombination,
} from "../components/perhitungan/assessment/JenisPenyakit";
import {
  MACRO_CONFIGS,
  isExcludedCombination,
} from "../components/perhitungan/assessment/PersentaseMakro";

export function useAssessmentValidation(data) {
  const validationErrors = useMemo(() => {
    const errors = {};

    const selectedDiseaseValues = getDiseaseValues(
      data.penyakit
    );

    if (
      selectedDiseaseValues.length > 0 &&
      !isValidCombination(selectedDiseaseValues)
    ) {
      errors.penyakit =
        "Kombinasi penyakit tidak didukung oleh sistem";
    }

    if (!data.nama?.trim()) {
      errors.nama = "Nama pasien wajib diisi";
    }

    if (!data.noRM?.trim()) {
      errors.noRM = "No RM wajib diisi";
    }

    if (!data.umur || Number(data.umur) <= 0) {
      errors.umur = "Umur wajib diisi dengan benar";
    } else if (Number(data.umur) <= 18) {
      errors.umur =
        "Sistem hanya mendukung pasien dewasa dan lansia (umur 18 tahun ke atas)";
    }

    if (!data.bb || Number(data.bb) <= 0) {
      errors.bb = "Berat badan wajib diisi dengan benar";
    }

    if (!data.tb || Number(data.tb) <= 0) {
      errors.tb = "Tinggi badan wajib diisi dengan benar";
    }

    const penyakitOnly = getDiseaseValues(data.penyakit);
    const isCkdWithoutDm =
      penyakitOnly.includes("ckd") &&
      !penyakitOnly.includes("dm");
    const isStrokeOnly =
      penyakitOnly.length === 1 &&
      penyakitOnly.includes("stroke");
    const skipAktivitasStress =
      isCkdWithoutDm || isStrokeOnly;

    if (!skipAktivitasStress && !data.aktivitasFisik) {
      errors.aktivitasFisik =
        "Aktivitas fisik wajib dipilih";
    }

    if (!skipAktivitasStress && !data.faktorStress) {
      errors.faktorStress =
        "Faktor stress wajib dipilih";
    }

    if (
      data.penyakit?.includes("ckd") &&
      data.hemodialisa === ""
    ) {
      errors.hemodialisa =
        "Status hemodialisa wajib dipilih untuk pasien CKD";
    }

    if (data.isEstimasi && !data.lila) {
      errors.lila = "LILA wajib diisi untuk estimasi";
    }

    if (data.isEstimasi && !data.ulna) {
      errors.ulna = "ULNA wajib diisi untuk estimasi";
    }

    // Macronutrient percentage validation
    const diseaseValues = getDiseaseValues(data.penyakit);
    const sorted = [...diseaseValues].sort().join(",");
    const config = MACRO_CONFIGS[sorted];
    const isExcluded = isExcludedCombination(data.penyakit);

    if (config && !isExcluded) {
      if (config.type === "three-sliders") {
        const pVal = data.persen_protein ?? config.protein.defaultVal;
        const lVal = data.persen_lemak ?? config.lemak.defaultVal;
        const kVal = data.persen_karbohidrat ?? config.karbo.defaultVal;
        
        if (pVal + lVal + kVal !== 100) {
          errors.makronutrien = "Total persentase makronutrien harus tepat 100%";
        } else if (pVal < config.protein.min || pVal > config.protein.max) {
          errors.makronutrien = `Protein harus berada di antara ${config.protein.min}% - ${config.protein.max}%`;
        } else if (lVal < config.lemak.min || lVal > config.lemak.max) {
          errors.makronutrien = `Lemak harus berada di antara ${config.lemak.min}% - ${config.lemak.max}%`;
        } else if (kVal < config.karbo.min || kVal > config.karbo.max) {
          errors.makronutrien = `Karbohidrat harus berada di antara ${config.karbo.min}% - ${config.karbo.max}%`;
        }
      } else if (config.type === "one-slider") {
        const lVal = data.persen_lemak ?? config.lemak.defaultVal;
        if (lVal < config.lemak.min || lVal > config.lemak.max) {
          errors.makronutrien = `Lemak harus berada di antara ${config.lemak.min}% - ${config.lemak.max}%`;
        }
      }
    }

    return errors;
  }, [data]);

  const hasValidationErrors =
    Object.keys(validationErrors).length > 0;

  return { validationErrors, hasValidationErrors };
}
