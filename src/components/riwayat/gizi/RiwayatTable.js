import { useEffect, useState } from "react";
import RiwayatRow from "./RiwayatRow";
import { getRiwayat, deleteRiwayat } from "../../../services/PasienServices/riwayatApi";
import { Loader2, ChevronLeft, ChevronRight, AlertCircle, Inbox } from "lucide-react";

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
        filter_user: filters.filter_user,
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
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
      "
    >
      {/* Decorative top accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* HEADER */}
      <div
        className="
          px-8
          py-6
          border-b
          border-slate-100/80
          relative
          z-10
        "
      >
        <h3
          className="
            text-lg
            font-extrabold
            text-slate-800
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
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="relative flex items-center justify-center">
            <Loader2 size={36} className="text-blue-600 animate-spin z-10" />
            <div className="absolute w-8 h-8 rounded-full border-4 border-slate-100 animate-ping"></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mt-2">Memuat data riwayat...</p>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-rose-50 text-rose-600 mb-4 border border-rose-100/50">
            <AlertCircle size={28} />
          </div>
          <h4 className="text-base font-extrabold text-slate-800 mb-1">Gagal Memuat Riwayat</h4>
          <p className="text-sm text-slate-550 max-w-md">{error}</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-50 text-slate-450 mb-4 border border-slate-200/40">
            <Inbox size={28} />
          </div>
          <h4 className="text-base font-extrabold text-slate-700 mb-1">Tidak ada data riwayat</h4>
          <p className="text-sm text-slate-400 max-w-xs">Data riwayat pasien tidak ditemukan atau tidak sesuai kriteria filter.</p>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto relative z-10">
          <table className="w-full min-w-[900px] border-collapse">
            {/* HEAD */}
            <thead className="bg-slate-55/60 backdrop-blur-sm border-b border-slate-100">
              <tr>
                <th className="px-10 py-5 text-left text-[11px] font-extrabold text-slate-400 uppercase tracking-wider min-w-[220px]">
                  Pasien
                </th>
                <th className="px-10 py-5 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  JK
                </th>
                <th className="px-10 py-5 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Kode Penyakit
                </th>
                <th className="px-10 py-5 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Energi & Makronutrien
                </th>
                <th className="px-10 py-5 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-10 py-5 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Pembuat
                </th>
                <th className="px-10 py-5 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100/60">
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
        <div className="px-8 py-5 bg-slate-50/40 backdrop-blur-sm border-t border-slate-100 flex items-center justify-between relative z-10">
          <p className="text-xs text-slate-500 font-semibold">
            Halaman <span className="font-extrabold text-slate-700">{page}</span> dari <span className="font-extrabold text-slate-700">{pagination.total_halaman}</span> <span className="text-slate-400 font-normal">({pagination.total_data} total riwayat)</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1 || loading}
              className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(p + 1, pagination.total_halaman))}
              disabled={page === pagination.total_halaman || loading}
              className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              title="Halaman Selanjutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}