import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  Clock3,
  Eye,
  FileText,
  Info,
  Loader2,
  Trash2,
  UserCircle2,
} from "lucide-react";

import {
  deleteRiwayat,
  getRiwayatDetail,
  getRiwayatVersions,
} from "../../services/riwayat/riwayatApi";
import { previewPerhitungan } from "../../services/perhitungan/previewPerhitunganApi";
import { getFilteredDiseaseCodes } from "../../hooks/assessmentHelpers";
import { getUser } from "../../services/auth/authService";
import { getEnergiTotal } from "../../utils/makronutrien";

import ConfirmationModal from "../common/ConfirmationModal";
import HasilHeader from "../perhitungan/Hasil/HasilHeader";
import SummaryCard from "../perhitungan/Hasil/SummaryCard";
import MakroChart from "../perhitungan/Hasil/MakroChart";
import FaktorPerhitungan from "../perhitungan/Hasil/FaktorPerhitungan";
import StatusGizi from "../perhitungan/Hasil/StatusGizi";
import PortalBackground from "../portal/PortalBackground";

import {
  formatDate,
  formatTime,
  splitDateTime,
  numberWithUnit,
  formatMacroWithDecimal,
} from "../../utils/riwayatDateUtils";

const getCalculationDate = (item) => (
  item?.tanggal_perhitungan ||
  item?.created_at ||
  item?.updated_at ||
  item?.tanggal
);

const getCalculationId = (item) => (
  item?.id_perhitungan ||
  item?.id_riwayat ||
  item?.id
);

const normalizeGender = (gender) => {
  if (!gender) return "-";
  return String(gender).toUpperCase().startsWith("L") ? "Laki-laki" : "Perempuan";
};

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

function CalculationDetailView({ calculationId }) {
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
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

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRiwayatDetail(calculationId);
        if (response.status === "success") {
          setDetailData(response.data);
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

    if (calculationId) {
      fetchDetail();
    }
  }, [calculationId]);

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

  const formattedTanggal = formatDate(detailData.tanggal_perhitungan);
  const keys = getSelectedKeys(detailData.diagnosa_penyakit_saat_dihitung);
  const displayDiagnosis = getFilteredDiseaseCodes(keys, detailData.kode_penyakit);

  const headerData = {
    nama: detailData.nama_pasien,
    noRM: detailData.no_rm,
    umur: detailData.umur_saat_dihitung ? Math.round(detailData.umur_saat_dihitung) : "-",
    jenisKelamin: normalizeGender(detailData.jenis_kelamin),
    tanggal: formattedTanggal,
    ruangan: detailData.ruang_bangsal || "-",
    diagnosis: displayDiagnosis,
    tanggal_masuk: detailData.tanggal_masuk || "-",
  };

  const hasilData = {
    energi: detailData.kebutuhan_energi_total || 0,
    protein: detailData.protein_gram || 0,
    lemak: detailData.lemak_gram || 0,
    karbohidrat: detailData.karbohidrat_gram || 0,
  };

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
    status_hemodialisa: detailData.status_hemodialisa,
  };

  const statusGiziData = {
    bb: detailData.berat_badan_saat_dihitung,
    tb: detailData.tinggi_badan_saat_dihitung,
    imt_nilai: detailData.imt_saat_dihitung,
    imt_status: detailData.status_gizi_saat_dihitung,
  };

  const handleExportPDF = () => {
    const originalTitle = document.title;
    const patientName = detailData?.nama_pasien ? String(detailData.nama_pasien).replace(/\s+/g, "_") : "Pasien";
    const noRm = detailData?.no_rm || "";
    document.title = `Detail_Riwayat_Gizi_${patientName}${noRm ? `_${noRm}` : ""}`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] px-4 py-6 sm:px-6 sm:py-8 relative overflow-hidden">
      <PortalBackground />

      <div className="max-w-7xl mx-auto space-y-6 print-compact-space relative z-10">
        {/* KOP CETAK HANYA DILAMPIRKAN SAAT EXPORT PDF */}
        <div className="hidden print:block mb-4 border-b-2 border-slate-800 pb-3 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">RSUD PRINGSEWU</h1>
          <h2 className="text-sm font-semibold text-slate-700">Laporan Detail Riwayat Perhitungan Gizi Pasien</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sistem Informasi Gizi - RSUD Pringsewu</p>
        </div>

        <div className="max-w-5xl mx-auto w-full space-y-6 print-compact-space">
          <HasilHeader data={headerData} />
          <StatusGizi data={statusGiziData} />
        </div>

        <SummaryCard hasil={hasilData} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 print-grid-cols-2 print-break-before-page">
          <MakroChart
            hasil={previewData?.perhitungan?.hasil || detailData}
            persen={previewData?.perhitungan?.persen}
          />
          <FaktorPerhitungan data={faktorData} />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 no-print">
          <button
            type="button"
            onClick={handleExportPDF}
            className="h-12 px-6 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <FileText size={18} />
            Export PDF
          </button>

          <button
            type="button"
            onClick={() => navigate(`/riwayat/${calculationId}`)}
            className="h-12 px-6 rounded-2xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-all"
          >
            Kembali ke Versi Riwayat
          </button>

          <button
            type="button"
            onClick={() => navigate("/riwayat")}
            className="h-12 px-6 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
          >
            Kembali ke Daftar Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}

function VersionHistoryView({ id }) {
  const navigate = useNavigate();
  const user = getUser();
  const isAdmin = user?.role === "admin";
  const [patient, setPatient] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadVersions = async () => {
    setLoading(true);
    setError(null);

    try {
      const detailResponse = await getRiwayatDetail(id);
      if (detailResponse.status !== "success") {
        setError(detailResponse.message || "Gagal memuat detail riwayat");
        return;
      }

      const currentDetail = detailResponse.data;

      const versionsResponse = await getRiwayatVersions(id);
      if (versionsResponse.status !== "success") {
        setError(versionsResponse.message || "Gagal memuat versi riwayat");
        return;
      }

      const rawVersions = versionsResponse.data.versi_riwayat || [];
      const versionsWithDetail = await Promise.all(
        rawVersions.map(async (v) => {
          try {
            const vDetailResponse = await getRiwayatDetail(v.id_perhitungan);
            if (vDetailResponse.status === "success") {
              return {
                ...v,
                ...vDetailResponse.data,
              };
            }
          } catch (e) {
            console.error("Gagal memuat detail versi:", v.id_perhitungan, e);
          }
          return v;
        })
      );

      setPatient(currentDetail);
      setVersions(versionsWithDetail);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat versi riwayat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadVersions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const latestId = getCalculationId(versions[0]);

  const totalCount = useMemo(() => versions.length, [versions.length]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    try {
      const response = await deleteRiwayat(deleteId);
      if (response.status === "success") {
        setDeleteId(null);
        if (String(deleteId) === String(id) && versions.length <= 1) {
          navigate("/riwayat");
          return;
        }
        await loadVersions();
      } else {
        alert(response.message || "Gagal menghapus riwayat");
      }
    } catch (err) {
      alert(err.message || "Terjadi kesalahan saat menghapus riwayat");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 size={38} className="text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Memuat versi riwayat perhitungan...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle size={30} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Terjadi Kesalahan</h2>
        <p className="text-slate-500 max-w-md mb-6">{error || "Data versi riwayat tidak ditemukan."}</p>
        <button
          onClick={() => navigate("/riwayat")}
          className="h-11 px-5 bg-blue-600 text-white rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md"
        >
          Kembali ke Daftar Riwayat
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] px-4 py-6 sm:px-6 sm:py-8 relative overflow-hidden">
      <PortalBackground />

      <div className="max-w-7xl mx-auto relative z-10 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-500 mb-2">
              Riwayat Perhitungan <span className="text-slate-300">/</span>{" "}
              <span className="text-slate-800">Detail Riwayat Perhitungan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Detail Riwayat Perhitungan
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Berikut adalah riwayat seluruh perhitungan yang pernah dilakukan untuk pasien.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-600" />
              {formatDate(new Date())}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 size={16} className="text-blue-600" />
              {formatTime(new Date())} WIB
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 border border-slate-200 shadow-sm">
              <UserCircle2 size={20} className="text-blue-600" />
              {user?.nama_lengkap || user?.nama || user?.username || "Petugas Gizi"}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/riwayat")}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Riwayat
          </button>
        </div>

        <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-5 sm:p-6 shadow-sm backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr_1fr] gap-5 lg:divide-x lg:divide-slate-100">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <UserCircle2 size={34} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900 truncate">
                    {patient.nama_pasien || "-"}
                  </h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-blue-700 border border-blue-100">
                    {normalizeGender(patient.jenis_kelamin)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-slate-500">
                  <span>{patient.umur_saat_dihitung ? `${Math.round(patient.umur_saat_dihitung)} Tahun` : "-"}</span>
                  <span>{numberWithUnit(patient.tinggi_badan_saat_dihitung, "cm")}</span>
                  <span>{numberWithUnit(patient.berat_badan_saat_dihitung, "kg")}</span>
                </div>
                <div className="mt-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-[11px] font-extrabold text-amber-700 border border-amber-100">
                  {patient.kode_penyakit || patient.diagnosa_penyakit_saat_dihitung || "-"}
                </div>
              </div>
            </div>

            <div className="lg:pl-6 space-y-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase text-slate-400">Nomor Rekam Medis</p>
                <p className="text-sm font-extrabold text-slate-900 mt-1">{patient.no_rm || "-"}</p>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase text-slate-400">Tanggal Lahir</p>
                <p className="text-sm font-extrabold text-slate-900 mt-1">{formatDate(patient.tanggal_lahir)}</p>
              </div>
            </div>

            <div className="lg:pl-6 space-y-4">
              <div>
                <p className="text-[11px] font-extrabold uppercase text-slate-400">Status Gizi Terakhir</p>
                <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700 border border-emerald-100">
                  {patient.status_gizi_saat_dihitung || "-"}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase text-slate-400">BB Ideal (BBI)</p>
                <p className="text-sm font-extrabold text-slate-900 mt-1">{numberWithUnit(patient.berat_badan_ideal, "kg")}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-4 sm:p-6 shadow-sm backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Riwayat Perhitungan Pasien</h2>
              <p className="text-sm text-slate-500 mt-1">
                Menampilkan seluruh versi perhitungan kebutuhan gizi yang pernah dibuat untuk pasien ini.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 px-5 py-3 text-center min-w-[150px]">
              <p className="text-xs font-extrabold text-blue-600">Total Perhitungan</p>
              <p className="text-2xl font-extrabold text-blue-700 leading-tight">{totalCount}</p>
              <p className="text-xs font-bold text-blue-500">kali</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[980px] border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Versi</th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Tanggal & Waktu</th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Metode Perhitungan</th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Kondisi Khusus</th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Energi (kkal)</th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Protein (g)</th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Lemak (g)</th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Karbohidrat (g)</th>
                  <th className="px-5 py-4 text-left text-[11px] font-extrabold uppercase text-slate-400">Petugas</th>
                  <th className="px-5 py-4 text-center text-[11px] font-extrabold uppercase text-slate-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {versions.map((item, index) => {
                  const itemId = getCalculationId(item);
                  const canDelete = item.is_mine || isAdmin;
                  const versionNumber = versions.length - index;
                  const itemDate = getCalculationDate(item);

                  return (
                    <tr key={itemId || index} className="hover:bg-blue-50/25 transition-all">
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-extrabold text-slate-800">V.{item.versi || versionNumber}</span>
                          {String(itemId) === String(latestId) && (
                            <span className="w-fit rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-100">
                              Terbaru
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-extrabold text-slate-800">{splitDateTime(itemDate).date}</p>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">{splitDateTime(itemDate).time} WIB</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-extrabold text-slate-800">{item.metode_perhitungan || "-"}</td>
                      <td className="px-5 py-4 text-sm font-extrabold text-slate-800">
                        {item.kode_penyakit || item.diagnosa_penyakit_saat_dihitung || item.penyakit || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm font-extrabold text-slate-800">
                        {getEnergiTotal(item)?.toLocaleString("id-ID") || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm font-extrabold text-slate-800">{formatMacroWithDecimal(item, "protein")}</td>
                      <td className="px-5 py-4 text-sm font-extrabold text-slate-800">{formatMacroWithDecimal(item, "lemak")}</td>
                      <td className="px-5 py-4 text-sm font-extrabold text-slate-800">{formatMacroWithDecimal(item, "karbohidrat")}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-extrabold text-slate-800">{item.created_by || "System"}</p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">Ahli Gizi</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/riwayat/${id}/detail/${itemId}`)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-blue-50 px-3 text-[11px] font-extrabold text-blue-700 transition-all hover:bg-blue-600 hover:text-white"
                            title="Lihat Detail"
                          >
                            <Eye size={14} />
                            Lihat Detail
                          </button>
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => setDeleteId(itemId)}
                              className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-red-50 px-3 text-[11px] font-extrabold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                              title="Hapus Riwayat"
                            >
                              <Trash2 size={14} />
                              Hapus Riwayat
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs font-bold text-blue-700">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>
              Versi terbaru ditandai dengan label "Terbaru". Anda dapat melihat detail setiap versi perhitungan atau menghapus versi yang tidak diperlukan.
            </p>
          </div>
        </section>
      </div>

      <ConfirmationModal
        isOpen={Boolean(deleteId)}
        title="Hapus Riwayat"
        message="Apakah Anda yakin ingin menghapus riwayat perhitungan ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleteLoading) setDeleteId(null);
        }}
        confirmText={deleteLoading ? "Menghapus..." : "Ya, Hapus"}
        cancelText="Batal"
        confirmColor="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-rose-200/50"
        iconBg="bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-rose-200/50"
        icon={<Trash2 size={24} />}
      />
    </div>
  );
}

export default function DetailRiwayat() {
  const { id, detailId } = useParams();

  if (detailId) {
    return <CalculationDetailView calculationId={detailId} />;
  }

  return <VersionHistoryView id={id} />;
}
