import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getDiseaseValues } from "../components/perhitungan/assessment/JenisPenyakit";
import {
  initialAssessmentData,
  getFilteredDiseaseCodes,
} from "./assessmentHelpers";
import useAntropometriEstimation from "./useAntropometriEstimation";
import useAssessmentDataFetch from "./useAssessmentDataFetch";

export { getFilteredDiseaseCodes }; // Retain export if any other component imports it directly

export function useAssessmentLogic() {
  const location = useLocation();

  const isRestored = location.state?.fromHasil;
  const restoredData = location.state?.restoredData;
  const patient = isRestored ? location.state?.patient : location.state;

  const isEditMode = location.state?.isEditMode;
  const idPerhitungan = location.state?.id_perhitungan;
  const isInitializingRef = useRef(isEditMode ? true : false);
  const prevDiseaseTypeRef = useRef(null);

  const [data, setData] = useState(() => {
    if (isRestored && restoredData) {
      return restoredData;
    }
    return {
      ...initialAssessmentData,
      nama: patient?.nama || "",
      noRM: patient?.rm || "",
      umur: patient?.umur ? parseInt(patient.umur) : "",
      jenisKelamin: patient?.jk === "Perempuan" ? "P" : "L",
      tanggal_masuk: patient?.tanggal_masuk || patient?.dateISO || "",
      diagnosis: patient?.diagnosis || "",
      originalDiagnosis: patient?.diagnosis || "",
      isEditMode: isEditMode || false,
      id_perhitungan: idPerhitungan || null,
    };
  });

  // Call data fetching sub-hook
  useAssessmentDataFetch({
    patient,
    isRestored,
    isEditMode,
    idPerhitungan,
    setData,
    prevDiseaseTypeRef,
    isInitializingRef,
  });

  // Call estimation calculations sub-hook
  useAntropometriEstimation(data, setData);

  // Sync diagnosis code dynamically with selected diseases (checkboxes) if not manually edited by user
  useEffect(() => {
    if (data.isDiagnosisEdited) return;

    const filtered = getFilteredDiseaseCodes(data.penyakit, data.originalDiagnosis);
    setData((current) => {
      if (current.diagnosis === filtered) return current;
      return {
        ...current,
        diagnosis: filtered,
      };
    });
  }, [data.penyakit, data.originalDiagnosis, data.isDiagnosisEdited]);

  // Reset penambahanKalori if male
  useEffect(() => {
    if (data.jenisKelamin === "L" && data.penambahanKalori?.length) {
      setData((current) => ({
        ...current,
        penambahanKalori: [],
      }));
    }
  }, [data.jenisKelamin, data.penambahanKalori]);

  // Handle disease-specific logic
  useEffect(() => {
    if (isInitializingRef.current) return;
    const penyakitOnly = getDiseaseValues(data.penyakit);
    const isCkdWithoutDm =
      penyakitOnly.includes("ckd") &&
      !penyakitOnly.includes("dm");
    const isStrokeOnly =
      penyakitOnly.length === 1 &&
      penyakitOnly.includes("stroke");
    const isCriticalIll = data.penyakit?.includes("critical_ill");
    const isDM = penyakitOnly.includes("dm");

    if (isCkdWithoutDm) {
      if (
        data.aktivitasFisik ||
        data.faktorStress ||
        data.penambahanKalori?.length
      ) {
        setData((current) => ({
          ...current,
          aktivitasFisik: "",
          faktorStress: "",
          faktorStressSlider: 1.1,
          penambahanKalori: [],
        }));
      }
      return;
    }

    if (isStrokeOnly) {
      if (data.aktivitasFisik || data.faktorStress) {
        setData((current) => ({
          ...current,
          aktivitasFisik: "",
          faktorStress: "",
          faktorStressSlider: 1.1,
        }));
      }
      return;
    }

    if (isCriticalIll) {
      const expectedAktivitas = isDM ? "Istirahat" : "Berbaring di tempat tidur";
      if (data.aktivitasFisik !== expectedAktivitas || data.penambahanKalori?.length) {
        setData((current) => ({
          ...current,
          aktivitasFisik: expectedAktivitas,
          penambahanKalori: [],
        }));
      }
    }
  }, [data.penyakit, data.aktivitasFisik, data.faktorStress, data.penambahanKalori]);

  // Reset aktivitas & faktor stress saat tipe penyakit berubah (DM ↔ non-DM)
  useEffect(() => {
    const penyakitOnly = getDiseaseValues(data.penyakit);
    const isDM = penyakitOnly.includes("dm");
    const currentType = isDM ? "dm" : "other";
    const prevDiseaseType = prevDiseaseTypeRef.current;

    if (prevDiseaseType && currentType !== prevDiseaseType) {
      if (!isInitializingRef.current) {
        setData((current) => ({
          ...current,
          aktivitasFisik: "",
          faktorStress: "",
          faktorStressSlider: isDM ? 10 : 1.1,
        }));
      }
    }

    prevDiseaseTypeRef.current = currentType;
  }, [data.penyakit]);

  return { data, setData, patient, isRestored };
}
