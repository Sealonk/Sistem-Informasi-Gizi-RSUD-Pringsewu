import { PlusCircle } from "lucide-react";

import SectionCard from "../../common/SectionCard";

export default function PenambahanKalori({
  data,
  setData,
}) {

  const handleToggle = (value) => {

    const current =
      data.penambahanKalori || [];

    const exists =
      current.includes(value);

    if (exists) {

      setData({
        ...data,
        penambahanKalori:
          current.filter(
            (item) =>
              item !== value
          ),
      });

    } else {

      setData({
        ...data,
        penambahanKalori: [
          ...current,
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
      label: "Lainnya",
      value: "lainnya",
    },
  ];

  return (

    <SectionCard
      compact={true}
      title="Penambahan Energi"
      subtitle="Tambahan kebutuhan energi pasien"
      icon={<PlusCircle size={20} />}
    >

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
              className={`
                h-11
                px-4
                rounded-xl
                border
                text-sm
                font-medium
                transition-all
                duration-300

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

      {/* INPUT LAINNYA */}
      {data.penambahanKalori?.includes(
        "lainnya"
      ) && (

        <div className="mt-5">

          <input
            type="text"
            placeholder="Sebutkan kondisi tambahan..."
            value={
              data.kaloriLainnya ||
              ""
            }
            onChange={(e) =>
              setData({
                ...data,
                kaloriLainnya:
                  e.target.value,
              })
            }
            className="
              w-full
              h-12
              rounded-2xl
              border
              border-blue-100
              bg-white
              px-4
              text-sm
              text-slate-700
              outline-none
              transition-all

              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
            "
          />

        </div>

      )}

    </SectionCard>
  );
}