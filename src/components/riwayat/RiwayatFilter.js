import {
  Search,
  CalendarDays,
  Filter,
} from "lucide-react";

export default function RiwayatFilter({
  filters,
  setFilters,
  setPage,
}) {

  return (

    <div
      className="
        rounded-[24px]
        border
        border-blue-100
        bg-white
        p-5
        shadow-sm
      "
    >

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-4
        "
      >

        {/* SEARCH */}
        <div>

          <label
            className="
              text-sm
              font-medium
              text-slate-700
              mb-2
              block
            "
          >
            Cari Pasien
          </label>

          <div
            className="
              relative
            "
          >

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Cari nama pasien atau No. RM..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setPage(1);
              }}
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-blue-100
                bg-slate-50
                pl-11
                pr-4
                text-sm
                outline-none
                focus:border-blue-400
              "
            />

          </div>

        </div>

        {/* PENYAKIT */}
        <div>

          <label
            className="
              text-sm
              font-medium
              text-slate-700
              mb-2
              block
            "
          >
            Filter Penyakit
          </label>

          <div
            className="
              relative
            "
          >

            <Filter
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
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
                h-12
                rounded-2xl
                border
                border-blue-100
                bg-slate-50
                pl-11
                pr-4
                text-sm
                outline-none
                focus:border-blue-400
              "
            >

              <option value="Semua Penyakit">
                Semua Penyakit
              </option>

              <option value="DM">
                DM
              </option>

              <option value="CKD">
                CKD
              </option>

              <option value="CHF">
                CHF
              </option>

              <option value="Stroke">
                Stroke
              </option>

              <option value="Lambung">
                Lambung
              </option>

            </select>

          </div>

        </div>

        {/* TANGGAL */}
        <div>

          <label
            className="
              text-sm
              font-medium
              text-slate-700
              mb-2
              block
            "
          >
            Filter Tanggal
          </label>

          <div
            className="
              relative
            "
          >

            <CalendarDays
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
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
                h-12
                rounded-2xl
                border
                border-blue-100
                bg-slate-50
                pl-11
                pr-4
                text-sm
                outline-none
                focus:border-blue-400
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}