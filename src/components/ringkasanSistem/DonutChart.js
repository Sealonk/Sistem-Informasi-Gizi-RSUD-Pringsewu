import { useState, useEffect } from "react";

export default function DonutChart({
  items = [],
  centerLabel = "Total",
}) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const total =
    items.reduce(
      (sum, item) =>
        sum + Number(item.value || 0),
      0
    );

  let cursor = 0;

  const gradient =
    items.length > 0
      ? items
          .map((item) => {

            const start = cursor;

            const end =
              cursor +
              (item.value / total) * 100;

            cursor = end;

            return `${item.color} ${start}% ${end}%`;
          })
          .join(", ")
      : "#e2e8f0 0% 100%";

  return (

    <div
      className="
        relative
        flex
        h-40
        w-40
        shrink-0
        items-center
        justify-center
        rounded-full
        shadow-lg
        shadow-blue-100/50
        ring-4
        ring-white
      "
      style={{
        background:
          `conic-gradient(${gradient})`,
        transform: mounted
          ? "rotate(0deg)"
          : "rotate(-90deg)",
        transition:
          "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >

      <div
        className="
          flex
          h-[104px]
          w-[104px]
          flex-col
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-inner
        "
        style={{
          transform: mounted
            ? "rotate(0deg)"
            : "rotate(90deg)",
          transition:
            "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >

        <span
          className="
            text-2xl
            font-extrabold
            text-slate-900
          "
        >
          {total}
        </span>

        <span
          className="
            text-xs
            font-semibold
            text-slate-500
          "
        >
          {centerLabel}
        </span>

      </div>

    </div>
  );
}