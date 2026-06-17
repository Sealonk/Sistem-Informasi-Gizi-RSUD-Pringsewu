import {
  Search,
  CalendarDays,
  Filter,
  User,
} from "lucide-react";

export default function RiwayatFilter({
  filters,
  setFilters,
  setPage,
}) {
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
        p-5
        sm:p-6
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        ease-out
      "
    >
      {/* Decorative top accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-70" />

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
          relative
          z-10
        "
      >
        {/* SEARCH */}
        <div>
          <label
            className="
              text-[11px]
              font-extrabold
              text-slate-400
              uppercase
              tracking-wider
              mb-2
              block
            "
          >
            Cari Pasien
          </label>

          <div className="relative">
            <Search
              size={16}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-450
                pointer-events-none
              "
            />

            <input
              type="text"
              placeholder="Nama pasien atau No. RM..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setPage(1);
              }}
              className="
                w-full
                h-11
                rounded-[16px]
                border
                border-slate-200/80
                bg-slate-50/50
                pl-11
                pr-4
                text-sm
                font-medium
                text-slate-700
                outline-none
                hover:bg-slate-50
                hover:border-slate-350
                focus:bg-white
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                transition-all
                duration-205
              "
            />
          </div>
        </div>

        {/* PENYAKIT */}
        <div>
          <label
            className="
              text-[11px]
              font-extrabold
              text-slate-400
              uppercase
              tracking-wider
              mb-2
              block
            "
          >
            Filter Penyakit
          </label>

          <div className="relative">
            <Filter
              size={16}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-450
                pointer-events-none
              "
            />

            <select
              value={filters.penyakit}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, penyakit: e.target.value }));
                setPage(1);
              }}
              className="
                w-full
                h-11
                rounded-[16px]
                border
                border-slate-200/80
                bg-slate-50/50
                pl-11
                pr-4
                text-sm
                font-medium
                text-slate-700
                outline-none
                hover:bg-slate-50
                hover:border-slate-350
                focus:bg-white
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                transition-all
                duration-205
                appearance-none
              "
            >
              <option value="Semua Penyakit">Semua Penyakit</option>
              <option value="DM">DM (Diabetes Melitus)</option>
              <option value="CKD">CKD (Chronic Kidney Disease)</option>
              <option value="CHF">CHF (Congestive Heart Failure)</option>
              <option value="Stroke">Stroke</option>
              <option value="Lambung">Lambung / Dispepsia</option>
            </select>
            {/* Custom arrow indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* TANGGAL */}
        <div>
          <label
            className="
              text-[11px]
              font-extrabold
              text-slate-400
              uppercase
              tracking-wider
              mb-2
              block
            "
          >
            Filter Tanggal
          </label>

          <div className="relative">
            <CalendarDays
              size={16}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-450
                pointer-events-none
              "
            />

            <input
              type="date"
              value={filters.tanggal}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, tanggal: e.target.value }));
                setPage(1);
              }}
              className="
                w-full
                h-11
                rounded-[16px]
                border
                border-slate-200/80
                bg-slate-50/50
                pl-11
                pr-4
                text-sm
                font-medium
                text-slate-755
                outline-none
                hover:bg-slate-50
                hover:border-slate-350
                focus:bg-white
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                transition-all
                duration-205
              "
            />
          </div>
        </div>

        {/* PETUGAS (USER) */}
        <div>
          <label
            className="
              text-[11px]
              font-extrabold
              text-slate-400
              uppercase
              tracking-wider
              mb-2
              block
            "
          >
            Filter Pembuat
          </label>

          <div className="relative">
            <User
              size={16}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-450
                pointer-events-none
              "
            />

            <select
              value={filters.filter_user}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, filter_user: e.target.value }));
                setPage(1);
              }}
              className="
                w-full
                h-11
                rounded-[16px]
                border
                border-slate-200/80
                bg-slate-50/50
                pl-11
                pr-4
                text-sm
                font-medium
                text-slate-700
                outline-none
                hover:bg-slate-50
                hover:border-slate-350
                focus:bg-white
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
                transition-all
                duration-205
                appearance-none
              "
            >
              <option value="all">Semua User</option>
              <option value="me">Hanya Saya</option>
            </select>
            {/* Custom arrow indicator */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}