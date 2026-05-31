export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  suffix,
  readOnly = false,
  error,
}) {
  return (
    <div className="w-full">
      {/* LABEL */}
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        {label}
      </label>

      {/* INPUT WRAPPER */}
      <div className="relative">
        {/* INPUT */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full h-14 rounded-2xl border bg-white px-4 text-[15px] text-slate-800 outline-none transition-all duration-300 ${
            readOnly
              ? "border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed"
              : error
                ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 hover:border-rose-300"
                : "border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-200"
          } ${suffix ? "pr-14" : ""}`}
        />

        {/* SUFFIX */}
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-rose-600">
          ! {error}
        </p>
      )}
    </div>
  );
}
