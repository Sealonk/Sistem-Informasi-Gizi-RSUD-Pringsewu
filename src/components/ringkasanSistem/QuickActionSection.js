import { useNavigate } from "react-router-dom";
import { quickActions } from "./ringkasanData";

export default function QuickActionSection() {
  const navigate = useNavigate();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4">
        <h2 className="text-sm font-extrabold text-slate-900">Aksi Cepat</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Lanjutkan pekerjaan utama dari ringkasan sistem.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {quickActions.map((item) => {
          const Icon = item.icon;
          const ActionIcon = item.actionIcon;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className="flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4 text-left transition-colors hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Icon size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>

              <ActionIcon size={18} className="shrink-0 text-blue-600" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
