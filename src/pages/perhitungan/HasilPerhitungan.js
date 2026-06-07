import { useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import FeedbackAlert from "../../components/common/FeedbackAlert";
import AssessmentStep from "../../components/perhitungan/assessment/AssessmentStep";
import HasilHeader from "../../components/perhitungan/Hasil/HasilHeader";
import SummaryCard from "../../components/perhitungan/Hasil/SummaryCard";
import MakroChart from "../../components/perhitungan/Hasil/MakroChart";
import FaktorPerhitungan from "../../components/perhitungan/Hasil/FaktorPerhitungan";
import StatusGizi from "../../components/perhitungan/Hasil/StatusGizi";
import HasilAction from "../../components/perhitungan/Hasil/HasilAction";

import { savePerhitungan } from "../../services/PasienServices/simpanPerhitunganApi";
import PortalBackground from "../../components/portal/PortalBackground";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import SuccessModal from "../../components/perhitungan/Hasil/SuccessModal";
import { prepareSavePayload } from "./hasilHelpers";

export default function HasilPerhitungan() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    data,
    hasil,
  } = location.state || {};

  const hasilPreview = 
    hasil?.data?.perhitungan?.hasil;

  const [feedback, setFeedback] =
    useState(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    showSuccessModal,
    setShowSuccessModal,
  ] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleBack = () => {
    const patientObj = {
      id: data?.id_pasien,
      nama: data?.nama,
      rm: data?.noRM,
      umur: data?.umur,
      jk: data?.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"
    };

    navigate("/assessment", {
      state: {
        fromHasil: true,
        restoredData: data,
        patient: patientObj
      }
    });
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const executeSave = async () => {
    setShowConfirm(false);
    setIsSaving(true);
    setFeedback(null);

    try {
      const payload = prepareSavePayload(data, hasil);
      const response = await savePerhitungan(payload);

      if (response.status === "success") {
        setFeedback({
          type: "success",
          message: response.message || "Riwayat perhitungan berhasil disimpan",
        });
        setShowSuccessModal(true);
      } else {
        throw new Error(response.message || "Gagal menyimpan perhitungan");
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Perhitungan gagal disimpan. Silakan coba kembali.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (

    <div
      className="
        min-h-screen
        bg-[#f8fbff]
        px-6
        py-8
        relative
        overflow-hidden
      "
    >
      <PortalBackground />

      <div
        className="
          max-w-7xl
          mx-auto
          space-y-6
          relative
          z-10
        "
      >

        <AssessmentStep activeStep={2} />

        <FeedbackAlert
          type={feedback?.type}
          message={feedback?.message}
          onClose={() =>
            setFeedback(null)
          }
        />

        <HasilHeader
          data={data}
        />

        <SummaryCard
          hasil={{
            energi: hasilPreview?.energi_kkal || 0,
            protein: hasilPreview?.protein_gr || 0,
            lemak: hasilPreview?.lemak_gr || 0,
            karbohidrat: hasilPreview?.karbohidrat_gr || 0,
          }}
        />

        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          "
        >

          <MakroChart
  hasil={{
    protein: hasilPreview?.protein_gr || 0,
    lemak: hasilPreview?.lemak_gr || 0,
    karbohidrat: hasilPreview?.karbohidrat_gr || 0,

    proteinPersen:
      hasil?.data?.perhitungan?.persen?.protein || 0,

    lemakPersen:
      hasil?.data?.perhitungan?.persen?.lemak || 0,

    karbohidratPersen:
      hasil?.data?.perhitungan?.persen?.karbohidrat || 0,
  }}
/>

          <FaktorPerhitungan
  data={{
    ...data,

    bbi:
      hasil?.data?.berat_badan_ideal || 0,

    bmr:
      hasil?.data?.data_simpan?.bmr || 0,

    aktivitasFisikLabel: data?.aktivitasFisik || "",

    faktorAktivitasNilai:
      hasil?.data?.data_simpan?.faktor_aktivitas_nilai ?? 0,

    faktorStressLabel: data?.faktorStress || "",

    faktorStressNilai:
      hasil?.data?.data_simpan?.faktor_stres_nilai ?? 0,

    penambahanKaloriNilai:
      hasil?.data?.data_simpan?.penambahan_kalori ?? 0,
  }}
/>

       </div>

<StatusGizi
  data={{
    ...data,
    bb: data?.bb,
    tb: data?.tb,
    imt_nilai: hasil?.data?.imt_preview?.nilaiIMT,
    imt_status: hasil?.data?.imt_preview?.statusGizi,
  }}
/>

<HasilAction
  navigate={navigate}
  onSave={handleSave}
  isSaving={isSaving}
  onBack={handleBack}
/>

{/* SUCCESS MODAL */}
<SuccessModal isOpen={showSuccessModal} />
      <ConfirmationModal
        isOpen={showConfirm}
        title="Simpan Hasil Perhitungan"
        message="Apakah Anda yakin ingin menyimpan riwayat perhitungan gizi pasien ini ke database?"
        onConfirm={executeSave}
        onCancel={() => setShowConfirm(false)}
        confirmText="Simpan"/>
</div>
</div>
);
}