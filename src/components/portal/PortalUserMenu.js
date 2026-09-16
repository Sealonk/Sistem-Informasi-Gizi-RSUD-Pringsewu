import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { getUser } from "../../services/auth/authService";

export default function PortalUserMenu({
  showUserMenu,
  onToggleUserMenu,
  onLogout,
}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const getInitial = () => {
    if (user?.nama_lengkap) {
      return user.nama_lengkap.trim().charAt(0).toUpperCase();
    }
    return "P";
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggleUserMenu}
        aria-expanded={showUserMenu}
        aria-controls="portal-user-dropdown"
        aria-label="Menu akun"
        className="portal-account-button"
      >
        <div className="portal-avatar">
          {getInitial()}
        </div>
        <span className="hidden max-w-[180px] truncate text-sm font-semibold text-slate-700 sm:inline">
          {user?.nama_lengkap || "Petugas Gizi"}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${
            showUserMenu ? "rotate-180" : ""
          }`}
        />
      </button>

      {showUserMenu && (
        <div id="portal-user-dropdown" className="portal-account-dropdown">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
