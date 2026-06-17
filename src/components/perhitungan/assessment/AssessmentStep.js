import { CheckCircle2, ChevronRight } from "lucide-react";

export default function AssessmentStep({
  activeStep = 1,
}) {
  const isStepOneActive =
    activeStep === 1;
  const isStepTwoActive =
    activeStep === 2;

  return (
    <div
      className="
        bg-white/80
        backdrop-blur-md
        rounded-[28px]
        border
        border-emerald-100
        shadow-soft
        p-5
        sm:p-7
        mb-8
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-5
          flex-wrap
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <div
            className={`
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              ${
                isStepOneActive || isStepTwoActive
                  ? `
                    bg-emerald-600
                    text-white
                    shadow-lg
                    shadow-emerald-100
                  `
                  : `
                    bg-slate-100
                    text-slate-500
                  `
              }
            `}
          >
            <CheckCircle2 size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-1">Step 1</p>
            <h3
              className={`text-lg font-semibold ${
                isStepOneActive || isStepTwoActive
                  ? "text-slate-900"
                  : "text-slate-700"
              }`}
            >
              Assessment Pasien
            </h3>
          </div>
        </div>

        <div
          className={`
            flex
            items-center
            gap-4
            ${isStepTwoActive ? "" : "opacity-60"}
          `}
        >
          <div
            className={`
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              ${
                isStepTwoActive
                  ? `
                    bg-emerald-600
                    text-white
                    shadow-lg
                    shadow-emerald-100
                  `
                  : `
                    bg-slate-100
                    text-slate-500
                  `
              }
            `}
          >
            <ChevronRight size={24} />
          </div>

          <div>
            <p className="text-sm text-slate-500 mb-1">Step 2</p>
            <h3
              className={`text-lg font-semibold ${
                isStepTwoActive
                  ? "text-slate-900"
                  : "text-slate-700"
              }`}
            >
              Hasil Perhitungan
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
