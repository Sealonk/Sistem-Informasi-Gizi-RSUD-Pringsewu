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
    <section className="portal-welcome" aria-labelledby="portal-welcome-title">
      <div className="portal-welcome-content">
        <div className="portal-access-badge"><Sparkles size={13} aria-hidden="true" />Akses Portal Aktif</div>
        <h2 id="portal-welcome-title">{getGreeting()},<br /><span>{user?.nama_lengkap || "Petugas Gizi"}</span></h2>
        <p>Silakan pilih modul pelayanan di bawah ini untuk mengelola data status gizi, melakukan asuhan gizi klinis, atau memantau laporan statistik pasien.</p>
      </div>
      <div className="portal-clock">
        <span className="portal-clock-icon"><Clock size={22} strokeWidth={1.6} aria-hidden="true" /></span>
        <div><p className="portal-kicker">Waktu Saat Ini</p><p className="portal-clock-time">{getFormattedTime()}</p><p className="portal-clock-date">{getFormattedDate()}</p></div>
      </div>
    </section>
  );
}
