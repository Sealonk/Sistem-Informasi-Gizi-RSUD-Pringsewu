import AverageNutritionSection from "../../components/ringkasanSistem/AverageNutritionSection";
import DiseaseDistributionSection from "../../components/ringkasanSistem/DiseaseDistributionSection";
import QuickActionSection from "../../components/ringkasanSistem/QuickActionSection";
import RecentHistorySection from "../../components/ringkasanSistem/RecentHistorySection";
import RingkasanHeader from "../../components/ringkasanSistem/RingkasanHeader";
import StatCardsSection from "../../components/ringkasanSistem/StatCardsSection";
import StatusSummarySection from "../../components/ringkasanSistem/StatusSummarySection";

export default function RingkasanSistem() {
  return (
    <main className="min-h-screen bg-[#f8fbff] px-4 py-6 text-slate-900 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <RingkasanHeader />

        <StatCardsSection />

        <QuickActionSection />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.86fr_1.15fr]">
          <StatusSummarySection />
          <AverageNutritionSection />
          <DiseaseDistributionSection />
        </div>

        <RecentHistorySection />
      </div>
    </main>
  );
}
