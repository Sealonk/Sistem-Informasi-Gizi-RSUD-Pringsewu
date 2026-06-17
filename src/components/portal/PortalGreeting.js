import { useEffect, useState } from "react";
import { Clock, Sparkles } from "lucide-react";
import { getUser } from "../../services/auth/authService";

export default function PortalGreeting() {
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const userData = getUser();
    if (userData) {
      setUser(userData);
    }
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const getFormattedDate = () => {
    return time.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getFormattedTime = () => {
    return time.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WIB";
  };

  return (
    <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-3">
        {/* Welcome Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600 animate-pulse">
          <Sparkles size={12} className="text-blue-500" />
          <span>Akses Portal Aktif</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
            {user?.nama_lengkap || "Petugas Gizi"}
          </span>
        </h2>
        
        <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
          Silakan pilih modul pelayanan di bawah ini untuk mengelola data status gizi, melakukan asuhan gizi klinis, atau memantau laporan statistik pasien.
        </p>
      </div>

      {/* Date & Time Widget */}
      <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md border border-slate-200/80 px-6 py-4 rounded-[24px] shadow-sm shadow-blue-50/50 hover:shadow-md transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Clock size={22} className="animate-spin-slow" />
        </div>
        <div className="text-left">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-0.5">Waktu Server</p>
          <p className="text-sm font-bold text-slate-800 leading-none mb-1">{getFormattedTime()}</p>
          <p className="text-xs text-slate-500 font-medium">{getFormattedDate()}</p>
        </div>
      </div>
    </div>
  );
}
