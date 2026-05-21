import {
  Calculator,
  History,
  LayoutDashboard,
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
    title: "Riwayat",
    description: "Lihat riwayat perhitungan gizi pasien yang telah dilakukan.",
    icon: History,
    path: "/riwayat",
  },
];
