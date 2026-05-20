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

  /* HITUNG IMT */
  const bb = parseFloat(
    data.bb || 0
  );

  const tb =
    parseFloat(data.tb || 0) / 100;

  const imt =
    bb && tb
      ? (bb / (tb * tb)).toFixed(1)
      : "";

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
            })
          }
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
            })
          }
        />

        {/* IMT */}
        <InputField
          label="IMT"
          value={imt}
          readOnly
        />

      </div>

      {/* TOGGLE */}
      <div className="mb-8">

        <EstimasiToggle
          checked={data.isEstimasi}
          onChange={(value) =>
            setData({
              ...data,
              isEstimasi: value,
            })
          }
        />

      </div>

      {/* CONDITIONAL */}
      {data.isEstimasi && (

        <LilaUlnaForm
          data={data}
          setData={setData}
        />

      )}

    </SectionCard>
  );
}