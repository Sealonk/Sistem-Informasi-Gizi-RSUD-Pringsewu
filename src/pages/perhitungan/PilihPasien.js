import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  ClipboardList,
  UsersRound,
} from "lucide-react";

import PasienTable from "../../components/perhitungan/pilihPasien/PasienTable";
import FilterCard from "../../components/perhitungan/pilihPasien/FilterCard";
import PortalBackground from "../../components/portal/PortalBackground";

import {
  getPasienList,
} from "../../services/PasienServices/pasienApi";

export default function PilihPasien() {

  const navigate =
    useNavigate();

  const [periode, setPeriode] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [pageSize, setPageSize] =
    useState(50);

  const [filterError, setFilterError] =
    useState("");

  const [patients, setPatients] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [fetchError, setFetchError] =
    useState("");

  const [statistik, setStatistik] =
    useState(null);

  const getPeriodeValue =
    useCallback(() => {

      switch (periode) {

        case "Hari Ini":
          return "hari_ini";

        case "Minggu Ini":
          return "minggu_ini";

        case "Bulan Ini":
          return "bulan_ini";

        case "Custom":
          return "custom";

        default:
          return "";
      }

    }, [periode]);

  const loadPatients =
    useCallback(async () => {

      try {

        setIsLoading(true);

        setFetchError("");

        const response =
          await getPasienList({

            search,

            periode:
              getPeriodeValue(),

            startDate:
              periode === "Custom"
                ? selectedDate
                : "",

            endDate:
              periode === "Custom"
                ? selectedDate
                : "",

            limit:
              pageSize,
          });

        setPatients(
          response.pasien
        );

        setStatistik(
          response.statistik
        );

      } catch (error) {

        setFetchError(
          error.message ||
          "Gagal mengambil data pasien"
        );

      } finally {

        setIsLoading(false);

      }

    }, [
      search,
      periode,
      selectedDate,
      pageSize,
      getPeriodeValue,
    ]);

  useEffect(() => {

    loadPatients();

  }, [loadPatients]);

  const handleSearch = () => {

    if (
      periode === "Custom" &&
      !selectedDate
    ) {

      setFilterError(
        "Silakan pilih tanggal terlebih dahulu."
      );

      return;
    }

    setFilterError("");

    loadPatients();
  };

  const handleReset = async () => {

    setPeriode("");

    setSearch("");

    setSelectedDate("");

    setFilterError("");

    loadPatients();
  };

  return (

    <div className="min-h-screen bg-[#f8fbff] relative overflow-hidden">
      
      <PortalBackground />

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">

        <div className="rounded-[32px] border border-slate-200/80 bg-white/75 backdrop-blur-md p-6 shadow-sm mb-8 hover:shadow-md transition-all duration-300">

          <div className="flex items-start justify-between gap-6 flex-wrap">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

                <UsersRound size={24} />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">

                  Perhitungan Gizi

                </h1>

                <p className="text-sm text-slate-500 mb-4">

                  Pilih data pasien sebelum melakukan assessment gizi.

                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium">

                  <ClipboardList size={16} />

                  {
                    statistik
                      ? `Total ${statistik.total_pasien} pasien ditemukan`
                      : "Memuat data pasien..."
                  }

                </div>

              </div>

            </div>

            <button
              onClick={() =>
                navigate("/portal")
              }
              className="h-12 px-5 rounded-2xl border border-blue-200 bg-white text-blue-600 text-sm font-semibold flex items-center gap-2 hover:bg-blue-50 hover:shadow-md transition-all duration-300"
            >

              <ArrowLeft size={18} />

              Kembali ke Portal

            </button>

          </div>

        </div>

        <FilterCard
          periode={periode}
          setPeriode={setPeriode}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          search={search}
          setSearch={setSearch}
          error={filterError}
          onReset={handleReset}
          onSearch={handleSearch}
        />

        <PasienTable
          patients={patients}
          pageSize={pageSize}
          onChangePageSize={setPageSize}
          totalCount={
            statistik?.total_pasien || 0
          }
          onReload={loadPatients}
          isLoading={isLoading}
          error={fetchError}
        />

      </div>

    </div>
  );
}