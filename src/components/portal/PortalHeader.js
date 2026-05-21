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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
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
