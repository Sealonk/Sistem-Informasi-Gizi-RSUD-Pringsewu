import RiwayatRow from "./RiwayatRow";

export default function RiwayatTable() {

  /* DUMMY DATA */
  const data = [
    {
      id: "PSN001",
      nama: "Budi Santoso",
      penyakit: "DM",
      energi: 1720,
      tanggal:
        "16 Mei 2026",
    },
    {
      id: "PSN002",
      nama: "Siti Aisyah",
      penyakit: "CKD",
      energi: 1850,
      tanggal:
        "15 Mei 2026",
    },
    {
      id: "PSN003",
      nama: "Andi Saputra",
      penyakit: "CHF",
      energi: 1650,
      tanggal:
        "14 Mei 2026",
    },
  ];

  return (

    <div
      className="
        rounded-[24px]
        border
        border-blue-100
        bg-white
        shadow-sm
        overflow-hidden
      "
    >

      {/* HEADER */}
      <div
        className="
          px-6
          py-5
          border-b
          border-slate-100
        "
      >

        <h3
          className="
            text-lg
            font-bold
            text-slate-900
            mb-1
          "
        >
          Riwayat Perhitungan
          Gizi
        </h3>

        <p
          className="
            text-sm
            text-slate-500
          "
        >
          Daftar hasil
          perhitungan kebutuhan
          energi dan makronutrien
          pasien yang telah
          disimpan.
        </p>

      </div>

      {/* TABLE */}
      <div
        className="
          overflow-x-auto
        "
      >

        <table
          className="
            w-full
            min-w-[900px]
          "
        >

          {/* HEAD */}
          <thead
            className="
              bg-slate-50
            "
          >

            <tr>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-slate-500
                  uppercase
                "
              >
                Pasien
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-slate-500
                  uppercase
                "
              >
                Penyakit
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-slate-500
                  uppercase
                "
              >
                Energi
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-slate-500
                  uppercase
                "
              >
                Tanggal
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-slate-500
                  uppercase
                "
              >
                Status
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  text-slate-500
                  uppercase
                "
              >
                Action
              </th>

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {data.map((item) => (

              <RiwayatRow
                key={item.id}
                item={item}
              />

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}