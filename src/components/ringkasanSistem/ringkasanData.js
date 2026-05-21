import {
  Apple,
  ArrowRight,
  Calculator,
  ClipboardCheck,
  Droplet,
  Flame,
  Folder,
  History,
  Sprout,
  UsersRound,
} from "lucide-react";

export const stats = [
  {
    title: "Total Perhitungan",
    value: "312",
    caption: "Selama 1 bulan terakhir",
    icon: Calculator,
    tone: "blue",
    trend: "M8 42 L22 28 L34 33 L49 17 L62 22 L77 8 L92 18",
  },
  {
    title: "Perhitungan Hari Ini",
    value: "18",
    caption: "Data hari ini",
    icon: ClipboardCheck,
    tone: "green",
    trend: "M8 40 L21 25 L33 31 L47 17 L60 22 L74 7 L90 18",
  },
  {
    title: "Total Riwayat",
    value: "312",
    caption: "Data tersimpan",
    icon: Folder,
    tone: "purple",
    trend: "M8 41 L22 27 L35 32 L48 17 L61 24 L76 9 L91 20",
  },
];

export const statusItems = [
  { label: "Normal", value: 125, percent: "40,1%", color: "#22c55e" },
  { label: "Kurus", value: 62, percent: "19,9%", color: "#f59e0b" },
  { label: "Overweight", value: 58, percent: "18,6%", color: "#fb923c" },
  { label: "Obesitas", value: 45, percent: "14,4%", color: "#ef4444" },
  { label: "Lainnya", value: 22, percent: "7,0%", color: "#a855f7" },
];

export const averageNutrition = [
  {
    label: "Energi",
    value: "1.917 kkal",
    icon: Droplet,
    color: "text-blue-600",
    background: "bg-blue-50",
  },
  {
    label: "Protein",
    value: "68,4 gram",
    icon: Sprout,
    color: "text-emerald-600",
    background: "bg-emerald-50",
  },
  {
    label: "Lemak",
    value: "59,1 gram",
    icon: Flame,
    color: "text-orange-500",
    background: "bg-orange-50",
  },
  {
    label: "Karbohidrat",
    value: "268,7 gram",
    icon: Apple,
    color: "text-purple-600",
    background: "bg-purple-50",
  },
];

export const diseaseItems = [
  { label: "Diabetes Melitus", value: 72, percent: "23,1%", color: "#3b82f6" },
  { label: "Hipertensi", value: 58, percent: "18,6%", color: "#22c55e" },
  { label: "Penyakit Jantung", value: 41, percent: "13,1%", color: "#f59e0b" },
  { label: "Ginjal Kronik", value: 32, percent: "10,3%", color: "#ef4444" },
  { label: "Lainnya", value: 109, percent: "34,9%", color: "#a855f7" },
];

export const recentHistories = [
  {
    patient: "Ahmad Saputra",
    detail: "Laki-laki, 45 Tahun",
    date: "20 Mei 2025",
    time: "10:35",
    method: "Harris Benedict",
    energy: "1.850",
    status: "Normal",
    disease: "Diabetes Melitus",
  },
  {
    patient: "Siti Aisyah",
    detail: "Perempuan, 38 Tahun",
    date: "20 Mei 2025",
    time: "09:42",
    method: "Mifflin St Jeor",
    energy: "1.720",
    status: "Normal",
    disease: "Hipertensi",
  },
  {
    patient: "Budi Santoso",
    detail: "Laki-laki, 52 Tahun",
    date: "20 Mei 2025",
    time: "09:10",
    method: "Harris Benedict",
    energy: "2.100",
    status: "Overweight",
    disease: "Penyakit Jantung",
  },
  {
    patient: "Dewi Lestari",
    detail: "Perempuan, 27 Tahun",
    date: "20 Mei 2025",
    time: "08:35",
    method: "Mifflin St Jeor",
    energy: "1.650",
    status: "Kurus",
    disease: "Anemia",
  },
  {
    patient: "Rudi Hartono",
    detail: "Laki-laki, 60 Tahun",
    date: "19 Mei 2025",
    time: "16:20",
    method: "Harris Benedict",
    energy: "1.900",
    status: "Normal",
    disease: "Ginjal Kronik",
  },
];

export const quickActions = [
  {
    title: "Mulai Perhitungan",
    description: "Pilih pasien dan lakukan assessment kebutuhan gizi.",
    icon: UsersRound,
    actionIcon: ArrowRight,
    path: "/perhitungan",
  },
  {
    title: "Lihat Riwayat",
    description: "Buka daftar hasil perhitungan yang sudah tersimpan.",
    icon: History,
    actionIcon: ArrowRight,
    path: "/riwayat",
  },
];
