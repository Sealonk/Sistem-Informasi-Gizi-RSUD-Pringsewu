import { ArrowUpRight, ArrowRight } from "lucide-react";

const themes = {
  "/ringkasan-sistem": { color: "indigo", label: "Dashboard Ringkasan" },
  "/perhitungan": { color: "emerald", label: "Kalkulasi Kebutuhan" },
  "/prediksi-pasien": { color: "violet", label: "Prediksi & Analisis" },
  "/riwayat": { color: "blue", label: "Riwayat Perhitungan" },
  "/manajemen-user": { color: "cyan", label: "Kontrol Admin" },
};

export default function PortalMenuCard({ menu, onOpen }) {
  const Icon = menu.icon;
  const theme = themes[menu.path] || { color: "blue", label: "Modul" };
  return (
    <button type="button" onClick={() => onOpen(menu.path)}
      className={`portal-module portal-module--${theme.color}${menu.requiredRole ? " portal-module--admin" : ""}`}>
      <span className="portal-module-top">
        <span className="portal-module-icon"><Icon size={27} strokeWidth={1.7} aria-hidden="true" /></span>
        <ArrowUpRight size={19} className="portal-module-corner" aria-hidden="true" />
      </span>
      <span className="portal-module-content">
        <span className="portal-module-category">{theme.label}</span>
        <span className="portal-module-title">{menu.title}</span>
        <span className="portal-module-description">{menu.description}</span>
      </span>
      <span className="portal-module-action">Akses Modul <ArrowRight size={16} aria-hidden="true" /></span>
    </button>
  );
}
