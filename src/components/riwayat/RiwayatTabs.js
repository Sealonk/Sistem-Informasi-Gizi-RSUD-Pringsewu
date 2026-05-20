import {
  Calculator,
} from "lucide-react";

export default function RiwayatTabs({
  activeTab,
  setActiveTab,
}) {

  const tabs = [
    {
      id: "gizi",
      label:
        "Perhitungan Gizi",
      icon: (
        <Calculator
          size={18}
        />
      ),
    },
  ];

  return (

    <div
      className="
        rounded-[24px]
        border
        border-blue-100
        bg-white
        p-3
        shadow-sm
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
          flex-wrap
        "
      >

        {tabs.map((tab) => {

          const isActive =
            activeTab ===
            tab.id;

          return (

            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id
                )
              }
              className={`
                h-12
                px-5
                rounded-2xl
                text-sm
                font-semibold
                flex
                items-center
                gap-2
                transition-all

                ${
                  isActive
                    ? `
                      bg-blue-600
                      text-white
                      shadow-lg
                      shadow-blue-100
                    `
                    : `
                      bg-slate-50
                      text-slate-600
                      hover:bg-blue-50
                      hover:text-blue-600
                    `
                }
              `}
            >

              {tab.icon}

              {tab.label}

            </button>

          );
        })}

      </div>

    </div>
  );
}