import {
  BarChart3,
} from "lucide-react";

export default function MakroChart({
  hasil,
}) {

  const data = [
  {
    label: "Protein",
    value:
      hasil?.protein || 0,
    persen:
      hasil?.proteinPersen || 0,
    color: "bg-blue-500",
  },
  {
    label: "Lemak",
    value:
      hasil?.lemak || 0,
    persen:
      hasil?.lemakPersen || 0,
    color: "bg-yellow-500",
  },
  {
    label: "Karbohidrat",
    value:
      hasil?.karbohidrat || 0,
    persen:
      hasil?.karbohidratPersen || 0,
    color:
      "bg-emerald-500",
  },
];

  const maxValue = Math.max(
    ...data.map(
      (item) => item.value
    ),
    1
  );

  return (

    <div
      className="
        rounded-[24px]
        border
        border-blue-100
        bg-white
        p-6
        shadow-sm
      "
    >

      {/* HEADER */}
      <div
        className="
          flex
          items-center
          gap-3
          mb-6
        "
      >

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-blue-50
            text-blue-600
            flex
            items-center
            justify-center
          "
        >

          <BarChart3 size={20} />

        </div>

        <div>

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
            "
          >
            Grafik Makronutrien
          </h3>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            Distribusi kebutuhan
            makronutrien pasien.
          </p>

        </div>

      </div>

      {/* CHART */}
      <div className="space-y-5">

        {data.map((item) => {

          const width =
            (item.value /
              maxValue) *
            100;

          return (

            <div
              key={item.label}
            >

              {/* LABEL */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-2
                "
              >

                <p
                  className="
                    text-sm
                    font-medium
                    text-slate-600
                  "
                >
                  {item.label}
                </p>

              <p
               className="
                text-sm
               font-semibold
               text-slate-900
  "
>
  {item.value} g
  <span className="ml-2 text-slate-500 font-medium">
    ({item.persen}%)
  </span>
</p>

              </div>

              {/* BAR */}
              <div
                className="
                  w-full
                  h-3
                  rounded-full
                  bg-slate-100
                  overflow-hidden
                "
              >

                <div
                  className={`
                    h-full
                    rounded-full
                    transition-all
                    duration-500
                    ${item.color}
                  `}
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}