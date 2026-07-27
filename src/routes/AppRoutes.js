import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/auth/Login";
import ForgotPasswordAdmin from "../pages/auth/ForgotPasswordAdmin";
import ResetPasswordAdmin from "../pages/auth/ResetPasswordAdmin";
import PortalPage from "../pages/portal/PortalPage";
import UserManagement from "../pages/admin/UserManagement";
import PilihPasien from "../pages/perhitungan/PilihPasien";
import Assessment from "../pages/perhitungan/Assessment";
import HasilPerhitungan from "../pages/perhitungan/HasilPerhitungan";
import Riwayat from "../pages/riwayat/Riwayat";
import DetailRiwayat from "../components/riwayat/DetailRiwayat";
import RingkasanSistem from "../pages/ringkasanSistem/RingkasanSistem";
import PrediksiPasien from "../pages/prediksiPasien/PrediksiPasien";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<LoginPage />}
        />

        {/* LUPA PASSWORD ADMIN */}
        <Route
          path="/lupa-password-admin"
          element={<ForgotPasswordAdmin />}
        />

        {/* RESET PASSWORD ADMIN */}
        <Route
          path="/reset-password"
          element={<ResetPasswordAdmin />}
        />

        {/* PORTAL */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <PortalPage />
            </ProtectedRoute>
          }
        />

        {/* RINGKASAN SISTEM */}
        <Route
          path="/ringkasan-sistem"
          element={
            <ProtectedRoute>
              <RingkasanSistem />
            </ProtectedRoute>
          }
        />

        {/* PERHITUNGAN */}
        <Route
          path="/perhitungan"
          element={
            <ProtectedRoute>
              <PilihPasien />
            </ProtectedRoute>
          }
        />

        {/* ASSESSMENT */}
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />

        {/* HASIL */}
        <Route
          path="/hasil"
          element={
            <ProtectedRoute>
              <HasilPerhitungan />
            </ProtectedRoute>
          }
        />

        {/* RIWAYAT */}
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <Riwayat />
            </ProtectedRoute>
          }
        />

        {/* DETAIL RIWAYAT */}
        <Route
          path="/riwayat/:id"
          element={
            <ProtectedRoute>
              <DetailRiwayat />
            </ProtectedRoute>
          }
        />

        {/* DETAIL PERHITUNGAN DARI VERSI RIWAYAT */}
        <Route
          path="/riwayat/:id/detail/:detailId"
          element={
            <ProtectedRoute>
              <DetailRiwayat />
            </ProtectedRoute>
          }
        />

        {/* PREDIKSI PASIEN */}
        <Route
          path="/prediksi-pasien"
          element={
            <ProtectedRoute>
              <PrediksiPasien />
            </ProtectedRoute>
          }
        />

        {/* MANAJEMEN USER */}
        <Route
          path="/manajemen-user"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
