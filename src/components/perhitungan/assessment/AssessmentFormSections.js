import AktivitasFisik from "./AktivitasFisik";
import Antropometri from "./Antropometri";
import FaktorStress from "./FaktorStress";
import Hemodialisa from "./Hemodialisa";
import IdentitasPasien from "./IdentitasPasien";
import JenisPenyakit, { getDiseaseValues } from "./JenisPenyakit";
import MetodePerhitungan from "./PersentaseMakro";
import PenambahanKalori from "./PenambahanKalori";

export default function AssessmentFormSections({
  data,
  setData,
  errors,
  showErrors,
}) {
  const penyakitOnly = getDiseaseValues(data.penyakit);
  const isCkdWithoutDm = penyakitOnly.includes("ckd") && !penyakitOnly.includes("dm");
  const isStrokeOnly =
    penyakitOnly.length === 1 &&
    penyakitOnly.includes("stroke");
  const isCriticalIll = data.penyakit?.includes("critical_ill");
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
          disabled={disableAktivitasStress || isCriticalIll}
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
          disabled={isCkdWithoutDm || isCriticalIll}
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
