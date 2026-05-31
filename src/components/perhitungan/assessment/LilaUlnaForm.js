import InputField from "../../common/InputField";

export default function LilaUlnaForm({
  data,
  setData,
  errors = {},
  showErrors = false,
}) {

  /* HITUNG PERSEN LILA */
  const persenLila = Number(
    data.persenLila || 0
  );

  const getStatusLila = () => {

    if (!persenLila) return "-";

    if (persenLila < 90)
      return "Kurang";

    if (
      persenLila >= 90 &&
      persenLila <= 110
    )
      return "Normal";

    return "Lebih";
  };

  return (

    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      "
    >

      {/* LILA */}
      <InputField
        label="LILA"
        type="number"
        placeholder="Masukkan LILA"
        suffix="cm"
        value={data.lila}
        onChange={(value) =>
          setData({
            ...data,
            lila: value,
          })
        }
        error={showErrors ? errors.lila : ""}
      />

      {/* ULNA */}
      <InputField
        label="ULNA"
        type="number"
        placeholder="Masukkan ULNA"
        suffix="cm"
        value={data.ulna}
        onChange={(value) =>
          setData({
            ...data,
            ulna: value,
          })
        }
        error={showErrors ? errors.ulna : ""}
      />

      {/* BB ESTIMASI */}
      <InputField
        label="BB Estimasi"
        type="number"
        placeholder="Estimasi berat badan"
        suffix="kg"
        value={data.bbEstimasi}
        readOnly
      />

      {/* TB ESTIMASI */}
      <InputField
        label="TB Estimasi"
        type="number"
        placeholder="Estimasi tinggi badan"
        suffix="cm"
        value={data.tbEstimasi}
        readOnly
      />

      {/* PERSEN LILA */}
      <InputField
        label="Persen LILA"
        type="number"
        placeholder="Masukkan persen LILA"
        suffix="%"
        value={data.persenLila}
        readOnly
      />

      {/* STATUS GIZI */}
      <InputField
        label="Status Gizi"
        value={getStatusLila()}
        readOnly
      />

    </div>
  );
}
