import PortalMenuCard from "./PortalMenuCard";
import { portalMenus } from "./portalMenuData";

export default function PortalMenuGrid({ onOpenMenu }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-10">
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
