import { useEffect, useState } from "react";
import RiwayatRow from "./RiwayatRow";
import { getRiwayat, deleteRiwayat } from "../../../services/PasienServices/riwayatApi";
import { Loader2 } from "lucide-react";

export default function RiwayatTable({ filters, page, setPage }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total_data: 0,
    halaman_sekarang: 1,
    total_halaman: 1,
    limit_per_halaman: 10
  });

  const loadRiwayat = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRiwayat({
        page,
        limit: 10,
        search: filters.search,
        penyakit: filters.penyakit,
        tanggal: filters.tanggal,
      });

      if (response.status === "success") {
        setData(response.data.riwayat);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || "Gagal mengambil data riwayat");
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat riwayat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiwayat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data riwayat perhitungan ini?")) {
      try {
        const response = await deleteRiwayat(id);
        if (response.status === "success") {
          // If deleted successfully, refresh the list. If it was the last item on the page, go to previous page
          const isLastItemOnPage = data.length === 1 && page > 1;
          if (isLastItemOnPage) {
            setPage(prev => prev - 1);
          } else {
            loadRiwayat();
          }
        } else {
          alert(response.message || "Gagal menghapus riwayat");
        }
      } catch (err) {
        alert(err.message || "Terjadi kesalahan saat menghapus riwayat");
      }
    }
  };

  return (
    <div
      className="
        rounded-[24px]
        border
        border-blue-100
        bg-white
        shadow-sm
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div
        className="
          px-6
          py-5
          border-b
          border-slate-100
        "
      >
        <h3
          className="
            text-lg
            font-bold
            text-slate-900
            mb-1
          "
        >
          Riwayat Perhitungan Gizi
        </h3>
        <p
          className="
            text-sm
            text-slate-500
          "
        >
          Daftar hasil perhitungan kebutuhan energi dan makronutrien pasien yang telah disimpan.
        </p>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 size={32} className="text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Memuat data riwayat...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-50 text-red-600 mb-3 font-semibold">
            !
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Gagal Memuat Riwayat</h4>
          <p className="text-xs text-slate-500 max-w-md">{error}</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <p className="text-sm font-semibold text-slate-600 mb-1">Tidak ada data riwayat</p>
          <p className="text-xs text-slate-400 max-w-xs">Data riwayat pasien tidak ditemukan atau tidak sesuai kriteria filter.</p>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && data.length > 0 && (
        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              min-w-[900px]
            "
          >
            {/* HEAD */}
            <thead
              className="
                bg-slate-50
              "
            >
              <tr>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  "
                >
                  Pasien
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  "
                >
                  Penyakit
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  "
                >
                  Energi
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  "
                >
                  Tanggal
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  "
                >
                  Status
                </th>
                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  "
                >
                  Action
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.map((item) => (
                <RiwayatRow
                  key={item.id_perhitungan}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {!loading && !error && pagination.total_halaman > 1 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Halaman <span className="font-semibold text-slate-700">{page}</span> dari <span className="font-semibold text-slate-700">{pagination.total_halaman}</span> ({pagination.total_data} total riwayat)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage(p => Math.min(p + 1, pagination.total_halaman))}
              disabled={page === pagination.total_halaman || loading}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}