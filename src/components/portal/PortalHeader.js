import PortalUserMenu from "./PortalUserMenu";

export default function PortalHeader({
  showUserMenu,
  onToggleUserMenu,
  onLogout,
}) {
  return (
    <div className="bg-white border-b border-slate-200 mb-10">
      <div className="px-6 py-5 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/img/logo-pringsewu.png"
            alt="Logo RSUD Pringsewu"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-sm font-semibold text-slate-700">
              RSUD PRINGSEWU
            </h1>
            <p className="text-xs text-slate-500">
              Sistem Informasi Instalasi Gizi
            </p>
          </div>
        </div>

        <PortalUserMenu
          showUserMenu={showUserMenu}
          onToggleUserMenu={onToggleUserMenu}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
}
