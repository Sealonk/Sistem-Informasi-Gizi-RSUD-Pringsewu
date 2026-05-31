import { useEffect } from "react";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  LayoutDashboard,
} from "lucide-react";
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

export default function RingkasanHeader() {
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
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <LayoutDashboard size={24} />
          </div>

          <div className="flex-1">
            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
                mb-2
              "
            >
              Ringkasan Sistem
            </h1>

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
