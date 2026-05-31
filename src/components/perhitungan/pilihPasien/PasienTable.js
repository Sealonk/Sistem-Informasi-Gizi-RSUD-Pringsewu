import PasienRow from "./PasienRow";

export default function PasienTable({
  patients,
  pageSize = 50,
  onChangePageSize,
  totalCount = 0,
  onReload,
  isLoading = false,
  error = "",
}) {

  return (

    <div className="bg-white rounded-[18px] border border-blue-100 shadow-soft overflow-hidden">

      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <label className="text-sm text-slate-600">

            Tampilkan

          </label>

          <select
            value={pageSize}
            onChange={(e) =>
              onChangePageSize(
                Number(e.target.value)
              )
            }
            className="h-10 px-3 rounded-lg border border-slate-100 bg-white text-sm"
          >

            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>

          </select>

          <span className="text-sm text-slate-500">

            data

          </span>

        </div>

        <div className="flex items-center gap-4">

          <div className="text-sm text-slate-600">

            Total ditemukan:

            <span className="font-semibold text-slate-900">

              {" "}
              {totalCount} pasien

            </span>

          </div>

          <button
            onClick={onReload}
            className="h-10 px-4 rounded-lg border border-blue-100 bg-white text-sm text-blue-600 hover:bg-blue-50"
          >

            Muat Ulang

          </button>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-100 bg-slate-50/70">

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                Nama Pasien

              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                No. RM

              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                Umur

              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">

                Jenis Kelamin

              </th>

              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">

                Aksi

              </th>

            </tr>

          </thead>

          <tbody>

            {
              isLoading ? (

                <tr>

                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >

                    Memuat data pasien...

                  </td>

                </tr>

              ) : error ? (

                <tr>

                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-rose-600"
                  >

                    {error}

                  </td>

                </tr>

              ) : patients.length > 0 ? (

                patients.map((patient) => (

                  <PasienRow
                    key={patient.id}
                    patient={patient}
                  />

                ))

              ) : (

                <tr>

                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >

                    Tidak ada pasien yang sesuai filter.

                  </td>

                </tr>

              )
            }

          </tbody>

        </table>

      </div>

    </div>
  );
}