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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
    const p = (periode || "").toLowerCase();
    if (p === "hari ini" || p === "hari_ini") return "hari_ini";
    if (p === "minggu ini" || p === "minggu_ini") return "minggu_ini";
    if (p === "bulan ini" || p === "bulan_ini") return "bulan_ini";
    if (p === "custom") return "custom";
    return "";
  }, [periode]);

  const loadPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError("");

      const periodeVal = getPeriodeValue();
      const isCustom = periodeVal === "custom";

      const response = await getPasienList({
        search,
        periode: periodeVal,
        startDate: isCustom ? startDate : "",
        endDate: isCustom ? endDate : "",
        tanggal_awal: isCustom ? startDate : "",
        tanggal_akhir: isCustom ? endDate : "",
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
    startDate,
    endDate,
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
    setFilterError("");
    if (value !== "Custom") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    setFilterError("");
    if (value && periode !== "Custom") {
      setPeriode("Custom");
    }
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    setFilterError("");
    if (value && periode !== "Custom") {
      setPeriode("Custom");
    }
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
    const pVal = getPeriodeValue();
    if (pVal === "custom" && (!startDate || !endDate)) {
      setFilterError("Silakan pilih tanggal mulai dan tanggal akhir terlebih dahulu.");
      return;
    }

    if (pVal === "custom" && startDate > endDate) {
      setFilterError("Tanggal mulai tidak boleh lebih besar dari tanggal akhir.");
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
    setStartDate("");
    setEndDate("");
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
    startDate,
    endDate,
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
    handleStartDateChange,
    handleEndDateChange,
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
