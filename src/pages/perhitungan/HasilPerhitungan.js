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

  const mapAktivitasFisikToBackend = (aktivitas, isDM) => {
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

    const nonDmMap = {
      "Berbaring di tempat tidur": "Bed rest",
      "Dapat turun dari tempat tidur": "Ringan",
      "Kerja banyak duduk / sedikit atau tidak olahraga": "Sedang",
      "Kerja banyak berdiri / olahraga 4-5 kali per minggu": "Berat",
      "Pekerjaan berat / olahraga sangat aktif": "Sangat Berat",
    };
    return nonDmMap[aktivitas] || aktivitas;
  };

  const mapFaktorStressToBackend = (stress, isDM) => {
    if (!stress) return "Normal";

    if (isDM) {
      return stress;
    }

    const nonDmMap = {
      "Tidak ada stress": "Normal",
      "Stress Ringan": "Ringan",
      "Stress Ringan Sepsis": "Sedang",
      "Stress Berat": "Berat",
      "Stress Sangat Berat": "Berat",
    };
    return nonDmMap[stress] || "Normal";
  };

  const executeSave = async () => {
    setShowConfirm(false);
    setIsSaving(true);
    setFeedback(null);

    try {
      const dataSimpan = hasil?.data?.data_simpan || {};

      const penyakitOnly = (data?.penyakit || []).filter(
        (item) => !["critical_ill", "mifflin"].includes(item)
      );
      const isDM = penyakitOnly.includes("dm");
      const isStrokeOnly = penyakitOnly.length === 1 && penyakitOnly.includes("stroke");

      const mappedAktivitas = isStrokeOnly
        ? null
        : mapAktivitasFisikToBackend(data?.aktivitasFisik, isDM);
      const mappedStress = isStrokeOnly
        ? null
        : mapFaktorStressToBackend(data?.faktorStress, isDM);

      const payload = {
        id_pasien: data?.id_pasien,
        diagnosa_penyakit:
          data?.penyakit?.map((item) => {
            if (item === "dm") return "DM";
            if (item === "ckd") return "CKD";
            if (item === "chf") return "CHF";
            if (item === "stroke") return "Stroke";
            if (item === "lambung") return "Lambung";
            if (item === "mifflin") return "Mifflin";
            if (item === "critical_ill") return "Critical Ill";
            return item;
          }) || [],
        penyakit_lainnya: data?.penyakitLainnya || null,
        jenis_kelamin: data?.jenisKelamin,
        umur: Number(data?.umur),
        berat_badan: Number(data?.bb),
        tinggi_badan: Number(data?.tb),
        is_estimasi: data?.isEstimasi || false,
        lila_cm: data?.lila ? Number(data?.lila) : null,
        ulna_cm: data?.ulna ? Number(data?.ulna) : null,
        persen_lila: data?.isEstimasi && data?.persenLila ? Number(data?.persenLila) : null,

        aktivitas_fisik: mappedAktivitas,
        faktor_stres: mappedStress,
        kategori_penambahan_energi: data?.penambahanKalori?.join(", ") || "Tidak ada",
        status_hemodialisa: data?.hemodialisa === "Ya" ? "Iya" : (data?.hemodialisa || "Tidak"),
        metode_perhitungan: data?.metodePerhitungan,

        berat_badan_ideal: dataSimpan.berat_badan_ideal || 0,
        bmr: dataSimpan.bmr || 0,
        faktor_aktivitas_nilai: dataSimpan.faktor_aktivitas_nilai || 0,
        faktor_stres_nilai: dataSimpan.faktor_stres_nilai || 0,
        penambahan_kalori: dataSimpan.penambahan_kalori || 0,
        kebutuhan_energi_total: dataSimpan.kebutuhan_energi_total || 0,

        protein_persen: dataSimpan.protein_persen || 0,
        lemak_persen: dataSimpan.lemak_persen || 0,
        karbohidrat_persen: dataSimpan.karbohidrat_persen || 0,
        protein_gram: dataSimpan.protein_gram || 0,
        lemak_gram: dataSimpan.lemak_gram || 0,
        karbohidrat_gram: dataSimpan.karbohidrat_gram || 0,
      };

      const response = await savePerhitungan(payload);

      if (response.status === "success") {

  setFeedback({
    type: "success",
    message:
      response.message ||
      "Riwayat perhitungan berhasil disimpan",
  });

  setShowSuccessModal(true);

} else {

  throw new Error(
    response.message ||
    "Gagal menyimpan perhitungan"
  );
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
{showSuccessModal && (

  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/40
      backdrop-blur-sm
      px-4
    "
  >

    <div
      className="
        w-full
        max-w-md
        rounded-[28px]
        bg-white
        p-7
        shadow-2xl
      "
    >

      {/* TITLE */}
      <h3
        className="
          text-2xl
          font-bold
          text-slate-900
          mb-3
        "
      >
        Riwayat Berhasil Disimpan
      </h3>

      {/* DESC */}
      <p
        className="
          text-sm
          leading-relaxed
          text-slate-500
          mb-7
        "
      >
        Data hasil perhitungan pasien
        telah berhasil disimpan ke
        riwayat perhitungan gizi.
      </p>

      {/* ACTION */}
      <div
        className="
          flex
          flex-col
          sm:flex-row
          gap-3
        "
      >

        {/* PORTAL */}
        <button
          onClick={() =>
            navigate("/portal")
          }
          className="
            flex-1
            h-12
            rounded-2xl
            bg-slate-100
            text-slate-700
            text-sm
            font-semibold
            hover:bg-slate-200
            transition-all
          "
        >
          Portal
        </button>
        
        {/* HITUNG LAGI */}
        <button
          onClick={() =>
            navigate("/perhitungan")
          }
          className="
            flex-1
            h-12
            rounded-2xl
            bg-blue-50
            text-blue-600
            text-sm
            font-semibold
            hover:bg-blue-100
            transition-all
          "
        >
          Hitung Lagi
        </button>

        {/* RIWAYAT */}
        <button
          onClick={() =>
            navigate("/riwayat")
          }
          className="
            flex-1
            h-12
            rounded-2xl
            bg-blue-600
            text-white
            text-sm
            font-semibold
            hover:bg-blue-700
            transition-all
          "
        >
          Riwayat
        </button>
      </div>
    </div>
  </div>
)}
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