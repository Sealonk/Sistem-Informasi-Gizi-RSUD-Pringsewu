import {
  Calculator,
  History,
  LayoutDashboard,
  TrendingUp,
  UsersRound,
} from "lucide-react";

export const portalMenus = [
  {
    title: "Ringkasan Sistem",
    description:
      "Pantau ringkasan perhitungan, status gizi, distribusi penyakit, dan riwayat terbaru.",
    icon: LayoutDashboard,
    path: "/ringkasan-sistem",
  },
  {
    title: "Perhitungan Gizi",
    description:
      "Lakukan perhitungan kebutuhan gizi pasien berdasarkan asesmen dan kondisi klinis.",
    icon: Calculator,
    path: "/perhitungan",
  },
  {
    title: "Prediksi Pasien",
    description: "Prediksi jumlah pasien per hari berdasarkan data historis dan model AI.",
    icon: TrendingUp,
    path: "/prediksi-pasien",
  },
  {
    title: "Riwayat",
    description: "Lihat riwayat perhitungan gizi pasien yang telah dilakukan.",
    icon: History,
    path: "/riwayat",
  },
  {
    title: "Manajemen User",
    description:
      "Tambahkan user baru dan reset password petugas melalui akses administrator.",
    icon: UsersRound,
    path: "/manajemen-user",
    requiredRole: "admin",
  },
];
