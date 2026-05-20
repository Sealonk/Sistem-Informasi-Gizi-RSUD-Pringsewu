import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import HasilHeader from "../../components/perhitungan/Hasil/HasilHeader";
import SummaryCard from "../../components/perhitungan/Hasil/SummaryCard";
import MakroChart from "../../components/perhitungan/Hasil/MakroChart";
import FaktorPerhitungan from "../../components/perhitungan/Hasil/FaktorPerhitungan";
import StatusGizi from "../../components/perhitungan/Hasil/StatusGizi";
import HasilAction from "../../components/perhitungan/Hasil/HasilAction";

export default function DetailRiwayat() {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const pasien =
    location.state;

  /* DATA */
  const data = {
    nama:
      pasien?.nama || "-",

    bb: 62,
    tb: 168,

    aktivitasFisik:
      "sedang",

    faktorStress:
      "ringan",

    metodePerhitungan:
      "mifflin",

    penyakit: [
      pasien?.penyakit ||
        "-",
    ],
  };

  /* HASIL */
  const hasil = {
    energi:
      pasien?.energi || 0,

    protein: 72,
    lemak: 57,
    karbohidrat: 215,
  };

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        px-6
        py-8
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          space-y-6
        "
      >

        {/* HEADER */}
        <HasilHeader
          data={data}
        />

        {/* SUMMARY */}
        <SummaryCard
          hasil={hasil}
        />

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          "
        >

          {/* CHART */}
          <MakroChart
            hasil={hasil}
          />

          {/* FAKTOR */}
          <FaktorPerhitungan
            data={data}
          />

        </div>

        {/* STATUS */}
        <StatusGizi
          data={data}
        />

        {/* ACTION */}
        <HasilAction
          navigate={navigate}
        />

      </div>

    </div>
  );
}