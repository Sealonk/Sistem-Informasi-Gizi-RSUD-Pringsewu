import { useMemo } from "react";
import {
  getDiseaseValues,
  isValidCombination,
} from "../components/perhitungan/assessment/JenisPenyakit";

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

    return errors;
  }, [data]);

  const hasValidationErrors =
    Object.keys(validationErrors).length > 0;

  return { validationErrors, hasValidationErrors };
}
