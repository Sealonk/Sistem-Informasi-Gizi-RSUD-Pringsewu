import { ChevronDown } from "lucide-react";

export default function SelectField({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Pilih",
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
          className="w-full h-14 rounded-2xl border border-slate-100 bg-white px-4 pr-12 text-[15px] text-slate-800 outline-none appearance-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-slate-200"
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
    </div>
  );
}