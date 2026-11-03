import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import DashboardHome from "../pages/Dashboard/DashboardHome";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Marketing / Auth Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Authenticated Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="drills" element={<DashboardHome />} />
        <Route path="editor" element={<DashboardHome />} />
        <Route path="interview" element={<DashboardHome />} />
        <Route path="optimization" element={<DashboardHome />} />
        <Route path="submissions" element={<DashboardHome />} />
        <Route path="analytics" element={<DashboardHome />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
