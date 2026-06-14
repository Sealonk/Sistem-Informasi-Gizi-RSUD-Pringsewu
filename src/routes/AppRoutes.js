import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/auth/Login";
import PortalPage from "../pages/portal/PortalPage";
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

        {/* PREDIKSI PASIEN */}
        <Route
          path="/prediksi-pasien"
          element={
            <ProtectedRoute>
              <PrediksiPasien />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}