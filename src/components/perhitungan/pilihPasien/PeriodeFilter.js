export default function PeriodeFilter({
  selected,
  onChange,
}) {

  const options = [
    "Hari Ini",
    "Mingguan",
    "Bulanan",
  ];

  return (
    <div
      className="
        flex
        items-center
        gap-3
        flex-wrap
      "
    >

      {options.map((option) => {

        const active =
          selected === option;

        return (

          <button
            key={option}
            onClick={() =>
              onChange(option)
            }
            className={`
              h-12
              px-6
              rounded-2xl
              text-sm
              font-medium
              transition-all
              duration-300

              ${
                active
                  ? `
                    bg-blue-600
                    text-white
                    shadow-lg
                    shadow-blue-100
                  `
                  : `
                    bg-blue-50
                    text-blue-600
                    hover:bg-blue-100
                  `
              }
            `}
          >
            {option}
          </button>

        );
      })}
    </div>
  );
}