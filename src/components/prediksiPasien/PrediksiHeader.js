import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function PrediksiHeader() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header
      className="
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
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-violet-50
              text-violet-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <TrendingUp size={24} />
          </div>

          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-400 mb-1 tracking-wider uppercase">
              Beranda &gt; Prediksi Pasien
            </div>
            
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                mb-2
              "
            >
              Prediksi Pasien
            </h1>

            <p
              className="
                text-sm
                text-slate-500
                mb-4
              "
            >
              Masukkan total jumlah pasien dalam 1 bulan, kemudian sistem akan memprediksi jumlah pasien per hari.
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
                  bg-violet-50
                  text-violet-600
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
                  bg-violet-50
                  text-violet-600
                  text-sm
                  font-medium
                "
              >
                <Clock3 size={16} />
                {formatTime(currentTime)}
              </div>
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
            border-violet-200
            bg-white
            text-violet-600
            text-sm
            font-semibold
            flex
            items-center
            gap-2
            hover:bg-violet-50
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
