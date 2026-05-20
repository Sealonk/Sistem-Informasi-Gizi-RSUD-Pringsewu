export default function CheckboxGroup({
  label,
  options = [],
  values = [],
  onChange,
}) {

  const handleToggle = (value) => {

    if (values.includes(value)) {

      onChange(
        values.filter(
          (item) => item !== value
        )
      );

    } else {

      onChange([
        ...values,
        value,
      ]);

    }
  };

  return (

    <div className="w-full">

      {/* LABEL */}
      <label
        className="
          block
          text-sm
          font-semibold
          text-slate-700
          mb-4
        "
      >
        {label}
      </label>

      {/* OPTIONS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
        "
      >

        {options.map((option) => {

          const checked =
            values.includes(option.value);

          return (

            <label
              key={option.value}
              className={`
                relative
                flex
                items-center
                gap-3
                rounded-2xl
                border
                p-4
                cursor-pointer
                transition-all
                duration-300

                ${
                  checked
                    ? `
                      border-blue-500
                      bg-blue-50
                    `
                    : `
                      border-blue-100
                      bg-white
                      hover:bg-blue-50/50
                    `
                }
              `}
            >

              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  handleToggle(option.value)
                }
                className="
                  w-5
                  h-5
                  accent-blue-600
                  rounded
                "
              />

              {/* TEXT */}
              <span
                className="
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                {option.label}
              </span>

            </label>

          );
        })}

      </div>

    </div>
  );
}