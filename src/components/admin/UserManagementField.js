export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  readOnly = false,
  required = true,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
        className={`h-12 w-full rounded-xl border px-4 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
          readOnly
            ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-500"
            : "border-slate-200 bg-white"
        }`}
        required={required}
      />
    </label>
  );
}

export function Feedback({ type, children }) {
  const style =
    type === "success"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : "border-red-100 bg-red-50 text-red-600";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${style}`}>
      {children}
    </div>
  );
}
