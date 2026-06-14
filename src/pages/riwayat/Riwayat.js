import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import RiwayatHeader from "../../components/riwayat/RiwayatHeader";
import RiwayatFilter from "../../components/riwayat/RiwayatFilter";
import RiwayatTabs from "../../components/riwayat/RiwayatTabs";
import PortalBackground from "../../components/portal/PortalBackground";

/* GIZI */
import RiwayatTable from "../../components/riwayat/gizi/RiwayatTable";

export default function Riwayat() {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState("gizi");

  const [filters, setFilters] = useState({
    search: location.state?.search || "",
    penyakit: "Semua Penyakit",
    tanggal: "",
    filter_user: "all",
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#f8fbff] px-6 py-8 relative overflow-hidden transition-all duration-500 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <PortalBackground />

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* HEADER */}
        <RiwayatHeader />

        {/* TABS */}
        <RiwayatTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* FILTER */}
        {activeTab === "gizi" && (
          <RiwayatFilter
            filters={filters}
            setFilters={setFilters}
            setPage={setPage}
          />
        )}

        {/* TABLE */}
        {activeTab === "gizi" && (
          <RiwayatTable filters={filters} page={page} setPage={setPage} />
        )}
      </div>
    </div>
  );
}