import Step2 from "../../components/Perhitungan/Step2";

export default function PerhitunganPage() {
  const dataDummy = {
    bb: 70,
    tb: 180,
    umur: 25,
    jk: "L",
    aktivitas: "ringan",
    stress: "ringan",
    penyakit: ["DM"],
  };

  return <Step2 dataPasien={dataDummy} />;
}