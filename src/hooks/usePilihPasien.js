import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getDaftarRuangan,
  getPasienList,
} from "../services/perhitungan/pasienApi";

export default function usePilihPasien() {
  const navigate = useNavigate();

  const [periode, setPeriode] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [statusPerhitungan, setStatusPerhitungan] = useState("");
  const [ruangan, setRuangan] = useState("");
  const [statusPulang, setStatusPulang] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPatientForConfirm, setSelectedPatientForConfirm] = useState(null);
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [filterError, setFilterError] = useState("");
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [statistik, setStatistik] = useState(null);
  const [ruanganOptions, setRuanganOptions] = useState([]);
  const [ruanganError, setRuanganError] = useState("");

  const getPeriodeValue = useCallback(() => {
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

  const loadPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError("");

      const response = await getPasienList({
        search,
        periode: getPeriodeValue(),
        startDate: periode === "Custom" ? selectedDate : "",
        endDate: periode === "Custom" ? selectedDate : "",
        limit: pageSize,
        page: page,
        status_perhitungan: statusPerhitungan,
        ruangan,
        status_pulang: statusPulang,
      });

      setPatients(response.pasien);
      setStatistik(response.statistik);
      setPagination(response.pagination);
    } catch (error) {
      setFetchError(error.message || "Gagal mengambil data pasien");
    } finally {
      setIsLoading(false);
    }
  }, [
    search,
    periode,
    selectedDate,
    pageSize,
    page,
    statusPerhitungan,
    ruangan,
    statusPulang,
    getPeriodeValue,
  ]);

  // Menyimpan trigger untuk memuat data secara eksplisit (klik Cari / Reset)
  const loadTriggerRef = useRef(0);
  const [loadTrigger, setLoadTrigger] = useState(0);

  // Muat data hanya saat: initial load, pagination berubah, atau trigger eksplisit (Cari/Reset)
  useEffect(() => {
    loadPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadTrigger, page, pageSize]);

  useEffect(() => {
    let isMounted = true;

    const loadRuangan = async () => {
      try {
        setRuanganError("");
        const data = await getDaftarRuangan();

        if (isMounted) {
          setRuanganOptions(data);
        }
      } catch (error) {
        if (isMounted) {
          setRuanganError(error.message || "Gagal mengambil daftar ruangan");
        }
      }
    };

    loadRuangan();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatientForConfirm(patient);
    setShowConfirm(true);
  };

  const handleConfirmSelect = () => {
    setShowConfirm(false);
    if (selectedPatientForConfirm) {
      localStorage.setItem(
        "selectedAssessmentPatient",
        JSON.stringify(selectedPatientForConfirm)
      );
      navigate("/assessment", {
        state: selectedPatientForConfirm,
      });
    }
  };

  const handlePeriodeChange = (value) => {
    setPeriode(value);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleDateChange = (value) => {
    setSelectedDate(value);
  };

  const handleStatusPerhitunganChange = (value) => {
    setStatusPerhitungan(value);
  };

  const handleRuanganChange = (value) => {
    setRuangan(value);
  };

  const handleStatusPulangChange = (value) => {
    setStatusPulang(value);
  };

  const handleChangePageSize = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const handleSearch = () => {
    if (periode === "Custom" && !selectedDate) {
      setFilterError("Silakan pilih tanggal terlebih dahulu.");
      return;
    }

    setFilterError("");
    setPage(1);

    // Trigger eksplisit untuk memuat data
    loadTriggerRef.current += 1;
    setLoadTrigger(loadTriggerRef.current);
  };

  const handleReset = () => {
    setPeriode("");
    setSearch("");
    setSelectedDate("");
    setFilterError("");
    setStatusPerhitungan("");
    setRuangan("");
    setStatusPulang("");
    setPage(1);

    // Trigger eksplisit untuk memuat data setelah reset
    loadTriggerRef.current += 1;
    setLoadTrigger(loadTriggerRef.current);
  };

  return {
    periode,
    search,
    selectedDate,
    statusPerhitungan,
    ruangan,
    statusPulang,
    showConfirm,
    setShowConfirm,
    selectedPatientForConfirm,
    setSelectedPatientForConfirm,
    pageSize,
    page,
    pagination,
    filterError,
    patients,
    isLoading,
    fetchError,
    statistik,
    ruanganOptions,
    ruanganError,
    handleSelectPatient,
    handleConfirmSelect,
    handlePeriodeChange,
    handleSearchChange,
    handleDateChange,
    handleStatusPerhitunganChange,
    handleRuanganChange,
    handleStatusPulangChange,
    handleChangePageSize,
    handleSearch,
    handleReset,
    setPage,
    loadPatients,
  };
}
