export default function DonutChart({
  items = [],
  centerLabel = "Total",
}) {

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
        h-36
        w-36
        shrink-0
        items-center
        justify-center
        rounded-full
      "
      style={{
        background:
          `conic-gradient(${gradient})`,
      }}
    >

      <div
        className="
          flex
          h-24
          w-24
          flex-col
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-inner
        "
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