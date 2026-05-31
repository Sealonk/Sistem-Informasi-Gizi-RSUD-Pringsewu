export default function AssessmentBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <style>{`
        @keyframes float-slow-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes float-slow-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 40px) scale(1.15); }
        }
        @keyframes float-slow-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(50px, 50px) scale(0.95); }
        }
        .blob-1 { animation: float-slow-1 18s ease-in-out infinite; }
        .blob-2 { animation: float-slow-2 22s ease-in-out infinite; }
        .blob-3 { animation: float-slow-3 15s ease-in-out infinite; }
      `}</style>
      
      {/* Blob 1 - Top Left */}
      <div
        className="
          blob-1
          absolute
          top-[-150px]
          left-[-100px]
          w-[600px]
          h-[600px]
          bg-gradient-to-br
          from-blue-300/30
          to-indigo-400/25
          rounded-full
          blur-[100px]
        "
      />

      {/* Blob 2 - Bottom Right */}
      <div
        className="
          blob-2
          absolute
          bottom-[-200px]
          right-[-100px]
          w-[700px]
          h-[700px]
          bg-gradient-to-tr
          from-sky-200/30
          to-emerald-300/20
          rounded-full
          blur-[110px]
        "
      />

      {/* Blob 3 - Middle Left */}
      <div
        className="
          blob-3
          absolute
          top-[30%]
          left-[25%]
          w-[450px]
          h-[450px]
          bg-violet-300/20
          rounded-full
          blur-[90px]
        "
      />
    </div>
  );
}
