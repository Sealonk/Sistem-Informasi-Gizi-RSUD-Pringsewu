import { useEffect } from "react";
import { getDetailPasien } from "../services/perhitungan/detailPasienApi";
import { getRiwayatDetail } from "../services/riwayat/riwayatApi";
import {
  mapAktivitasFisikFromBackend,
  mapFaktorStressFromBackend,
} from "./assessmentHelpers";

export default function useAssessmentDataFetch({
  patient,
  isRestored,
  isEditMode,
  idPerhitungan,
  setData,
  prevDiseaseTypeRef,
  isInitializingRef,
}) {
  // Load detail pasien
  useEffect(() => {
    if (isRestored) return;

    async function loadDetailPasien() {
      try {
        const patientId = patient?.id;
        if (!patientId) return;

        const detail = await getDetailPasien(patientId);

        const mappedPenyakit =
          detail?.diagnosa_kategori?.map((item) => {
            const value = item.toLowerCase().trim();

            if (value === "dm") return "dm";
            if (value === "ckd") return "ckd";
            if (value === "chf") return "chf";
            if (value === "stroke") return "stroke";
            if (value === "lambung") return "lambung";
            if (value === "critical ill") return "critical_ill";
            if (value === "mifflin") return "mifflin";

            return value;
          }) || [];

        setData((current) => ({
          ...current,
          bb: detail?.berat_badan || "",
          tb: detail?.tinggi_badan || "",
          originalBb: detail?.berat_badan || "",
          originalTb: detail?.tinggi_badan || "",
          penyakit: mappedPenyakit,
          penyakitLainnya: detail?.penyakit_lainnya || "",
          tanggal_masuk: current.tanggal_masuk || detail?.tanggal_masuk || "",
          diagnosis: detail?.diagnosis || current.diagnosis || "",
          originalDiagnosis: detail?.diagnosis || current.originalDiagnosis || "",
        }));
      } catch (error) {
        console.log(error);
      }
    }

    loadDetailPasien();
  }, [patient, isRestored, setData]);

  // Load detail riwayat for editing
  useEffect(() => {
    if (!isEditMode || !idPerhitungan) return;

    async function loadDetailRiwayat() {
      try {
        const response = await getRiwayatDetail(idPerhitungan);
        if (response.status === "success") {
          const detail = response.data;

          let penyakitLainnya = "";
          let penyakitString = detail.diagnosa_penyakit_saat_dihitung || "";
          const mifflinMatch = penyakitString.match(/Mifflin \(([^)]+)\)/);
          if (mifflinMatch) {
            penyakitLainnya = mifflinMatch[1];
            penyakitString = penyakitString.replace(/Mifflin \([^)]+\)/, "Mifflin");
          }

          const penyakitArray = penyakitString
            ? penyakitString
                .split(",")
                .map((p) => {
                  const val = p.trim();
                  if (val.toLowerCase() === "critical ill") return "critical_ill";
                  return val.toLowerCase();
                })
                .filter(Boolean)
            : [];

          const isDM = penyakitArray.includes("dm");
          const mappedAktivitas = mapAktivitasFisikFromBackend(detail.aktivitas_fisik, isDM);
          const mappedStress = mapFaktorStressFromBackend(detail.faktor_stres, isDM);

          // Update the prev disease type ref immediately so the disease type change effect won't trigger a reset
          prevDiseaseTypeRef.current = isDM ? "dm" : "other";

          const originalValues = {
            bb: detail.berat_badan_saat_dihitung || "",
            tb: detail.tinggi_badan_saat_dihitung || "",
            isEstimasi: detail.is_estimasi === 1,
            lila: detail.lila_cm || "",
            ulna: detail.ulna_cm || "",
            penyakit: [...penyakitArray],
            penyakitLainnya: penyakitLainnya || "",
            aktivitasFisik: mappedAktivitas,
            faktorStress: mappedStress.parent,
            faktorStressSlider: mappedStress.slider,
            hemodialisa: detail.status_hemodialisa === "Iya" || detail.status_hemodialisa === "Ya" ? "Ya" : "Tidak",
            penambahanKalori:
              detail.kategori_penambahan_energi && detail.kategori_penambahan_energi !== "Tidak ada"
                ? detail.kategori_penambahan_energi.split(", ")
                : [],
            persen_protein: detail.protein_persen || undefined,
            persen_lemak: detail.lemak_persen || undefined,
            persen_karbohidrat: detail.karbohidrat_persen || undefined,
            umur: detail.umur_saat_dihitung ? String(Math.round(detail.umur_saat_dihitung)) : "",
            jenisKelamin: detail.jenis_kelamin || "L",
          };

          setData({
            nama: detail.nama_pasien || "",
            noRM: detail.no_rm || "",
            umur: detail.umur_saat_dihitung ? String(Math.round(detail.umur_saat_dihitung)) : "",
            jenisKelamin: detail.jenis_kelamin || "L",
            bb: detail.berat_badan_saat_dihitung || "",
            tb: detail.tinggi_badan_saat_dihitung || "",
            isEstimasi: detail.is_estimasi === 1,
            lila: detail.lila_cm || "",
            ulna: detail.ulna_cm || "",
            bbEstimasi: detail.is_estimasi === 1 ? detail.berat_badan_saat_dihitung : "",
            tbEstimasi: detail.is_estimasi === 1 ? detail.tinggi_badan_saat_dihitung : "",
            persenLila: detail.persen_lila || "",
            originalBb: detail.berat_badan_saat_dihitung || "",
            originalTb: detail.berat_badan_saat_dihitung || "",
            penyakit: penyakitArray,
            penyakitLainnya: penyakitLainnya || "",
            aktivitasFisik: mappedAktivitas,
            faktorStress: mappedStress.parent,
            faktorStressSlider: mappedStress.slider,
            metodePerhitungan: detail.metode_perhitungan || "Mifflin St Jeor",
            hemodialisa: detail.status_hemodialisa === "Iya" || detail.status_hemodialisa === "Ya" ? "Ya" : "Tidak",
            penambahanKalori:
              detail.kategori_penambahan_energi && detail.kategori_penambahan_energi !== "Tidak ada"
                ? detail.kategori_penambahan_energi.split(", ")
                : [],
            tanggal_masuk: detail.tanggal_masuk || "",
            diagnosis: detail.kode_penyakit || "",
            originalDiagnosis: detail.kode_penyakit || "",
            isDiagnosisEdited: false,
            persen_protein: detail.protein_persen || undefined,
            persen_lemak: detail.lemak_persen || undefined,
            persen_karbohidrat: detail.karbohidrat_persen || undefined,

            // Edit Mode markers
            isEditMode: true,
            id_perhitungan: idPerhitungan,
            id_pasien: detail.no_rawat,
            originalValues: originalValues,
          });

          isInitializingRef.current = false;
        }
      } catch (err) {
        console.error("Gagal mengambil detail riwayat untuk edit:", err);
      }
    }

    loadDetailRiwayat();
  }, [isEditMode, idPerhitungan, setData, prevDiseaseTypeRef, isInitializingRef]);
}
