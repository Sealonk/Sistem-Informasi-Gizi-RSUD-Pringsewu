import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getDetailPasien } from "../services/PasienServices/detailPasienApi";
import { getDiseaseValues } from "../components/perhitungan/assessment/JenisPenyakit";
import { getRiwayatDetail } from "../services/PasienServices/riwayatApi";

const CATEGORY_PREFIXES = {
  dm: ["E10", "E11", "E12", "E13", "E14"],
  ckd: ["N18"],
  chf: ["I50"],
  stroke: ["I60", "I61", "I62", "I63", "I64"],
  lambung: ["K21", "K25", "K29", "K30"]
};

const CATEGORY_DEFAULTS = {
  dm: "E11.9",
  ckd: "N18.9",
  chf: "I50.0",
  stroke: "I63.9",
  lambung: "K29.7"
};

export const getFilteredDiseaseCodes = (selectedPenyakitKeys, originalDiagnosis) => {
  if (!selectedPenyakitKeys || selectedPenyakitKeys.length === 0) return "-";

  const rawCodes = originalDiagnosis 
    ? originalDiagnosis.split(",").map(c => c.trim()).filter(Boolean) 
    : [];

  const filteredCodes = [];

  selectedPenyakitKeys.forEach(key => {
    const prefixes = CATEGORY_PREFIXES[key];
    if (prefixes) {
      const matches = rawCodes.filter(code => 
        prefixes.some(prefix => code.toUpperCase().startsWith(prefix.toUpperCase()))
      );
      if (matches.length > 0) {
        filteredCodes.push(...matches);
      } else {
        const defaultCode = CATEGORY_DEFAULTS[key];
        if (defaultCode) {
          filteredCodes.push(defaultCode);
        }
      }
    } else if (key === "mifflin" || key === "critical_ill") {
      const otherMatches = rawCodes.filter(code => 
        !Object.values(CATEGORY_PREFIXES).flat().some(prefix => 
          code.toUpperCase().startsWith(prefix.toUpperCase())
        )
      );
      if (otherMatches.length > 0) {
        filteredCodes.push(...otherMatches);
      }
    }
  });

  const uniqueCodes = [...new Set(filteredCodes)];
  return uniqueCodes.length > 0 ? uniqueCodes.join(", ") : "-";
};

export const mapAktivitasFisikFromBackend = (val, isDM) => {
  if (!val) return "";
  const cleaned = val.toLowerCase().trim();

  if (isDM) {
    if (cleaned === "bed rest" || cleaned === "istirahat") return "Istirahat";
    if (cleaned === "ringan") return "Ringan";
    if (cleaned === "sedang") return "Sedang";
    if (cleaned === "berat") return "Berat";
    if (cleaned === "sangat berat") return "Sangat berat";
    return val;
  }

  // Non-DM
  if (cleaned === "bed rest" || cleaned === "berbaring di tempat tidur") return "Berbaring di tempat tidur";
  if (cleaned === "ringan" || cleaned === "dapat turun dari tempat tidur") return "Dapat turun dari tempat tidur";
  if (cleaned === "sedang" || cleaned === "kerja banyak duduk / sedikit atau tidak olahraga") return "Kerja banyak duduk / sedikit atau tidak olahraga";
  if (cleaned === "berat" || cleaned === "kerja banyak berdiri / olahraga 4-5 kali per minggu") return "Kerja banyak berdiri / olahraga 4-5 kali per minggu";
  if (cleaned === "sangat berat" || cleaned === "pekerjaan berat / olahraga sangat aktif") return "Pekerjaan berat / olahraga sangat aktif";
  return val;
};

export const mapFaktorStressFromBackend = (val, isDM) => {
  if (!val) return { parent: "", slider: 1.1 };
  const cleaned = val.toLowerCase().trim();

  if (isDM) {
    let parent = val;
    if (cleaned === "ringan") parent = "Ringan";
    if (cleaned === "sedang") parent = "Sedang";
    if (cleaned === "berat") parent = "Berat";
    return { parent, slider: isNaN(parseFloat(val)) ? 10 : parseFloat(val) };
  }

  // Parse format "X.XX (Category)"
  const match = val.match(/^([0-9.]+)(?:\s*\((.*)\))?$/);
  if (match) {
    const num = parseFloat(match[1]);
    const category = match[2] || "";

    let parent = "Tidak ada stress";
    if (category.toLowerCase().includes("sepsis")) {
      parent = "Stress Ringan Sepsis";
    } else if (category.toLowerCase().includes("sangat berat")) {
      parent = "Stress Sangat Berat";
    } else if (category.toLowerCase().includes("ringan")) {
      parent = "Stress Ringan";
    } else if (category.toLowerCase().includes("berat")) {
      parent = "Stress Berat";
    } else {
      // Fallback berdasarkan nilai angka
      if (num >= 1.2 && num <= 1.4) {
        parent = "Stress Ringan";
      } else if (num > 1.4 && num <= 1.5) {
        parent = "Stress Ringan Sepsis";
      } else if (num > 1.5 && num <= 1.6) {
        parent = "Stress Berat";
      } else if (num > 1.6 && num <= 1.7) {
        parent = "Stress Sangat Berat";
      }
    }

    return { parent, slider: num };
  }

  // Fallback untuk catatan lama yang disimpan berupa teks murni
  if (cleaned === "tidak ada" || cleaned === "normal" || cleaned === "tidak ada stress") {
    return { parent: "Tidak ada stress", slider: 1.1 };
  }
  if (cleaned === "ringan" || cleaned === "stress ringan") {
    return { parent: "Stress Ringan", slider: 1.3 };
  }
  if (cleaned === "ringan sepsis" || cleaned === "stress ringan sepsis") {
    return { parent: "Stress Ringan Sepsis", slider: 1.5 };
  }
  if (cleaned === "berat" || cleaned === "stress berat") {
    return { parent: "Stress Berat", slider: 1.6 };
  }
  if (cleaned === "sangat berat" || cleaned === "stress sangat berat") {
    return { parent: "Stress Sangat Berat", slider: 1.7 };
  }

  return { parent: val, slider: 1.1 };
};

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
  faktorStressSlider: 1.1,
  metodePerhitungan: "Mifflin St Jeor",
  hemodialisa: "",
  penambahanKalori: [],
  tanggal_masuk: "",
  diagnosis: "",
  originalDiagnosis: "",
  isDiagnosisEdited: false,
};

export function useAssessmentLogic() {
  const location = useLocation();

  const isRestored = location.state?.fromHasil;
  const restoredData = location.state?.restoredData;
  const patient = isRestored
    ? location.state?.patient
    : location.state;

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
          tanggal_masuk: current.tanggal_masuk || detail?.tanggal_masuk || "",
          diagnosis: detail?.diagnosis || current.diagnosis || "",
          originalDiagnosis: detail?.diagnosis || current.originalDiagnosis || "",
        }));
      } catch (error) {
        console.log(error);
      }
    }

    loadDetailPasien();
  }, [patient, isRestored]);

  // Load detail riwayat for editing
  useEffect(() => {
    if (!isEditMode || !idPerhitungan) return;

    async function loadDetailRiwayat() {
      try {
        const response = await getRiwayatDetail(idPerhitungan);
        if (response.status === "success") {
          const detail = response.data;
          
          let penyakitLainnya = "";
          let penyakitString = detail.diagnosa_penyakit_saat_dihitung || "";
          const mifflinMatch = penyakitString.match(/Mifflin \(([^)]+)\)/);
          if (mifflinMatch) {
            penyakitLainnya = mifflinMatch[1];
            penyakitString = penyakitString.replace(/Mifflin \([^)]+\)/, "Mifflin");
          }
          
          const penyakitArray = penyakitString
            ? penyakitString.split(",").map((p) => {
                const val = p.trim();
                if (val.toLowerCase() === "critical ill") return "critical_ill";
                return val.toLowerCase();
              }).filter(Boolean)
            : [];

          const isDM = penyakitArray.includes("dm");
          const mappedAktivitas = mapAktivitasFisikFromBackend(detail.aktivitas_fisik, isDM);
          const mappedStress = mapFaktorStressFromBackend(detail.faktor_stres, isDM);

          // Update the prev disease type ref immediately so the disease type change effect won't trigger a reset
          prevDiseaseTypeRef.current = isDM ? "dm" : "other";

          const originalValues = {
            bb: detail.berat_badan_saat_dihitung || "",
            tb: detail.tinggi_badan_saat_dihitung || "",
            isEstimasi: detail.is_estimasi === 1,
            lila: detail.lila_cm || "",
            ulna: detail.ulna_cm || "",
            penyakit: [...penyakitArray],
            penyakitLainnya: penyakitLainnya || "",
            aktivitasFisik: mappedAktivitas,
            faktorStress: mappedStress.parent,
            faktorStressSlider: mappedStress.slider,
            hemodialisa: detail.status_hemodialisa === "Iya" || detail.status_hemodialisa === "Ya" ? "Ya" : "Tidak",
            penambahanKalori: detail.kategori_penambahan_energi && detail.kategori_penambahan_energi !== "Tidak ada"
              ? detail.kategori_penambahan_energi.split(", ")
              : [],
            persen_protein: detail.protein_persen || undefined,
            persen_lemak: detail.lemak_persen || undefined,
            persen_karbohidrat: detail.karbohidrat_persen || undefined,
            umur: detail.umur_saat_dihitung ? String(Math.round(detail.umur_saat_dihitung)) : "",
            jenisKelamin: detail.jenis_kelamin || "L",
          };

          setData({
            nama: detail.nama_pasien || "",
            noRM: detail.no_rm || "",
            umur: detail.umur_saat_dihitung ? String(Math.round(detail.umur_saat_dihitung)) : "",
            jenisKelamin: detail.jenis_kelamin || "L",
            bb: detail.berat_badan_saat_dihitung || "",
            tb: detail.tinggi_badan_saat_dihitung || "",
            isEstimasi: detail.is_estimasi === 1,
            lila: detail.lila_cm || "",
            ulna: detail.ulna_cm || "",
            bbEstimasi: detail.is_estimasi === 1 ? detail.berat_badan_saat_dihitung : "",
            tbEstimasi: detail.is_estimasi === 1 ? detail.tinggi_badan_saat_dihitung : "",
            persenLila: detail.persen_lila || "",
            originalBb: detail.berat_badan_saat_dihitung || "",
            originalTb: detail.berat_badan_saat_dihitung || "",
            penyakit: penyakitArray,
            penyakitLainnya: penyakitLainnya || "",
            aktivitasFisik: mappedAktivitas,
            faktorStress: mappedStress.parent,
            faktorStressSlider: mappedStress.slider,
            metodePerhitungan: detail.metode_perhitungan || "Mifflin St Jeor",
            hemodialisa: detail.status_hemodialisa === "Iya" || detail.status_hemodialisa === "Ya" ? "Ya" : "Tidak",
            penambahanKalori: detail.kategori_penambahan_energi && detail.kategori_penambahan_energi !== "Tidak ada"
              ? detail.kategori_penambahan_energi.split(", ")
              : [],
            tanggal_masuk: detail.tanggal_masuk || "",
            diagnosis: detail.kode_penyakit || "",
            originalDiagnosis: detail.kode_penyakit || "",
            isDiagnosisEdited: false,
            persen_protein: detail.protein_persen || undefined,
            persen_lemak: detail.lemak_persen || undefined,
            persen_karbohidrat: detail.karbohidrat_persen || undefined,
            
            // Edit Mode markers
            isEditMode: true,
            id_perhitungan: idPerhitungan,
            id_pasien: detail.no_rawat,
            originalValues: originalValues,
          });
          
          isInitializingRef.current = false;
        }
      } catch (err) {
        console.error("Gagal mengambil detail riwayat untuk edit:", err);
      }
    }

    loadDetailRiwayat();
  }, [isEditMode, idPerhitungan]);

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
