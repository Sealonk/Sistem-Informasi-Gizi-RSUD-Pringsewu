import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./prediksi.css";

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

export default function PrediksiHeader({
  title = "Prediksi Pasien",
  description = "Prediksi jumlah pasien harian berdasarkan data historis menggunakan model AI.",
  backTo = "/portal",
  backLabel = "Kembali ke Portal",
}) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="prediction-panel prediction-header">
      <div className="prediction-header-main">
        <div className="prediction-title-group">
          <span className="prediction-header-icon"><TrendingUp size={25} aria-hidden="true" /></span>
          <div className="min-w-0">
            <div className="prediction-eyebrow">Beranda <span aria-hidden="true">/</span> Prediksi Pasien</div>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>
          </div>
        </div>
        <button type="button" onClick={() => navigate(backTo)} className="prediction-secondary shrink-0">
          <ArrowLeft size={16} aria-hidden="true" />{backLabel}
        </button>
      </div>
      <div className="prediction-header-meta">
        <span><CalendarDays size={14} aria-hidden="true" />{formatDate(currentTime)}</span>
        <span className="tabular-nums"><Clock3 size={14} aria-hidden="true" />{formatTime(currentTime)}</span>
      </div>
    </header>
  );
}
