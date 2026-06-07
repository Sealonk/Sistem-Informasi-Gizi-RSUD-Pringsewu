import { PlusCircle } from "lucide-react";

import SectionCard from "../../common/SectionCard";

export default function PenambahanKalori({
  data,
  setData,
  disabled = false,
}) {

  const isMale =
    data.jenisKelamin === "L";

  const isDM = data.penyakit?.includes("dm");

  const handleToggle = (value) => {

    if (isMale || disabled) {
      return;
    }

    const current =
      data.penambahanKalori || [];

    const exists =
      current.includes(value);

    if (value === "Tidak ada") {

      setData({
        ...data,
        penambahanKalori: exists
          ? []
          : ["Tidak ada"],
      });

      return;
    }

    const nextValue = current.filter(
      (item) =>
        item !== "Tidak ada"
    );

    if (exists) {

      setData({
        ...data,
        penambahanKalori:
          nextValue.filter(
            (item) =>
              item !== value
          ),
      });

    } else {

      setData({
        ...data,
        penambahanKalori: [
          value,
        ],
      });
    }
  };

  const options = [
    {
      label: "Trimester 1",
      value: "Trimester 1",
    },
    {
      label: "Trimester 2",
      value: "Trimester 2",
    },
    {
      label: "Trimester 3",
      value: "Trimester 3",
    },
    {
      label: "Tidak ada",
      value: "Tidak ada",
    },
  ];

  const getDescription = () => {
    if (isMale) {
      return "Penambahan energi hanya berlaku untuk pasien perempuan (kehamilan).";
    }
    if (disabled) {
      return "Tidak diperlukan untuk kondisi klinis ini.";
    }

    const selected = data.penambahanKalori || [];

    if (isDM) {
      if (selected.includes("Trimester 1")) {
        return "Trimester 1 — Penambahan energi sebesar 180 kkal.";
      }
      if (selected.includes("Trimester 2")) {
        return "Trimester 2 — Penambahan energi sebesar 300 kkal.";
      }
      if (selected.includes("Trimester 3")) {
        return "Trimester 3 — Penambahan energi sebesar 300 kkal.";
      }
      if (selected.includes("Tidak ada")) {
        return "Tidak ada penambahan energi dari kehamilan.";
      }

      return (
        <span>
          Pilihan penambahan energi:
          <br />• Trimester 1 (180 kkal)
          <br />• Trimester 2 (300 kkal)
          <br />• Trimester 3 (300 kkal)
          <br />• Tidak ada
        </span>
      );
    } else {
      if (selected.includes("Trimester 1")) {
        return "Trimester 1 — Penambahan energi sebesar 300 kkal.";
      }
      if (selected.includes("Trimester 2")) {
        return "Trimester 2 — Penambahan energi sebesar 300 kkal.";
      }
      if (selected.includes("Trimester 3")) {
        return "Trimester 3 — Penambahan energi sebesar 500 kkal.";
      }
      if (selected.includes("Tidak ada")) {
        return "Tidak ada penambahan energi dari kehamilan.";
      }

      return (
        <span>
          Pilihan penambahan energi:
          <br />• Trimester 1 (300 kkal)
          <br />• Trimester 2 (300 kkal)
          <br />• Trimester 3 (500 kkal)
          <br />• Tidak ada
        </span>
      );
    }
  };

  return (

    <SectionCard
      compact={true}
      title="Penambahan Energi"
      subtitle="Tambahan kebutuhan energi pasien"
      icon={<PlusCircle size={20} />}
    >

      {isMale && (
        <div
          className="
            mb-4
            rounded-2xl
            border
            border-slate-100
            bg-slate-50
            px-4
            py-3
            text-sm
            font-medium
            text-slate-500
          "
        >
          Penambahan energi tidak tersedia untuk pasien laki-laki.
        </div>
      )}

      {disabled && !isMale && (
        <div
          className="
            mb-4
            rounded-2xl
            border
            border-slate-100
            bg-slate-50
            px-4
            py-3
            text-sm
            font-medium
            text-slate-500
          "
        >
          Penambahan energi di-disable untuk kondisi klinis ini.
        </div>
      )}

      <div
        className="
          flex
          flex-wrap
          gap-3
        "
      >

        {options.map((item) => {

          const active =
            data.penambahanKalori?.includes(
              item.value
            );

          return (

            <button
              key={item.value}
              type="button"
              onClick={() =>
                handleToggle(item.value)
              }
              disabled={isMale || disabled}
              className={`
                h-11
                px-4
                rounded-xl
                border
                text-sm
                font-medium
                transition-all
                duration-300
                disabled:cursor-not-allowed
                disabled:opacity-50

                ${
                  active
                    ? `
                      border-blue-500
                      bg-blue-50
                      text-blue-700
                    `
                    : `
                      border-blue-100
                      bg-white
                      text-slate-600
                      hover:bg-blue-50
                    `
                }
              `}
            >
              {item.label}
            </button>

          );
        })}

      </div>

      <p
        className="
          mt-4
          text-sm
          leading-relaxed
          text-slate-500
        "
      >
        {getDescription()}
      </p>

    </SectionCard>
  );
}