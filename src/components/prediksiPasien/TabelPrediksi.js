export default function TabelPrediksi({ data = [] }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900 text-base">
          Tabel Prediksi Pasien Harian
        </h3>
        <p className="text-xs text-slate-500">
          Detail data angka prediksi pasien dari tanggal 1 sampai akhir bulan
        </p>
      </div>

      <div className="w-full overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100">
              <th
                className="
                  sticky
                  left-0
                  z-10
                  bg-slate-50/90
                  w-40
                  min-w-[160px]
                  px-4
                  py-3.5
                  text-left
                  text-xs
                  font-semibold
                  text-slate-600
                  border-r
                  border-slate-100
                  backdrop-blur-sm
                "
              >
                Tanggal
              </th>
              {data.map((item) => (
                <th
                  key={item.tanggal}
                  className="
                    w-12
                    min-w-[48px]
                    px-2
                    py-3.5
                    text-center
                    text-xs
                    font-semibold
                    text-slate-600
                  "
                >
                  {item.tanggal}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-slate-50/40 transition-colors">
              <td
                className="
                  sticky
                  left-0
                  z-10
                  bg-white
                  px-4
                  py-4
                  text-xs
                  font-bold
                  text-slate-800
                  border-r
                  border-slate-100
                  shadow-[2px_0_5px_rgba(0,0,0,0.02)]
                "
              >
                Prediksi Pasien
              </td>
              {data.map((item) => (
                <td
                  key={item.tanggal}
                  className="
                    px-2
                    py-4
                    text-center
                    text-sm
                    font-medium
                    text-slate-700
                    border-b
                    border-slate-100
                  "
                >
                  {item.jumlah}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
