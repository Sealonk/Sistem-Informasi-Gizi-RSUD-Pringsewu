import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PortalBackground from "../../components/portal/PortalBackground";
import PortalGreeting from "../../components/portal/PortalGreeting";
import PortalHeader from "../../components/portal/PortalHeader";
import PortalMenuGrid from "../../components/portal/PortalMenuGrid";
import { logoutUser } from "../../services/auth/authService";
import { ShieldCheck, HeartPulse, Zap, Award } from "lucide-react";

export default function PortalPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tipsGizi = [
    "Pasien CKD non-hemodialisa direkomendasikan mendapat asupan protein rendah (0.8 g/kg BBI) untuk meringankan beban kerja ginjal.",
    "Bagi pasien Diabetes Melitus, penambahan kalori kehamilan disesuaikan dengan Trimester (TM1: +300 kkal, TM3: +500 kkal).",
    "Metode Mifflin St Jeor merupakan metode gold-standard untuk menghitung BMR pada pasien obesitas dewasa.",
    "Untuk estimasi berat badan pasien tirah baring, ukur LILA (Lingkar Lengan Atas) dengan pita Antropometri standar RSUD.",
    "Pemberian diet pada pasien stroke fase akut diutamakan bentuk cair atau saring untuk mencegah risiko aspirasi."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((current) => (current + 1) % tipsGizi.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tipsGizi.length]);

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
        flex
        flex-col
      "
    >
      <PortalBackground />

      {/* Header Container */}
      <PortalHeader
        showUserMenu={showUserMenu}
        onToggleUserMenu={() => setShowUserMenu((current) => !current)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div
        className="
          relative
          z-10
          px-6
          pb-12
          max-w-7xl
          w-full
          mx-auto
          flex-1
          flex
          flex-col
          justify-between
          gap-10
        "
      >
        <div className="space-y-6">
          <PortalGreeting />
          
          <PortalMenuGrid onOpenMenu={navigate} />

          {/* Premium Bottom Features & Tips Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            
            {/* Dynamic Clinical Tips Widget */}
            <div className="lg:col-span-2 relative overflow-hidden bg-white/70 backdrop-blur-md border border-blue-100 rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  <Award size={14} /> Edukasi Klinis Hari Ini
                </span>
              </div>
              
              <div className="h-16 flex items-center">
                <p className="text-slate-700 text-sm font-medium leading-relaxed italic transition-opacity duration-500">
                  "{tipsGizi[tipIndex]}"
                </p>
              </div>
              
              <div className="flex gap-1.5 justify-start">
                {tipsGizi.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTipIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === tipIndex ? "w-6 bg-blue-600" : "w-1.5 bg-blue-100 hover:bg-blue-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-lg shadow-blue-500/10 flex flex-col justify-between gap-6 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/5 blur-xl group-hover:scale-125 transition-transform duration-500" />
              
              <div className="space-y-2">
                <h4 className="text-lg font-bold">Instalasi Gizi RSUD</h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Platform perhitungan kebutuhan makronutrien otomatis, terintegrasi rekam medis secara presisi.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-1 text-sky-200">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-blue-100 uppercase">Aman</span>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-1 text-sky-200">
                    <HeartPulse size={18} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-blue-100 uppercase">Akurat</span>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-1 text-sky-200">
                    <Zap size={18} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-blue-100 uppercase">Cepat</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Premium Brand Footer */}
        <footer className="border-t border-slate-200/80 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Terintegrasi SIMRS RSUD Pringsewu</span>
          </div>
          <div className="text-center sm:text-right">
            <span>© 2026 Instalasi Gizi RSUD Pringsewu. All Rights Reserved.</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
