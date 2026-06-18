export default function UserManagementSummary({ currentUser }) {
  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md sm:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">
            Kontrol Akun
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            Kelola akses petugas gizi
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Lihat seluruh user, tambahkan akun baru, dan reset password dari
            satu halaman admin.
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          Login sebagai {currentUser?.nama_lengkap || "Admin"}
        </div>
      </div>
    </section>
  );
}
