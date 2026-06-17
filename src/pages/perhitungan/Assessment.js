import AssessmentActions from "../../components/perhitungan/assessment/AssessmentActions";
import AssessmentBackground from "../../components/perhitungan/assessment/AssessmentBackground";
import AssessmentFormSections from "../../components/perhitungan/assessment/AssessmentFormSections";
import AssessmentHeader from "../../components/perhitungan/assessment/AssessmentHeader";
import AssessmentStep from "../../components/perhitungan/assessment/AssessmentStep";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useAssessmentLogic } from "../../hooks/useAssessmentLogic";
import { useAssessmentValidation } from "../../hooks/useAssessmentValidation";
import { useAssessmentHandlers } from "../../hooks/useAssessmentHandlers";

export default function Assessment() {
  // Get state and handlers from custom hooks
  const { data, setData, patient } =
    useAssessmentLogic();
  const { validationErrors, hasValidationErrors } =
    useAssessmentValidation(data);
  const {
    submitAttempted,
    showConfirm,
    setShowConfirm,
    handleBack,
    handleContinue,
    executeContinue,
  } = useAssessmentHandlers(data, patient, hasValidationErrors);

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
          max-w-5xl
          mx-auto
          px-4
          py-6
          sm:px-6
          sm:py-8
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

      <AssessmentActions
        onBack={handleBack}
        onContinue={handleContinue}
      />

      <ConfirmationModal
        isOpen={showConfirm}
        title="Hitung Gizi Pasien"
        message="Apakah Anda yakin data assessment yang dimasukkan sudah benar dan ingin memproses perhitungan gizi pasien ini?"
        onConfirm={executeContinue}
        onCancel={() => setShowConfirm(false)}
        confirmText="Hitung & Lanjut"
      />
    </div>
  );
}
