import {
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

export default function FeedbackAlert({
  type = "success",
  message,
  onClose,
}) {
  if (!message) {
    return null;
  }

  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      className={`
        rounded-2xl
        border
        px-5
        py-4
        flex
        items-start
        gap-3
        shadow-sm
        ${
          isSuccess
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-rose-200 bg-rose-50 text-rose-800"
        }
      `}
      role="alert"
    >
      <Icon
        size={20}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm font-semibold leading-relaxed flex-1">
        {message}
      </p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="
            rounded-full
            p-1
            text-current
            opacity-70
            transition
            hover:opacity-100
            hover:bg-white/60
          "
          aria-label="Tutup pesan"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
