import { HelpCircle } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  confirmColor = "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
}) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/45
        backdrop-blur-sm
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-[28px]
          bg-white
          p-7
          shadow-2xl
          border
          border-slate-100
          relative
          overflow-hidden
        "
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <HelpCircle size={24} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 mb-6">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="
              h-12
              px-5
              rounded-2xl
              bg-slate-100
              text-slate-700
              font-semibold
              text-sm
              hover:bg-slate-200
              transition-all
            "
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={`
              h-12
              px-6
              rounded-2xl
              text-white
              font-semibold
              text-sm
              transition-all
              shadow-lg
              ${confirmColor}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
