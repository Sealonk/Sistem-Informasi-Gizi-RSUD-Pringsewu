import { Search } from "lucide-react";

export default function SearchPasien({
  value,
  onChange,
}) {
  return (

    <div
      className="
        relative
        w-full
        lg:w-[380px]
      "
    >

      {/* ICON */}
      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      {/* INPUT */}
      <input
        type="text"
        placeholder="Cari nama pasien / No RM"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          h-14
          rounded-2xl
          border
          border-blue-100
          bg-[#fcfdff]
          pl-12
          pr-4
          text-sm
          text-slate-700
          outline-none
          transition-all
          duration-300
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />

    </div>
  );
}