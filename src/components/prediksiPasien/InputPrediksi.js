import { ArrowRight, CalendarDays, LoaderCircle, Sparkles } from "lucide-react";

export default function InputPrediksi({ hari, setHari, onPredict, isLoading }) {
  return (
    <section className="prediction-panel prediction-input">
      <div className="prediction-section-heading">
        <span className="prediction-section-icon"><CalendarDays size={20} aria-hidden="true" /></span>
        <div><h2 className="text-lg font-bold text-slate-900">Periode Prediksi</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">Tentukan jumlah hari yang ingin diprediksi, mulai besok.</p></div>
      </div>
      <form className="prediction-form" onSubmit={(event) => { event.preventDefault(); onPredict(); }}>
        <fieldset disabled={isLoading} className="min-w-0">
          <label htmlFor="hari-prediksi" className="mb-2.5 block text-sm font-semibold text-slate-700">Jumlah Hari Prediksi</label>
          <div className="prediction-number-wrap">
            <input id="hari-prediksi" type="number" min="1" max="365" step="1" required value={hari}
              onChange={(event) => setHari(event.target.value)} aria-describedby="hari-help" className="prediction-number" />
            <span aria-hidden="true">hari</span>
          </div>
          <p id="hari-help" className="mt-2.5 text-xs leading-relaxed text-slate-500">Masukkan bilangan bulat antara 1 hingga 365 hari.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[7, 14, 30, 90].map((value) => <button key={value} type="button" onClick={() => setHari(String(value))}
              aria-pressed={Number(hari) === value} className="prediction-preset">{value} hari</button>)}
          </div>
        </fieldset>
        <div className="prediction-submit-area">
          <span className="prediction-section-icon mb-3"><Sparkles size={20} aria-hidden="true" /></span>
          <p className="mb-5 text-sm leading-relaxed text-slate-500">Prediksi jumlah pasien harian berdasarkan data historis menggunakan model AI.</p>
          <button type="submit" disabled={isLoading} className="prediction-primary w-full">
            {isLoading ? <LoaderCircle size={19} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Sparkles size={19} aria-hidden="true" />}
            {isLoading ? "Memproses prediksi..." : "Prediksi Sekarang"}
            {!isLoading && <ArrowRight size={18} className="prediction-cta-arrow ml-auto" aria-hidden="true" />}
          </button>
        </div>
      </form>
    </section>
  );
}
