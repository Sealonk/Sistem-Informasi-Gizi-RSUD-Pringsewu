import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PortalBackground from "../../components/portal/PortalBackground";
import PortalGreeting from "../../components/portal/PortalGreeting";
import PortalHeader from "../../components/portal/PortalHeader";
import PortalMenuGrid from "../../components/portal/PortalMenuGrid";
import { logoutUser } from "../../services/auth/authService";
import { ShieldCheck, HeartPulse, Zap, Award } from "lucide-react";
import "../../components/portal/portal.css";

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
        portal-page
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
      <main className="portal-main">
        <div className="portal-main-stack">
          <PortalGreeting />
          
          <PortalMenuGrid onOpenMenu={navigate} />

          {/* Premium Bottom Features & Tips Section */}
          <div className="portal-support-grid">
            
            {/* Dynamic Clinical Tips Widget */}
            <div className="portal-clinical">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                  <Award size={14} /> Edukasi Klinis Hari Ini
                </span>
              </div>
              
              <div className="portal-tip-text">
                <p className="text-slate-600 text-sm leading-relaxed">
                  "{tipsGizi[tipIndex]}"
                </p>
              </div>
              
              <div className="flex gap-1.5 justify-start">
                {tipsGizi.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Tampilkan edukasi ${i + 1}`}
                    aria-pressed={i === tipIndex}
                    onClick={() => setTipIndex(i)}
                    className="portal-tip-dot"
                  />
                ))}
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="portal-institution">
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
        <footer className="portal-footer">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Terintegrasi SIMRS RSUD Pringsewu</span>
          </div>
          <div className="text-center sm:text-right">
            <span>© 2026 Instalasi Gizi RSUD Pringsewu. All Rights Reserved.</span>
          </div>
        </footer>

      </main>
    </div>
  );
}
