import { Droplets } from "lucide-react";

import SectionCard from "../../common/SectionCard";

export default function Hemodialisa({
  data,
  setData,
  errors = {},
  showErrors = false,
}) {

  const isCKD =
    data.penyakit?.includes("ckd");

  const handleSelect = (value) => {

    if (!isCKD) return;

    setData({
      ...data,
      hemodialisa: value,
    });
  };

  return (

    <SectionCard
      title="Hemodialisa"
      subtitle="Pilihan hemodialisa hanya aktif untuk pasien dengan CKD karena mempengaruhi kebutuhan protein"
      icon={<Droplets size={26} />}
      theme="emerald"
    >

      {!isCKD && (

        <div
          className="
            mb-6
            rounded-2xl
            border
            border-amber-200
            bg-amber-50
            px-5
            py-4
          "
        >

          <p
            className="
              text-sm
              text-amber-700
              leading-relaxed
            "
          >
            Hemodialisa hanya dapat dipilih
            jika pasien memiliki penyakit CKD.
          </p>

        </div>

      )}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
        "
      >

        {/* YA */}
        <button
          type="button"
          disabled={!isCKD}
          onClick={() =>
            handleSelect("Ya")
          }
          className={`
            relative
            overflow-hidden
            rounded-[28px]
            border
            p-6
            text-left
            transition-all
            duration-300

            ${
              data.hemodialisa ===
                "Ya" && isCKD
                ? `
                  border-emerald-500
                  bg-gradient-to-br
                  from-emerald-50
                  to-white
                  shadow-lg
                  shadow-emerald-100
                `
                : `
                  border-slate-200
                  bg-white/80
                `
            }

            ${
              !isCKD
                ? `
                  opacity-50
                  cursor-not-allowed
                `
                : `
                  hover:border-emerald-250
                  hover:bg-emerald-50/20
                  hover:-translate-y-1
                `
            }
          `}
        >

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
              mb-2
            "
          >
            Ya Hemodialisa
          </h3>

          <p
            className="
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Pasien menjalani terapi
            hemodialisa rutin.
          </p>

        </button>

        {/* TIDAK */}
        <button
          type="button"
          disabled={!isCKD}
          onClick={() =>
            handleSelect("Tidak")
          }
          className={`
            relative
            overflow-hidden
            rounded-[28px]
            border
            p-6
            text-left
            transition-all
            duration-300

            ${
              data.hemodialisa ===
                "Tidak" && isCKD
                ? `
                  border-emerald-500
                  bg-gradient-to-br
                  from-emerald-50
                  to-white
                  shadow-lg
                  shadow-emerald-100
                `
                : `
                  border-slate-200
                  bg-white/80
                `
            }

            ${
              !isCKD
                ? `
                  opacity-50
                  cursor-not-allowed
                `
                : `
                  hover:border-emerald-250
                  hover:bg-emerald-50/20
                  hover:-translate-y-1
                `
            }
          `}
        >

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
              mb-2
            "
          >
            Tidak Hemodialisa
          </h3>

          <p
            className="
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Pasien tidak menjalani
            terapi hemodialisa.
          </p>

        </button>

      </div>

      {showErrors && errors.hemodialisa && (
        <p className="mt-3 text-xs font-medium text-rose-600">
          ! {errors.hemodialisa}
        </p>
      )}

    </SectionCard>
  );
}