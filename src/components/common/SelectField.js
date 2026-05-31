import { ChevronDown } from "lucide-react";

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Pilih",
  error,
  disabled,
}) {
  return (
    <div className="w-full">
      {/* LABEL */}
      <label className="block text-sm font-semibold text-slate-700 mb-3">
        {label}
      </label>

      {/* SELECT WRAPPER */}
      <div className="relative">
        {/* SELECT */}
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`w-full h-14 rounded-2xl border px-4 pr-12 text-[15px] outline-none appearance-none transition-all duration-300 ${
            disabled
              ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
              : error
              ? "border-rose-300 bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-100 hover:border-rose-300"
              : "border-slate-100 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-200"
          }`}
        >
          {/* PLACEHOLDER */}
          <option value="">{placeholder}</option>

          {/* OPTIONS */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* ICON */}
        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-rose-600">
          ! {error}
        </p>
      )}
    </div>
  );
}
