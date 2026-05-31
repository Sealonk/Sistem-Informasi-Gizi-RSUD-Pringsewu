import AktivitasFisik from "./AktivitasFisik";
import Antropometri from "./Antropometri";
import FaktorStress from "./FaktorStress";
import Hemodialisa from "./Hemodialisa";
import IdentitasPasien from "./IdentitasPasien";
import JenisPenyakit from "./JenisPenyakit";
import MetodePerhitungan from "./MetodePerhitungan";
import PenambahanKalori from "./PenambahanKalori";

export default function AssessmentFormSections({
  data,
  setData,
  errors,
  showErrors,
}) {
  const isCkdWithoutDm = data.penyakit?.includes("ckd") && !data.penyakit?.includes("dm");
  const isStrokeOnly =
    data.penyakit?.length === 1 &&
    data.penyakit?.includes("stroke");
  const disableAktivitasStress =
    isCkdWithoutDm ||
    isStrokeOnly;

  return (
    <div className="space-y-8">
      <IdentitasPasien
        data={data}
        setData={setData}
        errors={errors}
        showErrors={showErrors}
      />

      <Antropometri
        data={data}
        setData={setData}
        errors={errors}
        showErrors={showErrors}
      />

      <JenisPenyakit
        data={data}
        setData={setData}
      />

      {data.penyakit?.includes("ckd") && (
        <Hemodialisa
          data={data}
          setData={setData}
          errors={errors}
          showErrors={showErrors}
        />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AktivitasFisik
          data={data}
          setData={setData}
          errors={errors}
          showErrors={showErrors}
          disabled={disableAktivitasStress}
        />

        <FaktorStress
          data={data}
          setData={setData}
          errors={errors}
          showErrors={showErrors}
          disabled={disableAktivitasStress}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PenambahanKalori
          data={data}
          setData={setData}
          disabled={isCkdWithoutDm}
        />

        <MetodePerhitungan
          data={data}
          setData={setData}
          errors={errors}
          showErrors={showErrors}
        />
      </div>
    </div>
  );
}
