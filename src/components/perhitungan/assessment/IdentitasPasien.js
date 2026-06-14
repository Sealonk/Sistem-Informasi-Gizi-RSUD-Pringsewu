import { User } from "lucide-react";

import SectionCard from "../../common/SectionCard";
import InputField from "../../common/InputField";

export default function IdentitasPasien({
  data,
  setData,
  errors = {},
  showErrors = false,
}) {

  /* KELOMPOK UMUR */
  const getKelompokUmur = (umur) => {

    const u = parseInt(umur);

    if (u <= 5)
      return "Balita (0 - 5 Tahun)";

    if (u <= 11)
      return "Anak-anak (6 - 11 Tahun)";

    if (u <= 18)
      return "Remaja (12 - 18 Tahun)";

    if (u <= 59)
      return "Dewasa (19 - 59 Tahun)";

    return "Lansia (≥ 60 Tahun)";
  };

  return (

    <SectionCard
      title="Identitas Pasien"
      subtitle="Lengkapi informasi dasar pasien sebelum melakukan assessment gizi"
      icon={<User size={26} />}
      theme="emerald"
    >

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-2 mb-6">
        {/* NAMA */}
        <div>
          <InputField
            label="Nama Pasien"
            placeholder="Masukkan nama pasien"
            value={data.nama}
            readOnly
            onChange={(value) => setData({ ...data, nama: value })}
            error={showErrors ? errors.nama : ""}
          />
        </div>

        {/* NO RM */}
        <div>
          <InputField
            label="Nomor Rekam Medis"
            placeholder="Masukkan nomor RM"
            value={data.noRM}
            readOnly
            onChange={(value) => setData({ ...data, noRM: value })}
            error={showErrors ? errors.noRM : ""}
          />
        </div>

        {/* UMUR */}
        <div>
          <InputField
            label="Umur"
            type="number"
            placeholder="Masukkan umur"
            suffix="Tahun"
            value={data.umur}
            readOnly
            onChange={(value) => setData({ ...data, umur: value })}
            error={
            errors.umur &&
               Number(data.umur) < 19
               ? errors.umur
               : showErrors
               ? errors.umur
               : ""
}
          />
        </div>

        {/* KELOMPOK UMUR */}
        <InputField
          label="Kelompok Umur"
          value={data.umur ? getKelompokUmur(data.umur) : ""}
          readOnly
        />
      </div>

      {/* JENIS KELAMIN */}
      <div className="mt-8">
      
        <label
          className="
            block
            text-sm
            font-semibold
            text-slate-700
            mb-4
          "
        >
          Jenis Kelamin
        </label>

        <div
          className="
            flex
            items-center
            gap-4
            flex-wrap
          "
        >

          {/* LAKI */}
          <button
            type="button"
            disabled
            onClick={() =>
              setData({
                ...data,
                jenisKelamin: "L",
              })
            }
            className={`
              h-14
              px-6
              rounded-2xl
              border
              transition-all
              duration-300
              text-sm
              font-medium

              ${
                data.jenisKelamin ===
                "L"
                  ? `
                    border-blue-500
                    bg-blue-50
                    text-blue-700
                  `
                  : `
                    border-blue-100
                    bg-white
                    text-slate-700
                    hover:bg-blue-50
                  `
              }
            `}
          >
            Laki-laki
          </button>

          {/* PEREMPUAN */}
          <button
            type="button"
            disabled
            onClick={() =>
              setData({
                ...data,
                jenisKelamin: "P",
              })
            }
            className={`
              h-14
              px-6
              rounded-2xl
              border
              transition-all
              duration-300
              text-sm
              font-medium

              ${
                data.jenisKelamin ===
                "P"
                  ? `
                    border-blue-500
                    bg-blue-50
                    text-blue-700
                  `
                  : `
                    border-blue-100
                    bg-white
                    text-slate-700
                    hover:bg-blue-50
                  `
              }
            `}
          >
            Perempuan
          </button>

        </div>

      </div>

    </SectionCard>
  );
}
