import { useNavigate } from "react-router-dom";

export default function SuccessModal({ isOpen }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-[28px]
          bg-white
          p-7
          shadow-2xl
        "
      >
        {/* TITLE */}
        <h3
          className="
            text-2xl
            font-bold
            text-slate-900
            mb-3
          "
        >
          Riwayat Berhasil Disimpan
        </h3>

        {/* DESC */}
        <p
          className="
            text-sm
            leading-relaxed
            text-slate-500
            mb-7
          "
        >
          Data hasil perhitungan pasien telah berhasil disimpan ke riwayat perhitungan gizi.
        </p>

        {/* ACTION */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
          "
        >
          {/* PORTAL */}
          <button
            onClick={() => navigate("/portal")}
            className="
              flex-1
              h-12
              rounded-2xl
              bg-slate-100
              text-slate-700
              text-sm
              font-semibold
              hover:bg-slate-200
              transition-all
            "
          >
            Portal
          </button>

          {/* HITUNG LAGI */}
          <button
            onClick={() => navigate("/perhitungan")}
            className="
              flex-1
              h-12
              rounded-2xl
              bg-blue-50
              text-blue-600
              text-sm
              font-semibold
              hover:bg-blue-100
              transition-all
            "
          >
            Hitung Lagi
          </button>

          {/* RIWAYAT */}
          <button
            onClick={() => navigate("/riwayat")}
            className="
              flex-1
              h-12
              rounded-2xl
              bg-blue-600
              text-white
              text-sm
              font-semibold
              hover:bg-blue-700
              transition-all
            "
          >
            Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}
