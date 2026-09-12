import { LoaderCircle, Sparkles } from "lucide-react";
export default function InputPrediksi({ hari, setHari, onPredict, isLoading }) {
  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-white/75 p-5 shadow-sm backdrop-blur-md sm:p-8">
      <h2 className="text-lg font-bold text-slate-800">Periode Prediksi</h2>
      <p className="mt-2 text-sm text-slate-500">Tentukan jumlah hari yang ingin diprediksi, mulai besok.</p>
      <form className="mt-6 space-y-5" onSubmit={(event) => { event.preventDefault(); onPredict(); }}>
        <fieldset disabled={isLoading} className="space-y-4">
          <label htmlFor="hari-prediksi" className="block text-sm font-semibold text-slate-700">Jumlah Hari Prediksi</label>
          <input id="hari-prediksi" type="number" min="1" max="365" step="1" required value={hari}
            onChange={(event) => setHari(event.target.value)} aria-describedby="hari-help"
            className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:opacity-60 sm:max-w-sm" />
          <p id="hari-help" className="text-xs text-slate-500">Masukkan bilangan bulat antara 1 hingga 365 hari.</p>
          <div className="flex flex-wrap gap-2">
            {[7, 14, 30, 90].map((value) => <button key={value} type="button" onClick={() => setHari(String(value))}
              aria-pressed={Number(hari) === value}
              className={`rounded-xl border px-4 py-2 text-sm font-medium ${Number(hari) === value ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-600"}`}>{value} hari</button>)}
          </div>
        </fieldset>
        <div className="flex justify-end">
          <button type="submit" disabled={isLoading} className="flex h-12 items-center gap-2 rounded-2xl bg-violet-600 px-6 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60">
            {isLoading ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isLoading ? "Memproses prediksi..." : "Prediksi Sekarang"}
          </button>
        </div>
      </form>
    </section>
  );
}
