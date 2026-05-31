import { Calculator } from "lucide-react";

import SectionCard from "../../common/SectionCard";

export default function MetodePerhitungan() {

  return (

    <SectionCard
      compact={true}
      title="Metode Perhitungan"
      subtitle="Metode kebutuhan energi yang digunakan sistem"
      icon={<Calculator size={20} />}
    >

      <div
        className="
          rounded-2xl
          border
          border-blue-100
          bg-blue-50/70
          px-5
          py-4
        "
      >

        <h3
          className="
            text-sm
            font-semibold
            text-blue-800
            mb-2
          "
        >
          Mifflin St Jeor
        </h3>

        <p
          className="
            text-sm
            leading-relaxed
            text-blue-700
          "
        >
          Sistem menggunakan metode
          Mifflin St Jeor untuk menghitung
          kebutuhan energi dan makronutrien pasien.
        </p>

      </div>

    </SectionCard>
  );
}