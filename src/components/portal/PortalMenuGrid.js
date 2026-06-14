import PortalMenuCard from "./PortalMenuCard";
import { portalMenus } from "./portalMenuData";

export default function PortalMenuGrid({ onOpenMenu }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {portalMenus.map((menu) => (
        <PortalMenuCard
          key={menu.path}
          menu={menu}
          onOpen={onOpenMenu}
        />
      ))}
    </div>
  );
}
