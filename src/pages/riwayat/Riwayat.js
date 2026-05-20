import { useState } from "react";

import RiwayatHeader from "../../components/riwayat/RiwayatHeader";
import RiwayatFilter from "../../components/riwayat/RiwayatFilter";
import RiwayatTabs from "../../components/riwayat/RiwayatTabs";

/* GIZI */
import RiwayatTable from "../../components/riwayat/gizi/RiwayatTable";

export default function Riwayat() {

  const [
    activeTab,
    setActiveTab,
  ] = useState("gizi");

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
          <RiwayatFilter />
        )}

        {/* TABLE */}
        <RiwayatTable />

      </div>

    </div>
  );
}