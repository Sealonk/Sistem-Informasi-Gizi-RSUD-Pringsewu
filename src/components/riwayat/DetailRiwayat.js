import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { getRiwayatDetail } from "../../services/PasienServices/riwayatApi";
import { previewPerhitungan } from "../../services/PasienServices/previewPerhitunganApi";
import { getFilteredDiseaseCodes } from "../../hooks/useAssessmentLogic";

import HasilHeader from "../../components/perhitungan/Hasil/HasilHeader";
import SummaryCard from "../../components/perhitungan/Hasil/SummaryCard";
import MakroChart from "../../components/perhitungan/Hasil/MakroChart";
import FaktorPerhitungan from "../../components/perhitungan/Hasil/FaktorPerhitungan";
import StatusGizi from "../../components/perhitungan/Hasil/StatusGizi";
import PortalBackground from "../../components/portal/PortalBackground";

export default function DetailRiwayat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Background calculation data for micronutrients & guidelines
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRiwayatDetail(id);
        if (response.status === "success") {
          setDetailData(response.data);
          // Trigger preview calculation to get micronutrients & guidelines
          fetchPreview(response.data);
        } else {
          setError(response.message || "Gagal memuat detail riwayat");
        }
      } catch (err) {
        setError(err.message || "Terjadi kesalahan saat menghubungi server");
      } finally {
        setLoading(false);
      }
    };

    const fetchPreview = async (detail) => {
      try {
        let penyakitLainnya = "";
        let penyakitString = detail.diagnosa_penyakit_saat_dihitung || "";
        const mifflinMatch = penyakitString.match(/Mifflin \(([^)]+)\)/);
        if (mifflinMatch) {
          penyakitLainnya = mifflinMatch[1];
          penyakitString = penyakitString.replace(/Mifflin \([^)]+\)/, "Mifflin");
        }
        
        const penyakitArray = penyakitString
          ? penyakitString.split(",").map((p) => {
              const val = p.trim();
              if (val.toLowerCase() === "critical ill") return "Critical Ill";
              return val;
            }).filter(Boolean)
          : [];

        const payload = {
          id_pasien: detail.no_rawat,
          umur: detail.umur_saat_dihitung,
          jenis_kelamin: detail.jenis_kelamin,
          berat_badan: detail.berat_badan_saat_dihitung,
          tinggi_badan: detail.tinggi_badan_saat_dihitung,
          is_estimasi: detail.is_estimasi === 1,
          lila_cm: detail.lila_cm,
          ulna_cm: detail.ulna_cm,
          persen_lila: detail.persen_lila,
          diagnosa_penyakit: penyakitArray,
          penyakit_lainnya: penyakitLainnya,
          aktivitas_fisik: detail.aktivitas_fisik,
          status_hemodialisa: detail.status_hemodialisa,
          faktor_stres: detail.faktor_stres,
          kategori_penambahan_energi: detail.kategori_penambahan_energi,
          metode_perhitungan: detail.metode_perhitungan,
          input_persen_protein: detail.protein_persen,
          input_persen_lemak: detail.lemak_persen,
          input_persen_karbo: detail.karbohidrat_persen,
        };

        const response = await previewPerhitungan(payload);
        if (response.status === "success") {
          setPreviewData(response.data);
        }
      } catch (err) {
        console.error("Gagal memuat pratinjau kalkulasi:", err);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 size={38} className="text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Memuat detail riwayat perhitungan...</p>
      </div>
    );
  }

  if (error || !detailData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl font-bold mb-4">
          !
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
        <p className="text-slate-500 max-w-md mb-6">{error || "Data riwayat perhitungan tidak ditemukan."}</p>
        <button
          onClick={() => navigate("/riwayat")}
          className="h-11 px-5 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  const getSelectedKeys = (diagnosaStr) => {
    if (!diagnosaStr) return [];
    const lower = diagnosaStr.toLowerCase();
    const keys = [];
    if (lower.includes("dm") || lower.includes("diabetes")) keys.push("dm");
    if (lower.includes("ckd") || lower.includes("ginjal")) keys.push("ckd");
    if (lower.includes("chf") || lower.includes("jantung")) keys.push("chf");
    if (lower.includes("stroke")) keys.push("stroke");
    if (lower.includes("lambung") || lower.includes("dispepsia")) keys.push("lambung");
    if (lower.includes("critical ill") || lower.includes("critical_ill") || lower.includes("icu")) keys.push("critical_ill");
    if (lower.includes("mifflin")) keys.push("mifflin");
    return keys;
  };

  /* 1. MAPPING UNTUK HASIL HEADER */
  const formattedTanggal = new Date(detailData.tanggal_perhitungan).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const keys = getSelectedKeys(detailData.diagnosa_penyakit_saat_dihitung);
  const displayDiagnosis = getFilteredDiseaseCodes(keys, detailData.kode_penyakit);

  const headerData = {
    nama: detailData.nama_pasien,
    noRM: detailData.no_rm,
    umur: detailData.umur_saat_dihitung ? Math.round(detailData.umur_saat_dihitung) : "-",
    jenisKelamin: detailData.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan",
    tanggal: formattedTanggal,
    ruangan: detailData.ruang_bangsal || "-",
    diagnosis: displayDiagnosis,
    tanggal_masuk: detailData.tanggal_masuk || "-",
  };

  /* 2. MAPPING UNTUK SUMMARY CARD & MAKRO CHART */
  const hasilData = {
    energi: detailData.kebutuhan_energi_total || 0,
    protein: detailData.protein_gram || 0,
    lemak: detailData.lemak_gram || 0,
    karbohidrat: detailData.karbohidrat_gram || 0,
  };

  /* 3. MAPPING UNTUK FAKTOR PERHITUNGAN */
  const penyakitArray = detailData.diagnosa_penyakit_saat_dihitung
    ? detailData.diagnosa_penyakit_saat_dihitung.split(",").map((p) => p.trim())
    : [];

  const faktorData = {
    aktivitasFisik: detailData.aktivitas_fisik,
    faktorStress: detailData.faktor_stres,
    metodePerhitungan: detailData.metode_perhitungan,
    penyakit: penyakitArray,
    bbi: detailData.berat_badan_ideal,
    bmr: detailData.bmr,
    faktorAktivitasNilai: detailData.faktor_aktivitas_nilai,
    faktorStressNilai: detailData.faktor_stres_nilai,
    penambahanKaloriNilai: detailData.penambahan_kalori || 0,
  };

  /* 4. MAPPING UNTUK STATUS GIZI */
  const statusGiziData = {
    bb: detailData.berat_badan_saat_dihitung,
    tb: detailData.tinggi_badan_saat_dihitung,
    imt_nilai: detailData.imt_saat_dihitung,
    imt_status: detailData.status_gizi_saat_dihitung,
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
        {/* HEADER */}
        <HasilHeader data={headerData} />

        {/* STATUS GIZI */}
        <StatusGizi data={statusGiziData} />

        {/* SUMMARY */}
        <SummaryCard hasil={hasilData} />

        {/* Grid row: Combined Nutrition Card and Factors Card side-by-side */}
        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-6
          "
        >
          <MakroChart 
            hasil={previewData?.perhitungan?.hasil || detailData} 
            persen={previewData?.perhitungan?.persen}
          />
          <FaktorPerhitungan data={faktorData} />
        </div>

        {/* ACTION */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/portal")}
            className="
              h-12
              px-6
              rounded-2xl
              border
              border-slate-200
              bg-white
              text-slate-700
              font-semibold
              hover:bg-slate-50
              transition-all
            "
          >
            Kembali ke Portal
          </button>

          <button
            type="button"
            onClick={() => navigate("/riwayat")}
            className="
              h-12
              px-6
              rounded-2xl
              bg-blue-600
              text-white
              font-semibold
              hover:bg-blue-700
              transition-all
            "
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}
