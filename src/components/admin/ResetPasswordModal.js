import { RotateCcw } from "lucide-react";
import { Feedback, Field } from "./UserManagementField";
import { getUserName } from "./userManagementHelpers";

export default function ResetPasswordModal({
  selectedUser,
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
          <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
          <p className="text-sm text-slate-500">
            {selectedUser
              ? `User target: ${getUserName(selectedUser)}`
              : "Masukkan ID user target."}
          </p>
        </div>

        <div className="space-y-4">
          {feedback && <Feedback type={feedback.type}>{feedback.message}</Feedback>}

          <Field
            label="ID User Target"
            type="number"
            value={form.id_user_target}
            onChange={(value) => onChange("id_user_target", value)}
            placeholder="Contoh: 12"
            autoComplete="off"
          />
          <Field
            label="Password Baru"
            type="password"
            value={form.password_baru}
            onChange={(value) => onChange("password_baru", value)}
            placeholder="Masukkan password baru"
            autoComplete="new-password"
          />

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
              disabled={loading || !form.id_user_target}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RotateCcw size={18} />
              {loading ? "Mereset..." : "Reset"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
