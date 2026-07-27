import {
  Save,
  ArrowLeft,
  FileText,
} from "lucide-react";

export default function HasilAction({
  navigate,
  onSave,
  isSaving = false,
  backPath = "/assessment",
  showSave = true,
  onBack,
  onExportPDF,
}) {

  return (

    <div
      className="
        flex
        justify-end
        gap-4
        flex-wrap
        no-print
      "
    >

      {/* KEMBALI */}
      <button
        type="button"
        onClick={() => {
          if (onBack) {
            onBack();
          } else {
            navigate(backPath);
          }
        }}
        className="
          h-12
          px-5
          rounded-2xl
          border
          border-blue-200
          bg-white
          text-blue-600
          text-sm
          font-semibold
          flex
          items-center
          gap-2
          hover:bg-blue-50
          transition-all
        "
      >

        <ArrowLeft
          size={18}
        />

        Kembali

      </button>

      {/* EXPORT PDF */}
      {onExportPDF && (
        <button
          type="button"
          onClick={onExportPDF}
          className="
            h-12
            px-5
            rounded-2xl
            border
            border-emerald-200
            bg-emerald-50
            text-emerald-700
            text-sm
            font-semibold
            flex
            items-center
            gap-2
            hover:bg-emerald-100
            transition-all
            shadow-sm
          "
        >
          <FileText size={18} />
          Export PDF
        </button>
      )}

      {/* SIMPAN */}
      {showSave && onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="
            h-12
            px-6
            rounded-2xl
            bg-blue-600
            text-white
            text-sm
            font-semibold
            flex
            items-center
            gap-2
            shadow-lg
            shadow-blue-100
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:bg-blue-300
            disabled:shadow-none
            transition-all
          "
        >

          <Save size={18} />

          {isSaving
            ? "Menyimpan..."
            : "Simpan Hasil"}

        </button>
      )}

    </div>
  );
}
