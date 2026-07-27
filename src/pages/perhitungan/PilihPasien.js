import PasienTable from "../../components/perhitungan/pilihPasien/PasienTable";
import FilterCard from "../../components/perhitungan/pilihPasien/FilterCard";
import PortalBackground from "../../components/portal/PortalBackground";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import PilihPasienHeader from "../../components/perhitungan/pilihPasien/PilihPasienHeader";
import usePilihPasien from "../../hooks/usePilihPasien";

export default function PilihPasien() {
  const {
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
  } = usePilihPasien();

  return (
    <div className="min-h-screen bg-[#f8fbff] relative overflow-hidden">
      <PortalBackground />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 relative z-10">
        <PilihPasienHeader statistik={statistik} />

        <FilterCard
          periode={periode}
          setPeriode={handlePeriodeChange}
          startDate={startDate}
          setStartDate={handleStartDateChange}
          endDate={endDate}
          setEndDate={handleEndDateChange}
          search={search}
          setSearch={handleSearchChange}
          statusPerhitungan={statusPerhitungan}
          setStatusPerhitungan={handleStatusPerhitunganChange}
          ruangan={ruangan}
          setRuangan={handleRuanganChange}
          statusPulang={statusPulang}
          setStatusPulang={handleStatusPulangChange}
          ruanganOptions={ruanganOptions}
          ruanganError={ruanganError}
          error={filterError}
          onReset={handleReset}
          onSearch={handleSearch}
        />

        <PasienTable
          patients={patients}
          pageSize={pageSize}
          onChangePageSize={handleChangePageSize}
          pagination={pagination}
          page={page}
          onPageChange={setPage}
          onReload={loadPatients}
          isLoading={isLoading}
          error={fetchError}
          onSelectPatient={handleSelectPatient}
        />
      </div>

      {/* CONFIRMATION MODAL PADA LEVEL HALAMAN UTAMA */}
      <ConfirmationModal
        isOpen={showConfirm}
        title="Pilih Pasien"
        message={`Apakah Anda yakin ingin memilih pasien ${selectedPatientForConfirm?.nama} untuk melakukan perhitungan gizi?`}
        onConfirm={handleConfirmSelect}
        onCancel={() => {
          setShowConfirm(false);
          setSelectedPatientForConfirm(null);
        }}
        confirmText="Pilih Pasien"
      />
    </div>
  );
}
