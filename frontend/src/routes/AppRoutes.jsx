import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import DatabaseStructuresPage from "../pages/Dashboard/DatabaseStructuresPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Marketing / Auth Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected Dashboard Routes (Authenticated Users Only) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="structures" element={<DatabaseStructuresPage />} />
          <Route path="drills" element={<DashboardHome />} />
          <Route path="editor" element={<DashboardHome />} />
          <Route path="learn" element={<DashboardHome />} />
          <Route path="submissions" element={<DashboardHome />} />
          <Route path="progress" element={<DashboardHome />} />
          <Route path="interview" element={<DashboardHome />} />
          <Route path="optimization" element={<DashboardHome />} />
          <Route path="analytics" element={<DashboardHome />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
