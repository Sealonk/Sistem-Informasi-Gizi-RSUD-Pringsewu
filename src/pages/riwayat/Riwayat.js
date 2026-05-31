import { useState } from "react";

import {
  useLocation,
} from "react-router-dom";

import RiwayatHeader from "../../components/riwayat/RiwayatHeader";
import RiwayatFilter from "../../components/riwayat/RiwayatFilter";
import RiwayatTabs from "../../components/riwayat/RiwayatTabs";

/* GIZI */
import RiwayatTable from "../../components/riwayat/gizi/RiwayatTable";

export default function Riwayat() {

  const location =
    useLocation();

  const [
    activeTab,
    setActiveTab,
  ] = useState("gizi");

  const [filters, setFilters] = useState({
    search:
      location.state?.search || "",
    penyakit: "Semua Penyakit",
    tanggal: "",
  });

  const [page, setPage] =
    useState(1);

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
        <RiwayatHeader />

        {/* TABS */}
        <RiwayatTabs
          activeTab={
            activeTab
          }
          setActiveTab={
            setActiveTab
          }
        />

        {/* FILTER */}
        {activeTab ===
        "gizi" && (
          <RiwayatFilter
            filters={filters}
            setFilters={setFilters}
            setPage={setPage}
          />
        )}

        {/* TABLE */}
        {activeTab ===
        "gizi" && (
          <RiwayatTable
            filters={filters}
            page={page}
            setPage={setPage}
          />
        )}

      </div>

    </div>
  );
}