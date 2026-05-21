export default function LoginBackground() {
  return (
    <>
      <div
        className="
          absolute
          inset-0
          bg-cover
          bg-center
        "
        style={{
          backgroundImage: "url('/img/RSUD Pringsewu.jpeg')",
        }}
      />

      <div
        className="
          absolute
          inset-0
          bg-white/85
          backdrop-blur-[2px]
        "
      />

      <div
        className="
          absolute
          -top-40
          -left-40
          w-[450px]
          h-[450px]
          bg-blue-400/20
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-40
          -right-40
          w-[450px]
          h-[450px]
          bg-sky-300/20
          rounded-full
          blur-3xl
        "
      />
    </>
  );
}
