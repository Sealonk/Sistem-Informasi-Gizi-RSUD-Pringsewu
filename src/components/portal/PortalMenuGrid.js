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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {menus.map((menu) => (
        <PortalMenuCard
          key={menu.path}
          menu={menu}
          onOpen={onOpenMenu}
        />
      ))}
    </div>
  );
}
