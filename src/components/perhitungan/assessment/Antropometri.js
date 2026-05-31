import { Ruler } from "lucide-react";

import SectionCard from "../../common/SectionCard";
import InputField from "../../common/InputField";

import EstimasiToggle from "./EstimasiToggle";
import LilaUlnaForm from "./LilaUlnaForm";

export default function Antropometri({
  data,
  setData,
  errors = {},
  showErrors = false,
}) {

  const bb =
  parseFloat(data.bb || 0);

const tinggiCm =
  parseFloat(data.tb || 0);

const tinggiM =
  tinggiCm / 100;

let imt = "";
let statusGizi = "";
let bbi = "";

if (bb && tinggiCm) {

  // =========================
  // IMT
  // =========================
  const nilaiIMT =
    bb / Math.pow(tinggiM, 2);

  imt =
    parseFloat(
      nilaiIMT.toFixed(2)
    );

  // =========================
  // STATUS GIZI
  // =========================
  if (nilaiIMT < 17) {

    statusGizi =
      "KEKURANGAN BB TINGKAT BERAT";

  } else if (nilaiIMT < 18.5) {

    statusGizi =
      "KEKURANGAN BB TINGKAT RINGAN";

  } else if (nilaiIMT <= 25) {

    statusGizi =
      "NORMAL";

  } else if (nilaiIMT <= 27) {

    statusGizi =
      "KELEBIHAN BB TINGKAT RINGAN";

  } else {

    statusGizi =
      "KELEBIHAN BB TINGKAT BERAT";
  }

  // =========================
  // BBI (BROCA RSUD)
  // =========================
  if (data.jenisKelamin === "L") {

    bbi =
      tinggiCm >= 160
        ? 0.9 * (tinggiCm - 100)
        : (tinggiCm - 100);

  } else {

    bbi =
      tinggiCm >= 150
        ? 0.9 * (tinggiCm - 100)
        : (tinggiCm - 100);
  }

  bbi =
    parseFloat(
      bbi.toFixed(2)
    );
}
  return (

    <SectionCard
      title="Antropometri"
      subtitle="Data antropometri digunakan untuk menentukan status gizi dan kebutuhan energi pasien"
      icon={<Ruler size={26} />}
    >

      {/* GRID */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
          mb-8
        "
      >

        {/* BB */}
        <InputField
          label="Berat Badan"
          type="number"
          placeholder="Masukkan BB"
          suffix="kg"
          value={data.bb}
          onChange={(value) =>
            setData({
              ...data,
              bb: value,
              originalBb: value,
            })
          }
          readOnly={data.isEstimasi}
          error={showErrors ? errors.bb : ""}
        />

        {/* TB */}
        <InputField
          label="Tinggi Badan"
          type="number"
          placeholder="Masukkan TB"
          suffix="cm"
          value={data.tb}
          onChange={(value) =>
            setData({
              ...data,
              tb: value,
              originalTb: value,
            })
          }
          readOnly={data.isEstimasi}
          error={showErrors ? errors.tb : ""}
        />

       {/* IMT */}
<InputField
  label="IMT"
  value={imt}
  readOnly
/>

{/* STATUS GIZI */}
<InputField
  label="Status Gizi"
  value={statusGizi}
  readOnly
/>

{/* BBI */}
<InputField
  label="BBI"
  value={bbi}
  suffix="kg"
  readOnly
/>

      </div>

      {/* TOGGLE */}
      <div className="mb-8">

        <EstimasiToggle
          checked={data.isEstimasi}
          onChange={(value) => {
            if (!value) {
              setData({
                ...data,
                isEstimasi: value,
                bb: data.originalBb || "",
                tb: data.originalTb || "",
                bbEstimasi: "",
                tbEstimasi: "",
                persenLila: "",
              });
            } else {
              setData({
                ...data,
                isEstimasi: value,
                originalBb: data.bb,
                originalTb: data.tb,
              });
            }
          }}
        />

      </div>

      {/* CONDITIONAL */}
      {data.isEstimasi && (

        <LilaUlnaForm
          data={data}
          setData={setData}
          errors={errors}
          showErrors={showErrors}
        />

      )}

    </SectionCard>
  );
}
