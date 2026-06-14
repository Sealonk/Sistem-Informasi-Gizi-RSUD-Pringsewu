export default function AssessmentActions({
  onBack,
  onContinue,
}) {
  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-[28px] border border-emerald-100 p-5 shadow-soft">
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="h-14 px-7 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all duration-300"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={onContinue}
              className="h-14 px-8 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-100/50 hover:bg-emerald-700 hover:shadow-lg transition-all duration-300"
            >
              Simpan & Lanjut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
