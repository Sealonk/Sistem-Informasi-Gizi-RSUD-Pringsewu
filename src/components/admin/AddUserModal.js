import { Save } from "lucide-react";
import { Feedback, Field } from "./UserManagementField";

export default function AddUserModal({
  form,
  feedback,
  loading,
  onChange,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">Tambah User</h3>
          <p className="text-sm text-slate-500">Daftarkan akun baru.</p>
        </div>

        <div className="space-y-4">
          {feedback && <Feedback type={feedback.type}>{feedback.message}</Feedback>}

          <Field
            label="Nama Lengkap"
            value={form.nama_lengkap}
            onChange={(value) => onChange("nama_lengkap", value)}
            placeholder="Contoh: Siti Aminah"
            autoComplete="name"
          />
          <Field
            label="Username"
            value={form.username}
            onChange={(value) => onChange("username", value)}
            placeholder="Contoh: siti.aminah"
            autoComplete="username"
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => onChange("email", value)}
            placeholder="nama@rsudpringsewu.id"
            autoComplete="email"
          />
          <Field
            label="Password Awal"
            type="password"
            value={form.password}
            onChange={(value) => onChange("password", value)}
            placeholder="Minimal 6 karakter"
            autoComplete="new-password"
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Role
            </span>
            <select
              value={form.role}
              onChange={(event) => onChange("role", event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="petugas_gizi">Petugas Gizi</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-12 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Save size={18} />
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
