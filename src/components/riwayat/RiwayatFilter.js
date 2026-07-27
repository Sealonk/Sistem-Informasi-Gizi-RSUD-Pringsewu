import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Filter,
  MapPin,
  Search,
  User,
} from "lucide-react";

import { getUsers } from "../../services/admin/userManagementApi";
import { getDaftarRuangan } from "../../services/perhitungan/pasienApi";
import { getRiwayat } from "../../services/riwayat/riwayatApi";
import { getUser } from "../../services/auth/authService";

const diseaseOptions = [
  { label: "DM", value: "dm" },
  { label: "CKD", value: "ckd" },
  { label: "CHF", value: "chf" },
  { label: "Stroke", value: "stroke" },
  { label: "Lambung", value: "lambung" },
  { label: "Mifflin", value: "mifflin" },
  { label: "Critical Ill", value: "critical_ill" },
];

const calculationTypeValues = ["critical_ill", "mifflin"];

const validDiseaseCombinations = [
  ["dm"],
  ["dm", "ckd"],
  ["dm", "ckd", "chf"],
  ["dm", "chf"],
  ["dm", "lambung"],
  ["dm", "stroke"],
  ["ckd"],
  ["ckd", "chf"],
  ["ckd", "lambung"],
  ["ckd", "stroke"],
  ["chf"],
  ["chf", "lambung"],
  ["chf", "stroke"],
  ["lambung"],
  ["stroke"],
];

const getDiseaseOnly = (items = []) => (
  items.filter((item) => !calculationTypeValues.includes(item))
);

const isValidCombination = (items = []) => {
  const diseaseOnly = getDiseaseOnly(items);
  if (diseaseOnly.length <= 1) return true;

  const sorted = [...diseaseOnly].sort();
  return validDiseaseCombinations.some((combo) => {
    const sortedCombo = [...combo].sort();
    if (sortedCombo.length !== sorted.length) return false;
    return sortedCombo.every((value, index) => value === sorted[index]);
  });
};

const getUserId = (user) => (
  user?.id_user ||
  user?.id ||
  user?.user_id ||
  user?.username ||
  user?.nama_lengkap ||
  user?.nama
);

const getUserName = (user) => (
  user?.nama_lengkap ||
  user?.nama ||
  user?.username ||
  user?.email ||
  "User"
);

const getRoomValue = (item) => {
  if (typeof item === "string") return item;

  return (
    item?.ruang_bangsal ||
    item?.ruangan ||
    item?.nama_ruangan ||
    item?.bangsal ||
    item?.nama ||
    item?.value ||
    ""
  );
};

const uniqueRooms = (items = []) => (
  Array.from(
    new Set(
      items
        .map(getRoomValue)
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, "id-ID"))
);

const defaultRegisteredUsers = [
  { id_user: 1, nama_lengkap: "Ahli Gizi Utama" },
  { id_user: 2, nama_lengkap: "Petugas Gizi 1" },
  { id_user: 3, nama_lengkap: "Petugas Gizi 2" },
  { id_user: 4, nama_lengkap: "Ahli Gizi Baru RS" },
];

export default function RiwayatFilter({
  filters,
  setFilters,
  setPage,
}) {
  const [userOptions, setUserOptions] = useState([]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [optionError, setOptionError] = useState("");

  const selectedDiseases = useMemo(
    () => (Array.isArray(filters.penyakit) ? filters.penyakit : []),
    [filters.penyakit]
  );

  const showUnsupportedCombination = useMemo(
    () => !isValidCombination(selectedDiseases),
    [selectedDiseases]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadOptions() {
      try {
        const [users, rooms, riwayatResponse] = await Promise.all([
          getUsers().catch(() => []),
          getDaftarRuangan().catch(() => []),
          getRiwayat({ page: 1, limit: 1000 }).catch(() => ({ data: { riwayat: [] } })),
        ]);

        if (!isMounted) return;

        const riwayatList = riwayatResponse?.data?.riwayat || [];
        let fetchedUsers = Array.isArray(users) ? users : [];

        // 1. Simpan ke cache localStorage jika Admin berhasil mengambil data user
        if (fetchedUsers.length > 0) {
          try {
            localStorage.setItem("cached_all_users", JSON.stringify(fetchedUsers));
          } catch (e) {}
        } else {
          // 2. Jika getUsers 403 (User biasa), coba muat dari cache lokal atau fallback user terdaftar
          try {
            const cached = localStorage.getItem("cached_all_users");
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                fetchedUsers = parsed;
              }
            }
          } catch (e) {}

          if (fetchedUsers.length === 0) {
            fetchedUsers = defaultRegisteredUsers;
          }
        }

        const userMap = new Map();

        // 3. Masukkan data user terdaftar
        fetchedUsers.forEach((u) => {
          const name = u.nama_lengkap || u.nama || u.username;
          const id = u.id_user || u.id || u.username;
          if (name) {
            userMap.set(name, { id_user: id, nama_lengkap: name });
          }
        });

        // 4. Masukkan data pembuat dari daftar riwayat
        riwayatList.forEach((item) => {
          const name = item.created_by || item.nama_user || item.nama_lengkap;
          const id = item.id_user || item.user_id || item.created_by_id || name;
          if (name && !userMap.has(name)) {
            userMap.set(name, { id_user: id, nama_lengkap: name });
          }
        });

        // 5. Masukkan user yang sedang login saat ini (meskipun belum pernah buat riwayat)
        const currentUser = getUser();
        if (currentUser) {
          const currentName = currentUser.nama_lengkap || currentUser.nama || currentUser.username;
          const currentId = currentUser.id_user || currentUser.id || currentUser.username;
          if (currentName && !userMap.has(currentName)) {
            userMap.set(currentName, { id_user: currentId, nama_lengkap: currentName });
          }
        }

        const finalUsers = Array.from(userMap.values());
        setUserOptions(finalUsers);
        setRoomOptions(uniqueRooms([
          ...(Array.isArray(rooms) ? rooms : []),
          ...riwayatList,
        ]));
      } catch (err) {
        if (isMounted) {
          setOptionError("");
        }
      }
    }

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateFilters = (next) => {
    setFilters((prev) => ({ ...prev, ...next }));
    setPage(1);
  };

  const toggleDisease = (value) => {
    const exists = selectedDiseases.includes(value);
    updateFilters({
      penyakit: exists
        ? selectedDiseases.filter((item) => item !== value)
        : [...selectedDiseases, value],
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/75 p-5 shadow-sm backdrop-blur-md transition-all duration-300 ease-out hover:shadow-md sm:p-6">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-70" />

      <div className="relative z-10 space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Cari Pasien
            </label>

            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none" />
              <input
                type="text"
                placeholder="Nama pasien atau No. RM..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="h-11 w-full rounded-[16px] border border-slate-200/80 bg-slate-50/50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition-all duration-205 hover:border-slate-350 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Filter Pembuat
            </label>

            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none" />
              <select
                value={filters.filter_user}
                onChange={(e) => updateFilters({ filter_user: e.target.value })}
                className="h-11 w-full appearance-none rounded-[16px] border border-slate-200/80 bg-slate-50/50 pl-11 pr-8 text-sm font-medium text-slate-700 outline-none transition-all duration-205 hover:border-slate-350 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="all">Semua User ({userOptions.length})</option>
                <option value="me">Hanya Saya</option>
                {userOptions.map((user) => {
                  const value = `user|${getUserId(user)}|${getUserName(user)}`;
                  return (
                    <option key={value} value={value}>
                      {getUserName(user)}
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400">
                v
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Filter Ruangan
            </label>

            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none" />
              <select
                value={filters.ruangan}
                onChange={(e) => updateFilters({ ruangan: e.target.value })}
                className="h-11 w-full appearance-none rounded-[16px] border border-slate-200/80 bg-slate-50/50 pl-11 pr-8 text-sm font-medium text-slate-700 outline-none transition-all duration-205 hover:border-slate-350 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">Semua Ruangan</option>
                {roomOptions.map((value) => {
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-slate-400">
                v
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <Filter size={14} />
              Filter Penyakit & Jenis Perhitungan
            </div>

            <div className="flex flex-wrap gap-2">
              {diseaseOptions.map((option) => {
                const active = selectedDiseases.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleDisease(option.value)}
                    className={`h-9 rounded-xl border px-3 text-xs font-extrabold transition-all ${
                      active
                        ? "border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-100"
                        : "border-slate-200 bg-slate-50/70 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {showUnsupportedCombination && (
              <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <p>Kombinasi penyakit yang dipilih belum tersedia. Hasil filter mungkin tidak menampilkan data.</p>
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <CalendarDays size={14} />
              Filter Tanggal
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Semua", value: "semua" },
                { label: "Tanggal", value: "tanggal" },
                { label: "Range", value: "range" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateFilters({
                    tanggalMode: item.value,
                    tanggal: item.value === "tanggal" ? filters.tanggal : "",
                    startDate: item.value === "range" ? filters.startDate : "",
                    endDate: item.value === "range" ? filters.endDate : "",
                  })}
                  className={`h-10 rounded-xl border text-xs font-extrabold transition-all ${
                    filters.tanggalMode === item.value
                      ? "border-blue-500 bg-blue-600 text-white shadow-sm shadow-blue-100"
                      : "border-slate-200 bg-slate-50/70 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {filters.tanggalMode === "tanggal" && (
              <input
                type="date"
                value={filters.tanggal}
                onChange={(e) => updateFilters({ tanggal: e.target.value })}
                className="mt-3 h-11 w-full rounded-[16px] border border-slate-200/80 bg-slate-50/50 px-4 text-sm font-medium text-slate-700 outline-none transition-all duration-205 hover:border-slate-350 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            )}

            {filters.tanggalMode === "range" && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilters({ startDate: e.target.value })}
                  className="h-11 w-full rounded-[16px] border border-slate-200/80 bg-slate-50/50 px-4 text-sm font-medium text-slate-700 outline-none transition-all duration-205 hover:border-slate-350 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilters({ endDate: e.target.value })}
                  className="h-11 w-full rounded-[16px] border border-slate-200/80 bg-slate-50/50 px-4 text-sm font-medium text-slate-700 outline-none transition-all duration-205 hover:border-slate-350 hover:bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            )}
          </div>
        </div>

        {optionError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
            {optionError}
          </div>
        )}
      </div>
    </div>
  );
}
