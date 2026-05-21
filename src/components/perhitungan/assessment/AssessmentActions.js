export default function AssessmentActions({
  onBack,
  onContinue,
}) {
  return (
    <div className="mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-[12px] border border-blue-100 p-4 shadow-soft">
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="h-14 px-7 rounded-2xl border border-blue-100 bg-white text-slate-700 font-medium hover:bg-blue-50 transition-all"
            >
              Kembali
            </button>

            <button
              type="button"
              onClick={onContinue}
              className="h-14 px-8 rounded-2xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              Simpan & Lanjut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
