import {
  Save,
  ArrowLeft,
} from "lucide-react";

export default function HasilAction({
  navigate,
  onSave,
  isSaving = false,
  backPath = "/assessment",
  showSave = true,
  onBack,
}) {

  return (

    <div
      className="
        flex
        justify-end
        gap-4
        flex-wrap
      "
    >

      {/* KEMBALI */}
      <button
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
