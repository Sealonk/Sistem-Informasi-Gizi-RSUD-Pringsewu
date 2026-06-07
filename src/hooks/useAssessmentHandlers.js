import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  previewPerhitungan,
} from "../services/PasienServices/previewPerhitunganApi";
import {
  getDiseaseValues,
} from "../components/perhitungan/assessment/JenisPenyakit";

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
    navigate("/perhitungan");
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

  const mapFaktorStressToBackend = (stress, isDM) => {
    if (!stress) return "Normal";

    if (isDM) {
      // DM: Frontend mengirim "Ringan", "Sedang", "Berat" — sesuai backend
      return stress;
    }

    // Non-DM (CHF, Stroke, Lambung, dll): Frontend mengirim "Stress Ringan", dll.
    const nonDmMap = {
      "Tidak ada stress": "tidak ada",
      "Stress Ringan": "ringan",
      "Stress Ringan Sepsis": "ringan sepsis",
      "Stress Berat": "berat",
      "Stress Sangat Berat": "sangat berat",
    };
    return nonDmMap[stress] || "Normal";
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
        : mapFaktorStressToBackend(data.faktorStress, isDM);

      const payload = {
        id_pasien: patient?.id_pasien || patient?.id,
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
      };

      console.log("PAYLOAD PREVIEW:", payload);
      const hasil =
        await previewPerhitungan(payload);
      console.log("HASIL PREVIEW:", hasil);

      navigate("/hasil", {
        state: {
          data: {
            ...data,
            id_pasien: patient?.id_pasien || patient?.id,
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
