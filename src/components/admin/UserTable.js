import {
  KeyRound,
  Loader2,
  RefreshCcw,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import {
  formatCreatedAt,
  getRoleLabel,
  getUserId,
  getUserName,
} from "./userManagementHelpers";

export default function UserTable({
  users,
  usersLoading,
  usersError,
  selectedResetUserId,
  onAdd,
  onRefresh,
  onReset,
  onDelete,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <UsersRound size={21} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Daftar User</h3>
            <p className="text-sm text-slate-500">
              Total {users.length} akun terdaftar
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition-all hover:bg-emerald-700"
          >
            <UserPlus size={15} />
            Tambah User
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={usersLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {usersLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCcw size={15} />
            )}
            Refresh
          </button>
        </div>
      </div>

      {usersError && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {usersError}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["ID", "Nama", "Username", "Email", "Dibuat", "Role"].map(
                  (label) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {label}
                    </th>
                  )
                )}
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {usersLoading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <Loader2 size={18} className="animate-spin" />
                      Memuat daftar user...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-sm font-medium text-slate-500"
                  >
                    Belum ada data user.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const userId = getUserId(user);
                  const isAdminRow = user?.role === "admin";
                  const isSelected = String(selectedResetUserId) === String(userId);

                  return (
                    <tr
                      key={userId || user?.username}
                      className={`transition-colors ${
                        isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-700">
                        {userId || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                        {getUserName(user)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                        {user?.username || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {user?.email || "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                        {formatCreatedAt(user?.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            user?.role === "admin"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {getRoleLabel(user?.role)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {isAdminRow ? (
                          <span className="text-xs font-bold text-slate-400">
                            -
                          </span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onReset(user)}
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white transition-all hover:bg-blue-700"
                            >
                              <KeyRound size={14} />
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(user)}
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-rose-600 px-3 text-xs font-bold text-white transition-all hover:bg-rose-700"
                            >
                              <Trash2 size={14} />
                              Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
