import { HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  confirmColor = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-100/50",
  iconBg = "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-100/50",
  icon = <HelpCircle size={24} />
}) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-slate-900/60
        backdrop-blur-md
        px-4
        transition-opacity
        duration-300
        ease-out
        ${animate ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className={`
          w-full
          max-w-[380px]
          rounded-[32px]
          bg-white
          p-6
          sm:p-8
          shadow-2xl
          border
          border-slate-100/80
          relative
          overflow-hidden
          flex
          flex-col
          items-center
          text-center
          transition-all
          duration-300
          ease-out
          ${animate ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-4 opacity-0"}
        `}
      >
        {/* Decorative subtle light beam */}
        <div className="absolute top-[-50px] w-40 h-40 rounded-full bg-gradient-to-b from-slate-100/60 to-transparent blur-2xl pointer-events-none" />

        {/* Beautiful Icon Container */}
        <div
          className={`
            w-16
            h-16
            rounded-3xl
            flex
            items-center
            justify-center
            shrink-0
            shadow-lg
            mb-5
            relative
            z-10
            transition-transform
            duration-500
            ${animate ? "rotate-0 scale-100" : "-rotate-12 scale-90"}
            ${iconBg}
          `}
        >
          {icon}
        </div>

        {/* Text Details */}
        <div className="relative z-10 mb-6 w-full">
          <h3 className="text-lg font-extrabold text-slate-800 mb-2.5 tracking-tight">
            {title}
          </h3>
          <p className="text-xs leading-relaxed text-slate-400 font-bold px-2">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full relative z-10">
          <button
            type="button"
            onClick={onCancel}
            className="
              h-12
              rounded-2xl
              bg-slate-55
              hover:bg-slate-100/80
              text-slate-500
              hover:text-slate-700
              font-extrabold
              text-xs
              border
              border-slate-200/40
              transition-all
              duration-200
              active:scale-95
              cursor-pointer
              w-full
            "
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={`
              h-12
              rounded-2xl
              text-white
              font-extrabold
              text-xs
              transition-all
              duration-200
              shadow-lg
              active:scale-95
              cursor-pointer
              w-full
              ${confirmColor}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
