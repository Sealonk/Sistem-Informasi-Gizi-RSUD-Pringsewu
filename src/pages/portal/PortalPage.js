import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PortalBackground from "../../components/portal/PortalBackground";
import PortalGreeting from "../../components/portal/PortalGreeting";
import PortalHeader from "../../components/portal/PortalHeader";
import PortalMenuGrid from "../../components/portal/PortalMenuGrid";
import { logoutUser } from "../../services/authService";

export default function PortalPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#f8fbff]
        relative
        overflow-hidden
      "
    >
      <PortalBackground />

      <div
        className="
          relative
          z-10
          px-6
          py-8
          max-w-7xl
          mx-auto
        "
      >
        <PortalHeader
          showUserMenu={showUserMenu}
          onToggleUserMenu={() => setShowUserMenu((current) => !current)}
          onLogout={handleLogout}
        />

        <PortalGreeting />

        <PortalMenuGrid onOpenMenu={navigate} />
      </div>
    </div>
  );
}
