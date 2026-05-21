export default function AssessmentBackground() {
  return (
    <>
      <div
        className="
          absolute
          -top-32
          -left-32
          w-[350px]
          h-[350px]
          bg-blue-200/30
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          -bottom-32
          -right-32
          w-[350px]
          h-[350px]
          bg-sky-100/30
          rounded-full
          blur-3xl
        "
      />
    </>
  );
}
