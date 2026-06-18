export const initialUserForm = {
  nama_lengkap: "",
  username: "",
  email: "",
  password: "",
  role: "petugas_gizi",
};

export const initialResetForm = {
  id_user_target: "",
  password_baru: "",
};

export function getUserId(user) {
  return user?.id_user || "";
}

export function getUserName(user) {
  return user?.nama_lengkap || "-";
}

export function formatCreatedAt(createdAt) {
  if (!createdAt) return "-";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getRoleLabel(role) {
  if (role === "admin") return "Admin";
  if (role === "petugas_gizi") return "Petugas Gizi";
  return role || "-";
}
