import PortalUserMenu from "./PortalUserMenu";

export default function PortalHeader({
  showUserMenu,
  onToggleUserMenu,
  onLogout,
}) {
  return (
    <div className="portal-topbar">
      <div className="portal-topbar-inner">
        <div className="portal-brand">
          <img
            src="/img/logo-pringsewu.png"
            alt="Logo RSUD Pringsewu"
            className="portal-brand-logo"
          />
          <div>
            <h1 className="portal-brand-title">
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
