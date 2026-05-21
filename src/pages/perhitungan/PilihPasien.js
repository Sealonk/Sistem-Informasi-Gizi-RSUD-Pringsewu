import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft, ClipboardList, UsersRound } from "lucide-react";
import PasienTable from "../../components/perhitungan/pilihPasien/PasienTable";
import FilterCard from "../../components/perhitungan/pilihPasien/FilterCard";

export default function PilihPasien() {

  const navigate = useNavigate();

  /* STATE */
  const [periode, setPeriode] =
    useState("Hari Ini");

  const [search, setSearch] =
    useState("");

  const [selectedDate, setSelectedDate] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const [filterError, setFilterError] = useState("");

  const handleReload = () => {
    console.log("Reload pasien");
  };

  const handleSearch = () => {
    if (periode === "Custom" && !selectedDate) {
      setFilterError("Silakan pilih tanggal terlebih dahulu untuk periode custom.");
      return;
    }
    setFilterError("");
  };

  const handleReset = () => {
    setPeriode("Hari Ini");
    setSearch("");
    setSelectedDate("");
    setFilterError("");
  };

  /* DUMMY DATA */
  const patients = [
    {
      id: 1,
      nama: "Ahmad Fauzi",
      rm: "RM-10231",
      umur: "45 Tahun",
      jk: "Laki-laki",
      tanggal: "16 Mei 2026",
      dateISO: "2026-05-16",
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      rm: "RM-10232",
      umur: "52 Tahun",
      jk: "Perempuan",
      tanggal: "16 Mei 2026",
      dateISO: "2026-05-16",
    },
    {
      id: 3,
      nama: "Budi Santoso",
      rm: "RM-10233",
      umur: "38 Tahun",
      jk: "Laki-laki",
      tanggal: "15 Mei 2026",
      dateISO: "2026-05-15",
    },
  ];

  /* FILTER SEARCH */
  const isInPeriod = (patientISO) => {
    if (!patientISO) return false;
    const pd = new Date(patientISO);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (periode === "Hari Ini") {
      return pd.toDateString() === today.toDateString();
    }

    if (periode === "Minggu Ini") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return pd >= startOfWeek && pd <= endOfWeek;
    }

    if (periode === "Bulan Ini") {
      return pd.getMonth() === today.getMonth() && pd.getFullYear() === today.getFullYear();
    }

    if (periode === "Custom") {
      if (!selectedDate) return false; // require date for custom filter
      return pd.toISOString().slice(0,10) === selectedDate;
    }

    return true;
  };

  const filteredPatients = patients.filter((patient) => {
    const keyword = search.trim().toLowerCase();

    const matchesSearch = !keyword || patient.nama.toLowerCase().includes(keyword) || patient.rm.toLowerCase().includes(keyword);

    const matchesPeriod = isInPeriod(patient.dateISO);

    return matchesSearch && matchesPeriod;
  });

  return (

    <div
      className="
        min-h-screen
        bg-[#f8fbff]
      "
    >

      {/* CONTAINER */}
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-8
        "
      >

        {/* HEADER */}
        <div
          className="
            rounded-[24px]
            border
            border-blue-100
            bg-white
            p-6
            shadow-sm
            mb-10
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-6
              flex-wrap
            "
          >
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <UsersRound size={24} />
              </div>

              <div className="flex-1">
                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                    mb-2
                  "
                >
                  Perhitungan Gizi
                </h1>

                <p
                  className="
                    text-sm
                    text-slate-500
                    mb-4
                  "
                >
                  Pilih data pasien sebelum melakukan assessment gizi.
                </p>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    text-sm
                    font-medium
                  "
                >
                  <ClipboardList size={16} />
                  Data pasien siap dipilih untuk perhitungan
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/portal")
              }
              className="
                h-12
                px-5
                rounded-2xl
                border
                border-blue-200
                bg-white
                text-blue-600
                text-sm
                font-semibold
                flex
                items-center
                gap-2
                hover:bg-blue-50
                transition-all
              "
            >
              <ArrowLeft size={18} />
              Kembali ke Portal
            </button>
          </div>
        </div>

        <FilterCard
          periode={periode}
          setPeriode={(value) => {
            setPeriode(value);
            setFilterError("");
          }}
          selectedDate={selectedDate}
          setSelectedDate={(value) => {
            setSelectedDate(value);
            setFilterError("");
          }}
          search={search}
          setSearch={setSearch}
          error={filterError}
          onReset={handleReset}
          onSearch={handleSearch}
        />

        {/* TABLE */}
        <PasienTable
          patients={filteredPatients}
          pageSize={pageSize}
          onChangePageSize={setPageSize}
          totalCount={filteredPatients.length}
          onReload={handleReload}
        />

      </div>

    </div>
  );
}
