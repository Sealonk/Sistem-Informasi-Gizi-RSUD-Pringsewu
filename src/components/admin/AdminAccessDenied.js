import { ShieldCheck } from "lucide-react";

export default function AdminAccessDenied() {
  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <ShieldCheck size={26} />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-slate-900">
        Akses khusus admin
      </h2>
      <p className="text-sm leading-relaxed text-slate-500">
        Halaman ini hanya dapat digunakan oleh akun dengan role admin. Silakan
        login menggunakan akun administrator.
      </p>
    </div>
  );
}
