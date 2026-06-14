export default function SummaryPanel({ title, children, className = "", action, icon: Icon }) {
  return (
    <section
      className={`
        relative
        overflow-hidden
        rounded-[32px] 
        border 
        border-slate-200/80 
        bg-white/75 
        backdrop-blur-md 
        p-6 
        shadow-sm 
        hover:shadow-md 
        hover:-translate-y-1
        transition-all 
        duration-300 
        ease-out
        ${className}
      `}
    >
      {/* Gradient accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-[32px]" />

      {/* Decorative glow circle */}
      <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 opacity-[0.03] blur-xl" />

      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Icon size={16} />
            </div>
          )}
          <h2 className="text-base font-bold text-slate-800 tracking-wide">
            {title}
          </h2>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}
