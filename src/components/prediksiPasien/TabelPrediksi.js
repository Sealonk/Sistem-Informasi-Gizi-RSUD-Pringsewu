export default function TabelPrediksi({ data = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h3 className="text-base font-bold text-slate-900">Tabel Prediksi Pasien Harian</h3>
      <p className="mt-1 text-xs text-slate-500">Rincian jumlah pasien untuk setiap tanggal prediksi.</p>
      <div className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-slate-100">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Hasil prediksi jumlah pasien per tanggal</caption>
          <thead className="sticky top-0 bg-slate-50 text-slate-600">
            <tr><th scope="col" className="px-4 py-3 text-left">Tanggal</th><th scope="col" className="px-4 py-3 text-right">Prediksi Pasien</th></tr>
          </thead>
          <tbody>{data.map((item) => <tr key={item.tanggal} className="border-t border-slate-100 hover:bg-violet-50/40">
            <th scope="row" className="px-4 py-3 text-left font-medium">{new Date(`${item.tanggal}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</th>
            <td className="px-4 py-3 text-right tabular-nums">{item.jumlah.toLocaleString("id-ID")}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
