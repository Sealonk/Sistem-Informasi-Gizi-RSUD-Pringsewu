import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import AssessmentActions from "../../components/perhitungan/assessment/AssessmentActions";
import AssessmentBackground from "../../components/perhitungan/assessment/AssessmentBackground";
import AssessmentFormSections from "../../components/perhitungan/assessment/AssessmentFormSections";
import AssessmentHeader from "../../components/perhitungan/assessment/AssessmentHeader";
import AssessmentStep from "../../components/perhitungan/assessment/AssessmentStep";
import { isValidCombination } from "../../components/perhitungan/assessment/JenisPenyakit";
import ConfirmationModal from "../../components/common/ConfirmationModal";

import {
  previewPerhitungan,
} from "../../services/PasienServices/previewPerhitunganApi";

import {
  getDetailPasien,
} from "../../services/PasienServices/detailPasienApi";

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
  aktivitasFisik: "",
  faktorStress: "",
  metodePerhitungan: "Mifflin St Jeor",
  hemodialisa: "",
  penambahanKalori: [],
};

export default function Assessment() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const isRestored = location.state?.fromHasil;
  const restoredData = location.state?.restoredData;
  const patient = isRestored ? location.state?.patient : location.state;

  const [submitAttempted,
    setSubmitAttempted,
  ] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

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

  useEffect(() => {
    if (isRestored) return;

    async function loadDetailPasien() {

      try {

        const patientId =
          patient?.id;

        if (!patientId) {
          return;
        }

        const detail =
          await getDetailPasien(
            patientId
          );

        const mappedPenyakit =
          detail?.diagnosa_kategori
            ?.map((item) => {

              const value =
                item
                  .toLowerCase()
                  .trim();

              if (value === "dm") {
                return "dm";
              }

              if (value === "ckd") {
                return "ckd";
              }

              if (value === "chf") {
                return "chf";
              }

              if (value === "stroke") {
                return "stroke";
              }

              if (value === "lambung") {
                return "lambung";
              }

              return value;

            }) || [];

        setData((current) => ({

          ...current,

          bb:
            detail?.berat_badan || "",

          tb:
            detail?.tinggi_badan || "",

          originalBb:
            detail?.berat_badan || "",

          originalTb:
            detail?.tinggi_badan || "",

          penyakit:
            mappedPenyakit,
        }));

      } catch (error) {

        console.log(error);

      }
    }

    loadDetailPasien();

  }, [patient, isRestored]);

  const validationErrors =
    useMemo(() => {

      const errors = {};

      if (
        data.penyakit?.length > 0 &&
        !isValidCombination(data.penyakit)
      ) {
        errors.penyakit =
          "Kombinasi penyakit tidak didukung oleh sistem";
      }

      if (!data.nama?.trim()) {
        errors.nama =
          "Nama pasien wajib diisi";
      }

      if (!data.noRM?.trim()) {
        errors.noRM =
          "No RM wajib diisi";
      }

      if (
        !data.umur ||
        Number(data.umur) <= 0
      ) {
        errors.umur =
          "Umur wajib diisi dengan benar";
      } else if (
        Number(data.umur)  <= 18 
      ) {
        errors.umur =
          "Sistem hanya mendukung pasien dewasa dan lansia (umur 18 tahun ke atas)";
      }

      if (
        !data.bb ||
        Number(data.bb) <= 0
      ) {
        errors.bb =
          "Berat badan wajib diisi dengan benar";
      }

      if (
        !data.tb ||
        Number(data.tb) <= 0
      ) {
        errors.tb =
          "Tinggi badan wajib diisi dengan benar";
      }

      const isCkdWithoutDm = data.penyakit?.includes("ckd") && !data.penyakit?.includes("dm");
      const isStrokeOnly =
        data.penyakit?.length === 1 &&
        data.penyakit?.includes("stroke");
      const skipAktivitasStress =
        isCkdWithoutDm ||
        isStrokeOnly;

      if (
        !skipAktivitasStress &&
        !data.aktivitasFisik
      ) {
        errors.aktivitasFisik =
          "Aktivitas fisik wajib dipilih";
      }

      if (
        !skipAktivitasStress &&
        !data.faktorStress
      ) {
        errors.faktorStress =
          "Faktor stress wajib dipilih";
      }

      if (
        data.penyakit?.includes(
          "ckd"
        ) &&
        data.hemodialisa === ""
      ) {
        errors.hemodialisa =
          "Status hemodialisa wajib dipilih untuk pasien CKD";
      }

      if (
        data.isEstimasi &&
        !data.lila
      ) {
        errors.lila =
          "LILA wajib diisi untuk estimasi";
      }

      if (
        data.isEstimasi &&
        !data.ulna
      ) {
        errors.ulna =
          "ULNA wajib diisi untuk estimasi";
      }

      return errors;

    }, [data]);

  const hasValidationErrors =
    Object.keys(
      validationErrors
    ).length > 0;

  useEffect(() => {
    if (data.jenisKelamin === "L" && data.penambahanKalori?.length) {
      setData((current) => ({
        ...current,
        penambahanKalori: [],
      }));
    }
  }, [data.jenisKelamin, data.penambahanKalori]);

  useEffect(() => {
    const isCkdWithoutDm = data.penyakit?.includes("ckd") && !data.penyakit?.includes("dm");
    const isStrokeOnly =
      data.penyakit?.length === 1 &&
      data.penyakit?.includes("stroke");

    if (isCkdWithoutDm) {
      if (data.aktivitasFisik || data.faktorStress || data.penambahanKalori?.length) {
        setData((current) => ({
          ...current,
          aktivitasFisik: "",
          faktorStress: "",
          penambahanKalori: [],
        }));
      }
      return;
    }

    if (isStrokeOnly && (data.aktivitasFisik || data.faktorStress)) {
      setData((current) => ({
        ...current,
        aktivitasFisik: "",
        faktorStress: "",
      }));
    }
  }, [data.penyakit, data.aktivitasFisik, data.faktorStress, data.penambahanKalori]);

  // Reset aktivitas & faktor stress saat tipe penyakit berubah (DM ↔ non-DM)
  const prevDiseaseTypeRef = useRef(null);

  useEffect(() => {
    const isDM = data.penyakit?.includes("dm");
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

  useEffect(() => {

  if (!data.isEstimasi) return;

  const lilaVal =
    parseFloat(data.lila);

  const ulnaVal =
    parseFloat(data.ulna);

  const jk =
    data.jenisKelamin;

  let tbEst = "";
  let bbEst = "";
  let persenLilaVal = "";

  // TB ESTIMASI ULNA

  if (
    !isNaN(ulnaVal) &&
    ulnaVal > 0
  ) {

    if (jk === "L") {

      tbEst =
        parseFloat(
          (
            97.252 +
            (2.645 * ulnaVal)
          ).toFixed(2)
        );

    } else {

      tbEst =
        parseFloat(
          (
            68.777 +
            (3.536 * ulnaVal)
          ).toFixed(2)
        );
    }
  }

  
  // PERSEN LILA
 
  if (
    !isNaN(lilaVal) &&
    lilaVal > 0
  ) {

    const standarLila =
      jk === "L"
        ? 29
        : 28.5;

    persenLilaVal =
      parseFloat(
        (
          (lilaVal / standarLila) *
          100
        ).toFixed(2)
      );
  }

  // BB ESTIMASI LILA
  // STANDAR RSUD

  if (
    tbEst &&
    lilaVal
  ) {
    if (jk === "L") {
      bbEst =
        (lilaVal / 29) *
        (tbEst - 100);
    } else {
      bbEst =
        (lilaVal / 28.5) *
        (tbEst - 100);
    }
    bbEst =
      parseFloat(
        bbEst.toFixed(2)
      );
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

      tbEstimasi:
        tbEst,
        
      bbEstimasi:
        bbEst,

      persenLila:
        persenLilaVal,

      tb:
        tbEst,

      bb:
        bbEst,
    };
  });

}, [
  data.isEstimasi,
  data.lila,
  data.ulna,
  data.jenisKelamin,
]);

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

  const mapAktivitasFisikToBackend = (aktivitas, isDM) => {
    if (!aktivitas) return null;

    if (isDM) {
      const dmMap = {
        "Istirahat": "Bed rest",
        "Ringan": "Ringan",
        "Sedang": "Sedang",
        "Berat": "Berat",
        "Sangat berat": "Sangat Berat",
      };
      return dmMap[aktivitas] || aktivitas;
    }

    // Non-DM (CHF, Stroke, Lambung, dll)
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
    if (!stress) return null;

    if (isDM) {
      // DM: Frontend mengirim "Ringan", "Sedang", "Berat" — sesuai backend
      return stress;
    }

    // Non-DM (CHF, Stroke, Lambung, dll): Frontend mengirim "Stress Ringan", dll.
    const nonDmMap = {
      "Tidak ada stress": "Tidak Ada",
      "Stress Ringan": "Ringan",
      "Stress Ringan Sepsis": "Ringan Sepsis",
      "Stress Berat": "Berat",
      "Stress Sangat Berat": "Sangat Berat",
    };
    return nonDmMap[stress] || stress;
  };

  const executeContinue = async () => {
    setShowConfirm(false);
    try {
      console.log("PATIENT:", patient);

      const isDM = data.penyakit?.includes("dm");
      const isStrokeOnly =
        data.penyakit?.length === 1 &&
        data.penyakit?.includes("stroke");
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
            return item;
          }) || [],
        jenis_kelamin: data.jenisKelamin,
        umur: Number(data.umur),
        is_estimasi: data.isEstimasi,
        lila_cm: data.lila ? Number(data.lila) : null,
        ulna_cm: data.ulna ? Number(data.ulna) : null,
        persen_lila: data.isEstimasi && data.persenLila ? Number(data.persenLila) : null,
        berat_badan: Number(data.bb),
        tinggi_badan: Number(data.tb),
        aktivitas_fisik: mappedAktivitas,
        faktor_stres: mappedStress,
        kategori_penambahan_energi:
          data.penambahanKalori?.length
            ? data.penambahanKalori.join(", ")
            : "Tidak ada",
        status_hemodialisa: data.hemodialisa || "Tidak",
        metode_perhitungan: "Mifflin St Jeor",
      };

      console.log("PAYLOAD PREVIEW:", payload);
      const hasil = await previewPerhitungan(payload);
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

        <AssessmentHeader
          onBack={
            handleBack
          }
        />

        <AssessmentStep />

        <AssessmentFormSections
          data={data}
          setData={setData}
          errors={validationErrors}
          showErrors={
            submitAttempted
          }
        />

      </div>

      <AssessmentActions
        onBack={handleBack}
        onContinue={
          handleContinue
        }
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
