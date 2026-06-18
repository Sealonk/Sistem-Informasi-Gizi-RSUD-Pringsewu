import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function UserManagementHeader({ onBack }) {
  return (
    <header className="relative z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Portal
        </button>

        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Administrator
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              Manajemen User
            </h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>
    </header>
  );
}
