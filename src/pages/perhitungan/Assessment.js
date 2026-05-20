import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,

} from "lucide-react";

/* COMPONENT */
import IdentitasPasien from "../../components/perhitungan/assessment/IdentitasPasien";
import Antropometri from "../../components/perhitungan/assessment/Antropometri";
import AktivitasFisik from "../../components/perhitungan/assessment/AktivitasFisik";
import JenisPenyakit from "../../components/perhitungan/assessment/JenisPenyakit";
import FaktorStress from "../../components/perhitungan/assessment/FaktorStress";
import Hemodialisa from "../../components/perhitungan/assessment/Hemodialisa";
import PenambahanKalori from "../../components/perhitungan/assessment/PenambahanKalori";
import MetodePerhitungan from "../../components/perhitungan/assessment/MetodePerhtungan";
export default function Assessment() {

  const navigate = useNavigate();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [data, setData] = useState({
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
    kaloriLainnya: "",
  });

  const validationErrors = useMemo(() => {
    const errors = [];
    
    if (!data.nama?.trim()) errors.push("Nama pasien wajib diisi");
    if (!data.noRM?.trim()) errors.push("No RM wajib diisi");
    if (!data.umur || data.umur <= 0) errors.push("Umur wajib diisi dengan benar");
    if (!data.bb || data.bb <= 0) errors.push("Berat badan wajib diisi dengan benar");
    if (!data.tb || data.tb <= 0) errors.push("Tinggi badan wajib diisi dengan benar");
    if (!data.aktivitasFisik) errors.push("Aktivitas fisik wajib dipilih");
    if (!data.faktorStress) errors.push("Faktor stress wajib dipilih");
    if (!data.metodePerhitungan) errors.push("Metode perhitungan wajib dipilih");
    if (data.penyakit?.includes("ckd") && !data.hemodialisa) errors.push("Status hemodialisa wajib dipilih untuk pasien CKD");
    if (data.isEstimasi && !data.lila) errors.push("LILA wajib diisi untuk estimasi");
    if (data.isEstimasi && !data.ulna) errors.push("ULNA wajib diisi untuk estimasi");
    if (data.penambahanKalori?.includes("lainnya") && !data.kaloriLainnya?.trim()) errors.push("Jenis kalori lainnya wajib diisi");
    
    return errors;
  }, [data]);

  const isFormValid = validationErrors.length === 0;

  const handleContinue = () => {
    setSubmitAttempted(true);
    if (isFormValid) {
      navigate("/hasil");
    }
  };

  return (

    <div
      className=" min-h-screen, bg-[#f8fbff], relative
        overflow-hidden "
    >

      <div
        className="
          absolute
          -top-32
          -left-32
          w-[350px]
          h-[350px]
          bg-blue-200/30
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-32
          -right-32
          w-[350px]
          h-[350px]
          bg-sky-100/30
          rounded-full
          blur-3xl
        "
      />

      {/* CONTAINER */}
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

        {/* HEADER */}
        <div className="mb-10">

          {/* BACK */}
          <button
            onClick={() =>
              navigate("/perhitungan")
            }
            className="
              flex
              items-center
              gap-2
              text-slate-500
              text-sm
              mb-6
              hover:text-blue-600
              transition-all
            "
          >

            <ArrowLeft size={18} />
            Kembali ke Pilih Pasien
          </button>

          {/* TITLE */}
          <h1
            className="
              text-4xl
              font-bold
              text-slate-900
              tracking-tight
              mb-3
            "
          >
            Assessment Gizi
          </h1>

          {/* SUBTITLE */}
          <p
            className="
              text-slate-500
              text-base
            "
          >
            Lengkapi data pasien untuk
            melakukan perhitungan kebutuhan gizi
          </p>

        </div>

        {/* STEP */}
        <div
          className="
            bg-white/80
            backdrop-blur-md
            rounded-[28px]
            border
            border-blue-100
            shadow-soft
            p-7
            mb-8
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-5
              flex-wrap
            "
          >

            {/* Untuk STEP 1 */}
            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  shadow-blue-100
                "
              >

                <CheckCircle2 size={24} />

              </div>

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mb-1
                  "
                >
                  Step 1
                </p>

                <h3
                  className="
                    text-lg
                    font-semibold
                    text-slate-900
                  "
                >
                  Assessment Pasien
                </h3>

              </div>

            </div>

            {/* STEP 2 */}
            <div
              className="
                flex
                items-center
                gap-4
                opacity-60
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-slate-100
                  text-slate-500
                  flex
                  items-center
                  justify-center
                "
              >

                <ChevronRight size={24} />

              </div>

              <div>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mb-1
                  "
                >
                  Step 2
                </p>

                <h3
                  className="
                    text-lg
                    font-semibold
                    text-slate-700
                  "
                >
                  Hasil Perhitungan
                </h3>

              </div>

            </div>

          </div>

        </div>

        {/* SECTION */}
        <div className="space-y-8">
          <IdentitasPasien
            data={data}
            setData={setData}
            errors={validationErrors}
            showErrors={submitAttempted}
          />

          <Antropometri
            data={data}
            setData={setData}
            errors={validationErrors}
            showErrors={submitAttempted}
          />

          <JenisPenyakit
            data={data}
            setData={setData}
          />

          {data.penyakit?.includes("ckd") && (
            <Hemodialisa
              data={data}
              setData={setData}
            />
          )}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <AktivitasFisik
              data={data}
              setData={setData}
              errors={validationErrors}
              showErrors={submitAttempted}
            />

            <FaktorStress
              data={data}
              setData={setData}
              errors={validationErrors}
              showErrors={submitAttempted}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PenambahanKalori
              data={data}
              setData={setData}
            />

            <MetodePerhitungan
              data={data}
              setData={setData}
              errors={validationErrors}
              showErrors={submitAttempted}
            />
          </div>
        </div>

      </div>
      
      {submitAttempted && !isFormValid && (
        <div className="mt-8 max-w-7xl mx-auto">
          <div className="bg-rose-50 border border-rose-200 rounded-[12px] p-4 mb-4">
            <p className="text-rose-800 text-sm font-medium mb-2">⚠ Silakan lengkapi field yang wajib diisi:</p>
            <ul className="text-rose-700 text-sm space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx}>• {error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-[12px] border border-blue-100 p-4 shadow-soft">
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => navigate("/perhitungan")}
                className="h-14 px-7 rounded-2xl border border-blue-100 bg-white text-slate-700 font-medium hover:bg-blue-50 transition-all"
              >
                Kembali
              </button>

              <button
                onClick={handleContinue}
                disabled={false}
                className="h-14 px-8 rounded-2xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                Simpan & Lanjut
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}