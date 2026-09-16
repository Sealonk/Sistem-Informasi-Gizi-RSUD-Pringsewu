import PortalMenuCard from "./PortalMenuCard";
import { portalMenus } from "./portalMenuData";
import { getUser } from "../../services/auth/authService";

export default function PortalMenuGrid({ onOpenMenu }) {
  const user = getUser();
  const menus = portalMenus.filter((menu) => {
    if (!menu.requiredRole) {
      return true;
    }

    return user?.role === menu.requiredRole;
  });

  return (
    <section aria-labelledby="portal-modules-title">
      <div className="portal-section-heading">
        <div><p className="portal-kicker">RUANG KERJA</p><h2 id="portal-modules-title">Modul Pelayanan</h2></div>
        <p>Pilih modul untuk memulai aktivitas Anda.</p>
      </div>
      <div className="portal-module-grid">
      {menus.map((menu) => (
        <PortalMenuCard
          key={menu.path}
          menu={menu}
          onOpen={onOpenMenu}
        />
      ))}
    </div>
    </section>
  );
}
