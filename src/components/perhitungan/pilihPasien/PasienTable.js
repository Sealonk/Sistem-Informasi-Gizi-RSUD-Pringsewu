import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import PasienRow from "./PasienRow";

export default function PasienTable({
  patients,
  pageSize = 50,
  onChangePageSize,
  pagination = null,
  page = 1,
  onPageChange,
  onReload,
  isLoading = false,
  error = "",
  onSelectPatient,
}) {
  const totalCount = pagination?.total_ditemukan || 0;
  const totalPages = pagination ? Math.ceil(totalCount / pageSize) : 1;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all duration-300 ${
            page === i
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-100 hover:bg-emerald-700"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div
      className="
        rounded-[32px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        overflow-hidden
      "
    >
      {/* Table Top Controls */}
      <div className="px-4 sm:px-8 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tampilkan
          </label>

          <select
            value={pageSize}
            onChange={(e) => onChangePageSize(Number(e.target.value))}
            className="
              h-10
              px-3
              pr-8
              rounded-xl
              border
              border-slate-200
              hover:border-slate-300
              bg-white
              text-xs
              font-bold
              text-slate-700
              outline-none
              cursor-pointer
              transition-all
            "
          >
            <option value={10}>10 Data</option>
            <option value={25}>25 Data</option>
            <option value={50}>50 Data</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-slate-500">
            Total ditemukan:{" "}
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {totalCount} pasien
            </span>
          </div>

          <button
            onClick={onReload}
            className="
              h-10
              px-4
              rounded-xl
              border
              border-slate-200
              hover:border-slate-300
              bg-white
              hover:bg-slate-50
              text-xs
              font-bold
              text-slate-600
              flex
              items-center
              gap-2
              transition-all
            "
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-emerald-600" : ""} />
            Muat Ulang
          </button>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto px-4 sm:px-8 pb-4">
        <table className="w-full text-left border-separate border-spacing-y-3.5">
          <thead>
            <tr className="text-slate-400">
              <th className="pl-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Nama Pasien
              </th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                No. RM
              </th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Jenis Penyakit
              </th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Umur
              </th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Jenis Kelamin
              </th>
              <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Status Hitung
              </th>
              <th className="pr-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin" />
                    <span className="text-xs font-bold text-slate-500">
                      Memuat data pasien...
                    </span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-8 py-16 text-center text-xs font-semibold text-rose-500">
                  ❌ {error}
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <PasienRow
                  key={patient.id}
                  patient={patient}
                  onSelect={onSelectPatient}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-8 py-16 text-center text-xs font-semibold text-slate-400">
                  Tidak ada data pasien yang sesuai filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Horizontally scrollable or stacked footer */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="px-4 sm:px-8 py-5 bg-slate-50/30 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold text-slate-500">
            Halaman <span className="font-bold text-slate-800">{page}</span> dari{" "}
            <span className="font-bold text-slate-800">{totalPages}</span>{" "}
            <span className="text-slate-300 mx-1">|</span> Menampilkan{" "}
            <span className="font-bold text-slate-800">
              {Math.min((page - 1) * pageSize + 1, totalCount)}
            </span>{" "}
            -{" "}
            <span className="font-bold text-slate-800">
              {Math.min(page * pageSize, totalCount)}
            </span>{" "}
            dari <span className="font-bold text-slate-800">{totalCount}</span> pasien
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(page - 1, 1))}
              disabled={page === 1 || isLoading}
              className="
                h-10
                px-4
                rounded-xl
                border
                border-slate-200
                bg-white
                text-xs
                font-bold
                text-slate-600
                hover:bg-slate-50
                hover:text-slate-900
                disabled:opacity-50
                disabled:cursor-not-allowed
                flex
                items-center
                gap-1.5
                transition-all
              "
            >
              <ChevronLeft size={14} />
              Sebelumnya
            </button>

            <div className="flex items-center gap-1">{renderPageNumbers()}</div>

            <button
              onClick={() => onPageChange(Math.min(page + 1, totalPages))}
              disabled={page === totalPages || isLoading}
              className="
                h-10
                px-4
                rounded-xl
                border
                border-slate-200
                bg-white
                text-xs
                font-bold
                text-slate-600
                hover:bg-slate-50
                hover:text-slate-900
                disabled:opacity-50
                disabled:cursor-not-allowed
                flex
                items-center
                gap-1.5
                transition-all
              "
            >
              Selanjutnya
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}