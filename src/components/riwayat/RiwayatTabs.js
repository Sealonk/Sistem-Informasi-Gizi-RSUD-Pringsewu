import { Calculator } from "lucide-react";

export default function RiwayatTabs({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: "gizi",
      label: "Perhitungan Gizi",
      icon: <Calculator size={18} />,
    },
  ];

  return (
    <div
      className="
        rounded-[24px]
        border
        border-slate-200/80
        bg-white/75
        backdrop-blur-md
        p-2
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
        w-fit
      "
    >
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                h-10
                px-5
                rounded-[18px]
                text-sm
                font-bold
                flex
                items-center
                gap-2
                transition-all
                duration-200

                ${
                  isActive
                    ? `
                      bg-gradient-to-r
                      from-blue-500
                      to-indigo-600
                      text-white
                      shadow-md
                      shadow-blue-200/40
                    `
                    : `
                      bg-slate-50/50
                      text-slate-600
                      hover:bg-slate-100/80
                      hover:text-slate-900
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