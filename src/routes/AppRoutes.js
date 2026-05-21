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
          element={<PortalPage />}
        />

        {/* RINGKASAN SISTEM */}
        <Route
          path="/ringkasan-sistem"
          element={<RingkasanSistem />}
        />

        {/* PERHITUNGAN */}
        <Route
          path="/perhitungan"
          element={<PilihPasien />}
        />

        {/* ASSESSMENT */}
        <Route
          path="/assessment"
          element={<Assessment />}
        />

        {/* HASIL */}
        <Route
          path="/hasil"
          element={
            <HasilPerhitungan />
          }
        />

        {/* RIWAYAT */}
        <Route
          path="/riwayat"
          element={
            <Riwayat />
          }
        />

<Route
  path="/riwayat/:id"
  element={
    <DetailRiwayat />
  }
/>

      </Routes>

    </BrowserRouter>
  );
}
