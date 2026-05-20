import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import PasienTable from "../../components/perhitungan/pilihPasien/PasienTable";
import FilterCard from "../../components/perhitungan/pilihPasien/FilterCard";

export default function PilihPasien() {

  const navigate = useNavigate();

  /* STATE */
  const [periode, setPeriode] =
    useState("Hari Ini");

  const [search, setSearch] =
    useState("");

  const [selectedRuangan, setSelectedRuangan] = useState("Semua Ruangan");
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
    setSelectedRuangan("Semua Ruangan");
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
      ruangan: "Bangsal Penyakit Dalam",
      dateISO: "2026-05-16",
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      rm: "RM-10232",
      umur: "52 Tahun",
      jk: "Perempuan",
      tanggal: "16 Mei 2026",
      ruangan: "Bangsal Bedah",
      dateISO: "2026-05-16",
    },
    {
      id: 3,
      nama: "Budi Santoso",
      rm: "RM-10233",
      umur: "38 Tahun",
      jk: "Laki-laki",
      tanggal: "15 Mei 2026",
      ruangan: "Bangsal Penyakit Dalam",
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

    const matchesRoom = selectedRuangan === "Semua Ruangan" || patient.ruangan === selectedRuangan;

    const matchesPeriod = isInPeriod(patient.dateISO);

    return matchesSearch && matchesRoom && matchesPeriod;
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
            flex
            items-start
            justify-between
            mb-10
          "
        >

          <div>

            {/* BACK */}
            <button
              onClick={() =>
                navigate("/portal")
              }
              className="
                flex
                items-center
                gap-2
                text-slate-500
                text-sm
                mb-5
                hover:text-blue-600
                transition-all
              "
            >

              <ArrowLeft size={18} />

              Kembali ke Portal

            </button>

            {/* TITLE */}
            <h1
              className="
                text-4xl
                font-bold
                text-slate-900
                tracking-tight
                mb-3
              "
            >
              Pilih Pasien
            </h1>

            {/* SUBTITLE */}
            <p
              className="
                text-slate-500
                text-base
              "
            >
              Pilih data pasien sebelum
              melakukan assessment gizi
            </p>

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
          selectedRuangan={selectedRuangan}
          setSelectedRuangan={setSelectedRuangan}
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