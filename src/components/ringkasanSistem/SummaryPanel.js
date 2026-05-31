export default function SummaryPanel({ title, children, className = "", action }) {
  return (
    <section
      className={`
        rounded-[32px] 
        border 
        border-slate-200/80 
        bg-white/75 
        backdrop-blur-md 
        p-6 
        shadow-sm 
        hover:shadow-md 
        transition-all 
        duration-300 
        ease-out
        ${className}
      `}
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4">
        <h2 className="text-base font-bold text-slate-800 tracking-wide">
          {title}
        </h2>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}
