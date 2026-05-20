export default function SectionCard({
  title,
  subtitle,
  icon,
  children,
  compact = false,
}) {

  return (

    <div
      className={`
        relative
        overflow-hidden
        bg-white/80
        backdrop-blur-md
        border
        border-blue-100
        shadow-soft

        ${
          compact
            ? `
              rounded-[24px]
              p-5
            `
            : `
              rounded-[32px]
              p-8
            `
        }
      `}
    >

      {/* GLOW */}
      <div
        className={`
          absolute
          rounded-full
          blur-3xl
          pointer-events-none

          ${
            compact
              ? `
                top-[-40px]
                right-[-40px]
                w-[120px]
                h-[120px]
              `
              : `
                top-[-60px]
                right-[-60px]
                w-[180px]
                h-[180px]
              `
          }

          bg-blue-100/40
        `}
      />

      {/* CONTENT */}
      <div className="relative z-10">

        {/* HEADER */}
        <div
          className={`
            flex
            items-start
            gap-4

            ${
              compact
                ? "mb-5"
                : "mb-8"
            }
          `}
        >

          {/* ICON */}
          <div
            className={`
              rounded-2xl
              bg-blue-50
              text-blue-600
              flex
              items-center
              justify-center
              shrink-0

              ${
                compact
                  ? `
                    w-11
                    h-11
                  `
                  : `
                    w-14
                    h-14
                  `
              }
            `}
          >
            {icon}
          </div>

          {/* TITLE */}
          <div>

            <h2
              className={`
                font-bold
                tracking-tight
                text-slate-900
                mb-1

                ${
                  compact
                    ? "text-lg"
                    : "text-2xl"
                }
              `}
            >
              {title}
            </h2>

            {subtitle && (

              <p
                className={`
                  leading-relaxed
                  text-slate-500

                  ${
                    compact
                      ? "text-xs"
                      : "text-sm"
                  }
                `}
              >
                {subtitle}
              </p>

            )}

          </div>

        </div>

        {/* BODY */}
        <div>
          {children}
        </div>

      </div>

    </div>
  );
}