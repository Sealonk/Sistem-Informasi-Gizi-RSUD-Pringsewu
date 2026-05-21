import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssessmentActions from "../../components/perhitungan/assessment/AssessmentActions";
import AssessmentBackground from "../../components/perhitungan/assessment/AssessmentBackground";
import AssessmentFormSections from "../../components/perhitungan/assessment/AssessmentFormSections";
import AssessmentHeader from "../../components/perhitungan/assessment/AssessmentHeader";
import AssessmentStep from "../../components/perhitungan/assessment/AssessmentStep";
import AssessmentValidationAlert from "../../components/perhitungan/assessment/AssessmentValidationAlert";

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
  penyakit: [],
  aktivitasFisik: "",
  faktorStress: "",
  metodePerhitungan: "",
  hemodialisa: "",
  penambahanKalori: [],
};

export default function Assessment() {
  const navigate = useNavigate();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [data, setData] = useState(initialAssessmentData);

  const validationErrors = useMemo(() => {
    const errors = [];

    if (!data.nama?.trim()) errors.push("Nama pasien wajib diisi");
    if (!data.noRM?.trim()) errors.push("No RM wajib diisi");
    if (!data.umur || data.umur <= 0) {
      errors.push("Umur wajib diisi dengan benar");
    }
    if (!data.bb || data.bb <= 0) {
      errors.push("Berat badan wajib diisi dengan benar");
    }
    if (!data.tb || data.tb <= 0) {
      errors.push("Tinggi badan wajib diisi dengan benar");
    }
    if (!data.aktivitasFisik) errors.push("Aktivitas fisik wajib dipilih");
    if (!data.faktorStress) errors.push("Faktor stress wajib dipilih");
    if (!data.metodePerhitungan) {
      errors.push("Metode perhitungan wajib dipilih");
    }
    if (data.penyakit?.includes("ckd") && !data.hemodialisa) {
      errors.push("Status hemodialisa wajib dipilih untuk pasien CKD");
    }
    if (data.isEstimasi && !data.lila) {
      errors.push("LILA wajib diisi untuk estimasi");
    }
    if (data.isEstimasi && !data.ulna) {
      errors.push("ULNA wajib diisi untuk estimasi");
    }

    return errors;
  }, [data]);

  useEffect(() => {
    if (data.jenisKelamin === "L" && data.penambahanKalori?.length) {
      setData((current) => ({
        ...current,
        penambahanKalori: [],
      }));
    }
  }, [data.jenisKelamin, data.penambahanKalori]);

  const handleBack = () => {
    navigate("/perhitungan");
  };

  const handleContinue = () => {
    setSubmitAttempted(true);

    if (validationErrors.length === 0) {
      navigate("/hasil");
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#f8fbff]
        relative
        overflow-hidden
      "
    >
      <AssessmentBackground />

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          py-8
          pb-8
        "
      >
        <AssessmentHeader onBack={handleBack} />
        <AssessmentStep />

        <AssessmentFormSections
          data={data}
          setData={setData}
          errors={validationErrors}
          showErrors={submitAttempted}
        />
      </div>

      {submitAttempted && (
        <AssessmentValidationAlert errors={validationErrors} />
      )}

      <AssessmentActions
        onBack={handleBack}
        onContinue={handleContinue}
      />
    </div>
  );
}
