# Frontend — Sistem Penilaian Gizi

Aplikasi React 18 (SPA) untuk penilaian status gizi pasien. Menggunakan React Router v6, Tailwind CSS, Recharts, dan Lucide React icons.

---

## Struktur Folder

### `src/`

| Path | Deskripsi |
|------|-----------|
| `App.js` | Root component — hanya me-render `AppRoutes` |
| `index.js` | Entry point, render `<App />` ke DOM |
| `index.css` | Global style + Tailwind directives |

### `src/routes/`

| File | Deskripsi |
|------|-----------|
| `AppRoutes.js` | Semua route definisi: Login (`/`), Portal (`/portal`), Ringkasan Sistem (`/ringkasan-sistem`), Perhitungan (`/perhitungan`), Assessment (`/assessment`), Hasil (`/hasil`), Riwayat (`/riwayat`), Detail Riwayat (`/riwayat/:id`) |
| `ProtectedRoute.js` | Guard — redirect ke `/` jika token tidak ada di localStorage |

### `src/pages/` (halaman utama, satu level di atas component)

| File | Route | Deskripsi |
|------|-------|-----------|
| `auth/Login.js` | `/` | Form login user |
| `portal/PortalPage.js` | `/portal` | Dashboard utama setelah login |
| `ringkasanSistem/RingkasanSistem.js` | `/ringkasan-sistem` | Statistik & ringkasan seluruh sistem |
| `perhitungan/PilihPasien.js` | `/perhitungan` | Pilih pasien untuk assessment |
| `perhitungan/Assessment.js` | `/assessment` | Form input assessment gizi |
| `perhitungan/HasilPerhitungan.js` | `/hasil` | Hasil perhitungan gizi |
| `perhitungan/hasilHelpers.js` | — | Helper functions untuk perhitungan hasil |
| `riwayat/Riwayat.js` | `/riwayat` | Riwayat assessment pasien |

### `src/components/` (komponen UI reusable)

#### `common/`
Komponen umum: `Button`, `InputField`, `SelectField`, `CheckboxGroup`, `Modal`, `ConfirmationModal`, `FeedbackAlert`, `SectionCard`

#### `auth/`
Komponen halaman login: `LoginBackground`, `LoginBrand`, `LoginCard`, `LoginForm`, `LoginTextInput`

#### `portal/`
Komponen dashboard: `PortalBackground`, `PortalHeader`, `PortalGreeting`, `PortalMenuCard`, `PortalMenuGrid`, `PortalMenuData`, `PortalUserMenu`

#### `perhitungan/`
- **`pilihPasien/`**: `FilterCard`, `SearchPasien`, `PeriodeFilter`, `PasienTable`, `PasienRow`
- **`assessment/`**: 16 komponen form assessment — `IdentitasPasien`, `Antropometri`, `LilaUlnaForm`, `AktivitasFisik`, `FaktorStress`, `JenisPenyakit`, `Hemodialisa`, `MetodePerhitungan`, `PenambahanKalori`, `EstimasiToggle`, `AssessmentHeader`, `AssessmentFormSections`, `AssessmentStep`, `AssessmentActions`, `AssessmentValidationAlert`, `AssessmentBackground`
- **`Hasil/`**: `HasilHeader`, `HasilAction`, `SummaryCard`, `StatusGizi`, `FaktorPerhitungan`, `MakroChart`, `SuccessModal`

#### `riwayat/`
- `RiwayatHeader`, `RiwayatFilter`, `RiwayatAction`, `RiwayatTabs`, `DetailRiwayat`
- **`gizi/`**: `RiwayatTable`, `RiwayatRow`

#### `ringkasanSistem/`
9 komponen: `RingkasanHeader`, `StatCardsSection`, `StatusSummarySection`, `DonutChart`, `DiseaseDistributionSection`, `AverageNutritionSection`, `RecentHistorySection`, `QuickActionSection`, `SummaryPanel`

### `src/hooks/`

| File | Deskripsi |
|------|-----------|
| `useAssessmentHandlers.js` | Handler events form assessment |
| `useAssessmentLogic.js` | Logika perhitungan/state assessment |
| `useAssessmentValidation.js` | Validasi input form assessment |

### `src/services/` (API calls)

| File | Deskripsi |
|------|-----------|
| `authService.js` | Auth: login, logout, token management (localStorage) + axios instance with Bearer interceptor |
| `dashboard/dashboardApi.js` | API endpoint dashboard |
| `PasienServices/pasienApi.js` | CRUD pasien |
| `PasienServices/detailPasienApi.js` | Detail data pasien |
| `PasienServices/riwayatApi.js` | Riwayat pasien |
| `PasienServices/riwayatPerhitunganApi.js` | Riwayat detail perhitungan |
| `PasienServices/simpanPerhitunganApi.js` | Simpan hasil perhitungan |
| `PasienServices/previewPerhitunganApi.js` | Preview sebelum simpan |
| `perhitungan/perhitunganAPI.js` | API perhitungan gizi |
| `perhitungan/detailPasienAPI.js` | Detail pasien untuk perhitungan |

---

## Routing Summary

| Route | Page | Auth |
|-------|------|------|
| `/` | LoginPage | — |
| `/portal` | PortalPage | ✅ |
| `/ringkasan-sistem` | RingkasanSistem | ✅ |
| `/perhitungan` | PilihPasien | ✅ |
| `/assessment` | Assessment | ✅ |
| `/hasil` | HasilPerhitungan | ✅ |
| `/riwayat` | Riwayat | ✅ |
| `/riwayat/:id` | DetailRiwayat | ✅ |

Semua route kecuali `/` dibungkus `ProtectedRoute` yang membaca token dari `localStorage`.

---

## Build & Tools

- **Build**: `react-scripts` (CRA)
- **CSS**: Tailwind CSS (via PostCSS + autoprefixer)
- **Chart**: Recharts
- **Icons**: Lucide React, React Icons
- **Testing**: React Testing Library (unit), Selenium IDE `.side` (E2E)
- **Selenium runner**: `selenium-side-runner` + chromedriver

### Scripts Penting

```bash
npm start            # Dev server
npm run build        # Production build
npm test             # Unit test (Jest + RTL)
```

### E2E Test Scripts

Tersedia skrip untuk 5 modul: `login`, `portal`, `perhitungan`, `riwayat`, `ringkasan`.

Masing-masing punya 3 varian:
- `test:selenium:<modul>` — headless run
- `test:selenium:<modul>:preview` — dengan browser terlihat
- `test:selenium:<modul>:visual` — visual preview dengan delay

### Tools & Dependencies

| Dependency | Versi |
|------------|-------|
| react | ^18.3.1 |
| react-router-dom | ^6.30.3 |
| tailwindcss | ^3.4.17 |
| recharts | ^3.8.1 |
| lucide-react | ^1.14.0 |
| react-scripts | 5.0.1 |
| selenium-side-runner | ^4.0.13 |
| chromedriver | ^148.0.0 |

---

## Environment

Menggunakan `REACT_APP_API_URL` di `.env` sebagai base URL backend API. Authentication via JWT token yang disimpan di `localStorage`.

---

## Testing

- **Unit test**: Jest + React Testing Library (via `npm test`)
- **E2E**: Selenium IDE `.side` files di `tests/selenium/`, dijalankan via `selenium-side-runner`
- **Skenario test**: Markdown file `.md` di `tests/selenium/` untuk setiap modul (login, portal, perhitungan, riwayat, ringkasan)
