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
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-semibold">
          {getInitial()}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-slate-700">
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
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-20">
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
