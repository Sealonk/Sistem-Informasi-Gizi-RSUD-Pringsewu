export default function SummaryPanel({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-soft ${className}`}
    >
      <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
