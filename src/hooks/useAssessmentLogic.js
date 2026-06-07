import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getDetailPasien } from "../services/PasienServices/detailPasienApi";
import { getDiseaseValues } from "../components/perhitungan/assessment/JenisPenyakit";

const initialAssessmentData = {
  nama: "",
  noRM: "",
  umur: "",
  jenisKelamin: "L",
  bb: "",
  tb: "",
  isEstimasi: false,
  lila: "",
  ulna: "",
  bbEstimasi: "",
  tbEstimasi: "",
  persenLila: "",
  originalBb: "",
  originalTb: "",
  penyakit: [],
  penyakitLainnya: "",
  aktivitasFisik: "",
  faktorStress: "",
  metodePerhitungan: "Mifflin St Jeor",
  hemodialisa: "",
  penambahanKalori: [],
};

export function useAssessmentLogic() {
  const location = useLocation();

  const isRestored = location.state?.fromHasil;
  const restoredData = location.state?.restoredData;
  const patient = isRestored
    ? location.state?.patient
    : location.state;

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
    };
  });

  // Load detail pasien
  useEffect(() => {
    if (isRestored) return;

    async function loadDetailPasien() {
      try {
        const patientId = patient?.id;

        if (!patientId) {
          return;
        }

        const detail = await getDetailPasien(patientId);

        const mappedPenyakit =
          detail?.diagnosa_kategori
            ?.map((item) => {
              const value = item.toLowerCase().trim();

              if (value === "dm") return "dm";
              if (value === "ckd") return "ckd";
              if (value === "chf") return "chf";
              if (value === "stroke") return "stroke";
              if (value === "lambung") return "lambung";
              if (value === "critical ill") return "critical_ill";
              if (value === "mifflin") return "mifflin";

              return value;
            }) || [];

        setData((current) => ({
          ...current,
          bb: detail?.berat_badan || "",
          tb: detail?.tinggi_badan || "",
          originalBb: detail?.berat_badan || "",
          originalTb: detail?.tinggi_badan || "",
          penyakit: mappedPenyakit,
          penyakitLainnya: detail?.penyakit_lainnya || "",
        }));
      } catch (error) {
        console.log(error);
      }
    }

    loadDetailPasien();
  }, [patient, isRestored]);

  // Reset aktivitas & faktor stress saat jenis kelamin berubah
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
  const prevDiseaseTypeRef = useRef(null);

  useEffect(() => {
    const penyakitOnly = getDiseaseValues(data.penyakit);
    const isDM = penyakitOnly.includes("dm");
    const currentType = isDM ? "dm" : "other";
    const prevDiseaseType = prevDiseaseTypeRef.current;

    if (prevDiseaseType && currentType !== prevDiseaseType) {
      setData((current) => ({
        ...current,
        aktivitasFisik: "",
        faktorStress: "",
      }));
    }

    prevDiseaseTypeRef.current = currentType;
  }, [data.penyakit]);

  // Handle estimation calculations
  useEffect(() => {
    if (!data.isEstimasi) return;

    const lilaVal = parseFloat(data.lila);
    const ulnaVal = parseFloat(data.ulna);
    const jk = data.jenisKelamin;

    let tbEst = "";
    let bbEst = "";
    let persenLilaVal = "";

    // TB ESTIMASI ULNA
    if (!isNaN(ulnaVal) && ulnaVal > 0) {
      if (jk === "L") {
        tbEst = parseFloat(
          (97.252 + 2.645 * ulnaVal).toFixed(2)
        );
      } else {
        tbEst = parseFloat(
          (68.777 + 3.536 * ulnaVal).toFixed(2)
        );
      }
    }

    // PERSEN LILA
    if (!isNaN(lilaVal) && lilaVal > 0) {
      const standarLila = jk === "L" ? 29 : 28.5;
      persenLilaVal = parseFloat(
        ((lilaVal / standarLila) * 100).toFixed(2)
      );
    }

    // BB ESTIMASI LILA
    if (tbEst && lilaVal) {
      if (jk === "L") {
        bbEst = (lilaVal / 29) * (tbEst - 100);
      } else {
        bbEst = (lilaVal / 28.5) * (tbEst - 100);
      }
      bbEst = parseFloat(bbEst.toFixed(2));
    }

    setData((current) => {
      if (
        current.tbEstimasi === tbEst &&
        current.bbEstimasi === bbEst &&
        current.persenLila === persenLilaVal &&
        current.tb === tbEst &&
        current.bb === bbEst
      ) {
        return current;
      }

      return {
        ...current,
        tbEstimasi: tbEst,
        bbEstimasi: bbEst,
        persenLila: persenLilaVal,
        tb: tbEst,
        bb: bbEst,
      };
    });
  }, [data.isEstimasi, data.lila, data.ulna, data.jenisKelamin]);

  return { data, setData, patient, isRestored };
}
