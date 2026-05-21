export default function PortalBackground() {
  return (
    <>
      <div
        className="
          absolute
          top-[-120px]
          left-[-120px]
          w-[350px]
          h-[350px]
          bg-blue-200/40
          rounded-full
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]
          w-[350px]
          h-[350px]
          bg-sky-100/40
          rounded-full
          blur-3xl
        "
      />
    </>
  );
}
