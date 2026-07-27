import { useEffect, useState } from "react";

import AverageNutritionSection from "../../components/ringkasanSistem/AverageNutritionSection";
import DiseaseDistributionSection from "../../components/ringkasanSistem/DiseaseDistributionSection";
import QuickActionSection from "../../components/ringkasanSistem/QuickActionSection";
import RecentHistorySection from "../../components/ringkasanSistem/RecentHistorySection";
import RingkasanHeader from "../../components/ringkasanSistem/RingkasanHeader";
import StatCardsSection from "../../components/ringkasanSistem/StatCardsSection";
import StatusSummarySection from "../../components/ringkasanSistem/StatusSummarySection";
import PortalBackground from "../../components/portal/PortalBackground";

import { getDashboardStats } from "../../services/dashboard/dashboardApi";

export default function RingkasanSistem() {

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [diseaseStartDate, setDiseaseStartDate] = useState("");
  const [diseaseEndDate, setDiseaseEndDate] = useState("");
  const [diseaseLoading, setDiseaseLoading] = useState(false);

  useEffect(() => {

    async function fetchDashboard() {

      try {

        setLoading(true);

        const response =
          await getDashboardStats();

        if (
          response.status === "success"
        ) {

          setDashboardData(
            response.data
          );

        } else {

          setError(
            response.message ||
            "Gagal mengambil dashboard"
          );
        }

      } catch (err) {

        setError(
          err.message ||
          "Terjadi kesalahan"
        );

      } finally {

        setLoading(false);
      }
    }

    fetchDashboard();

  }, []);

  const handleDiseaseDateChange = async (start, end) => {
    setDiseaseStartDate(start);
    setDiseaseEndDate(end);

    try {
      setDiseaseLoading(true);
      const params = {};
      if (start) params.tanggal_awal = start;
      if (end) params.tanggal_akhir = end;

      const response = await getDashboardStats(params);
      if (response.status === "success" && response.data?.distribusi_penyakit) {
        setDashboardData((prev) => ({
          ...prev,
          distribusi_penyakit: response.data.distribusi_penyakit,
        }));
      }
    } catch (err) {
      console.error("Gagal memuat distribusi penyakit terfilter:", err);
    } finally {
      setDiseaseLoading(false);
    }
  };

  const handleDiseaseReset = () => {
    handleDiseaseDateChange("", "");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fbff] relative overflow-hidden">
        <PortalBackground />
        <div className="relative z-10 flex flex-col items-center gap-4 bg-white/70 backdrop-blur-md border border-blue-100 px-8 py-10 rounded-[32px] shadow-lg shadow-blue-50/50">
          <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <p className="text-sm font-bold text-slate-700 tracking-wide">
            Sinkronisasi Dashboard Ringkasan...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fbff] relative overflow-hidden">
        <PortalBackground />
        <div className="relative z-10 flex flex-col items-center gap-4 bg-white/70 backdrop-blur-md border border-rose-100 px-8 py-10 rounded-[32px] shadow-lg shadow-rose-50/50 text-center max-w-md">
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-2xl font-black mb-2 animate-bounce">
            !
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">Terjadi Kesalahan</h3>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 h-11 bg-blue-600 text-white rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (

    <main className="min-h-screen bg-[#f8fbff] px-4 py-6 text-slate-900 md:px-8 relative overflow-hidden">
      
      <PortalBackground />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5">

        <RingkasanHeader />

        <StatCardsSection
          data={dashboardData?.ringkasan}
        />

        <QuickActionSection />

        {/* ROW 1: STATUS GIZI & RATA-RATA (PIE CHART) */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <StatusSummarySection
            data={dashboardData?.status_gizi}
          />

          <AverageNutritionSection
            data={dashboardData?.rata_rata}
          />
        </div>

        {/* ROW 2: DISTRIBUSI PENYAKIT (DIAGRAM BATANG & DATE FILTER) */}
        <DiseaseDistributionSection
          data={dashboardData?.distribusi_penyakit}
          riwayatData={dashboardData?.riwayat_terakhir}
          startDate={diseaseStartDate}
          endDate={diseaseEndDate}
          onDateChange={handleDiseaseDateChange}
          onReset={handleDiseaseReset}
          loading={diseaseLoading}
        />

        {/* ROW 3: RIWAYAT TERAKHIR */}
        <RecentHistorySection
          data={dashboardData?.riwayat_terakhir}
        />

      </div>

    </main>
  );
}