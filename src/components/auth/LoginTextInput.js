export default function LoginTextInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightElement,
}) {
  return (
    <div className="mb-5">
      <label
        className="
          block
          mb-2
          text-sm
          font-semibold
          text-slate-700
        "
      >
        {label}
      </label>

      <div className="relative group">
        {Icon && (
          <div
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              transition-colors
              duration-300
              group-focus-within:text-blue-500
              pointer-events-none
            "
          >
            <Icon size={18} />
          </div>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          className="
            w-full
            h-14
            rounded-2xl
            border
            border-blue-100
            bg-white
            pl-12
            pr-12
            text-[15px]
            text-slate-900
            outline-none
            transition-all
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-500/10
          "
        />

        {rightElement}
      </div>
    </div>
  );
}
