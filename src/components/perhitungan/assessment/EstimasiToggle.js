export default function EstimasiToggle({
  checked,
  onChange,
}) {

  return (

    <div
      className="
        flex
        items-start
        gap-4
        rounded-[28px]
        border
        border-blue-100
        bg-blue-50/60
        p-5
      "
    >

      {/* CHECKBOX */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="
          mt-1
          w-5
          h-5
          rounded
          accent-blue-600
          shrink-0
        "
      />

      {/* CONTENT */}
      <div>

        <h3
          className="
            text-[15px]
            font-semibold
            text-slate-900
            mb-2
          "
        >
          Gunakan Estimasi Berat dan Tinggi Badan
        </h3>

        <p
          className="
            text-sm
            leading-relaxed
            text-slate-600
          "
        >
          Aktifkan jika pasien tidak dapat
          dilakukan pengukuran berat badan
          atau tinggi badan secara langsung.
          Sistem akan menggunakan metode
          estimasi melalui LILA dan ULNA.
        </p>

      </div>

    </div>
  );
}