import {
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function HasilHeader({
  data,
}) {

  /* TANGGAL */
  const tanggal =
    new Date().toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  return (

    <div
      className="
        rounded-[24px]
        border
        border-slate-200
        bg-white
        px-8
        py-8
        shadow-sm
      "
    >

      <div
        className="
          flex
          flex-col
          md:flex-row
          items-start
          md:justify-between
          gap-6
        "
      >

        {/* LEFT */}
        <div
          className="
            flex
            items-center
            gap-6
            flex-1
            min-w-0
          "
        >

          {/* AVATAR */}
          <div
            className="
              w-20
              h-20
              rounded-full
              bg-slate-100
              text-blue-600
              flex
              items-center
              justify-center
              shrink-0
            "
          >

            <UserRound
              size={38}
              strokeWidth={2.2}
            />

          </div>

          {/* CONTENT */}
          <div className="flex-1">

            {/* NAMA */}
            <h1
              className="
                text-2xl
                md:text-[26px]
                font-semibold
                text-slate-900
                mb-4
                leading-tight
                truncate
              "
            >
              {data.nama ||
                "Nama Pasien"}
            </h1>

            {/* INFO */}
            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-5
                gap-x-10
                gap-y-4
              "
            >

              {/* RM */}
              <div>

                <p
                  className="
                    text-[11px]
                    tracking-[0.24em]
                    uppercase
                    text-slate-400
                    mb-2
                  "
                >
                  No. RM
                </p>

                <h4
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                    leading-tight
                  "
                >
                  {data.noRM ||
                    "RM00123456"}
                </h4>

              </div>

              {/* UMUR */}
              <div>

                <p
                  className="
                    text-[11px]
                    tracking-[0.24em]
                    uppercase
                    text-slate-400
                    mb-2
                  "
                >
                  Umur
                </p>

                <h4
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                    leading-tight
                  "
                >
                  {data.umur ||
                    "45"}
                  {" "}
                  Tahun
                </h4>

              </div>

              {/* JK */}
              <div>

                <p
                  className="
                    text-[11px]
                    tracking-[0.24em]
                    uppercase
                    text-slate-400
                    mb-2
                  "
                >
                  Jenis Kelamin
                </p>

                <h4
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                    leading-tight
                  "
                >
                  {data.jenisKelamin ||
                    "Laki-laki"}
                </h4>

              </div>

              {/* TANGGAL */}
              <div>

                <p
                  className="
                    text-[11px]
                    tracking-[0.24em]
                    uppercase
                    text-slate-400
                    mb-2
                  "
                >
                  Tanggal Perhitungan
                </p>

                <h4
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                    leading-tight
                  "
                >
                  {tanggal}
                </h4>

              </div>

              {/* RUANG */}
              <div>

                <p
                  className="
                    text-[11px]
                    tracking-[0.24em]
                    uppercase
                    text-slate-400
                    mb-2
                  "
                >
                  Ruang / Bangsal
                </p>

                <h4
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                    leading-tight
                  "
                >
                  {data.ruangan ||
                    "Bangsal Penyakit Dalam"}
                </h4>

              </div>

            </div>

          </div>

        </div>

        {/* STATUS */}
        <div
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-emerald-50
            text-emerald-700
            text-sm
            font-semibold
            shrink-0
          "
        >

          <ShieldCheck
            size={16}
          />

          Data Valid

        </div>

      </div>

    </div>
  );
}