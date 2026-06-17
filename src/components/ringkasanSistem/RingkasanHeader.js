import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/auth/authService";

const formatDate = (date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
};

const formatTime = (date) => {
  return `${new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date)} WIB`;
};

export default function RingkasanHeader() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const userData = getUser();
    if (userData) {
      setUser(userData);
    }

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        p-6
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
      "
    >
      {/* Decorative gradient accent bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-[32px]" />

      <div
        className="
          flex
          items-start
          justify-between
          gap-6
          flex-wrap
        "
      >
        <div className="flex items-start gap-4">
          {/* Gradient icon box */}
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              text-white
              flex
              items-center
              justify-center
              shrink-0
              shadow-lg
              shadow-blue-500/20
            "
          >
            <LayoutDashboard size={24} />
          </div>

          <div className="flex-1">
            {/* Breadcrumb */}
            <p className="text-xs font-medium text-slate-400 mb-1.5 tracking-wide">
              Beranda &gt; Ringkasan Sistem
            </p>

            <div className="flex items-center gap-3 mb-2">
              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                "
              >
                Ringkasan Sistem
              </h1>

              {/* Live Dashboard badge */}
              <div
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  px-3
                  py-1
                  rounded-full
                  bg-emerald-50
                  border
                  border-emerald-200/80
                  text-xs
                  font-semibold
                  text-emerald-600
                "
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live Dashboard
              </div>
            </div>

            <p
              className="
                text-sm
                text-slate-500
                mb-4
              "
            >
              Ringkasan informasi perhitungan gizi pasien.
            </p>

            <div className="flex flex-wrap gap-3">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  text-sm
                  font-medium
                "
              >
                <CalendarDays size={16} />
                {formatDate(currentTime)}
              </div>

              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  text-sm
                  font-medium
                "
              >
                <Clock3 size={16} />
                {formatTime(currentTime)}
              </div>

              {/* User name pill badge */}
              {user?.nama_lengkap && (
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    bg-indigo-50
                    text-indigo-600
                    text-sm
                    font-medium
                  "
                >
                  <User size={16} />
                  {user.nama_lengkap}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/portal")}
          className="
            h-12
            px-5
            rounded-2xl
            border
            border-blue-200
            bg-white
            text-blue-600
            text-sm
            font-semibold
            flex
            items-center
            gap-2
            hover:bg-blue-50
            transition-all
          "
        >
          <ArrowLeft size={18} />
          Kembali ke Portal
        </button>
      </div>
    </header>
  );
}
