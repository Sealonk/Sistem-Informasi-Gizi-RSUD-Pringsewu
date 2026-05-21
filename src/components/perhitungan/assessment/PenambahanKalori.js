import { PlusCircle } from "lucide-react";

import SectionCard from "../../common/SectionCard";

export default function PenambahanKalori({
  data,
  setData,
}) {

  const isMale =
    data.jenisKelamin === "L";

  const handleToggle = (value) => {
    if (isMale) {
      return;
    }

    const current =
      data.penambahanKalori || [];

    const exists =
      current.includes(value);

    if (value === "tidak_ada") {
      setData({
        ...data,
        penambahanKalori: exists
          ? []
          : ["tidak_ada"],
      });

      return;
    }

    const nextValue = current.filter(
      (item) =>
        item !== "tidak_ada"
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
          ...nextValue,
          value,
        ],
      });
    }
  };

  const options = [
    {
      label: "Kehamilan",
      value: "kehamilan",
    },
    {
      label: "Menyusui",
      value: "menyusui",
    },
    {
      label:
        "Kondisi metabolik lain",
      value: "metabolik",
    },
    {
      label: "Tidak ada",
      value: "tidak_ada",
    },
  ];

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

      {/* OPTIONS */}
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
              disabled={isMale}
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

    </SectionCard>
  );
}
