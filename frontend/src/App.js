// frontend/App.js
import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import CustomerPage from "./pages/CustomerPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import UserManagementPage from "./pages/UserManagementPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import OptiPage from "./pages/OptiPage";
import SalesPage from "./pages/SalesPage";
import TrainingPage from "./pages/TrainingPage";
import ProjectPage from "./pages/ProjectPage";
import OutsourcePage from "./pages/OutsourcePage";
import ExpertPage from "./pages/ExpertPage"; // <- penting utk /expert (Admin)

// Dashboards
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SalesDashboard from "./pages/SalesDashboard";
import HeadOfSalesDashboard from "./pages/HeadOfSalesDashboard";
import ExpertDashboard from "./pages/ExpertDashboard";


import Layout from "./components/Layout";
import "./App.css";

/* ===== Helper: mapping role -> dashboard path ===== */
const pathByRole = (role) => {
  switch (role) {
    case "Admin":
      return "/dashboard-admin";
    case "Head Sales":
      return "/dashboard/head-sales";
    case "Sales":
      return "/dashboard/sales";
    case "Head of Expert":
    case "head of expert":
      return "/dashboard/head-expert";
    case "Expert":
      return "/dashboard/expert";
    default:
      return "/login";
  }
};

/* ===== Protected wrapper (case-insensitive role check) ===== */
const Protected = ({ children, allow }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null; // bisa diganti spinner/loading state
  if (!user) return <Navigate to="/login" replace />;

  // Normalisasi role untuk perbandingan konsisten
  const userRole = (user.role || "").toLowerCase();
  const allowNormalized = (allow || []).map((r) => (r || "").toLowerCase());

  if (allow && !allowNormalized.includes(userRole)) {
    const fallback = user.redirectPath || pathByRole(user.role);
    return <Navigate to={fallback} replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Kalau user belum login dan bukan di /login → lempar ke /login
  useEffect(() => {
    if (!loading && !user && window.location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirector root → dashboard sesuai role / redirectPath */}
      <Route
        path="/"
        element={
          user
            ? (
              <Navigate
                to={user.redirectPath || pathByRole(user.role)}
                replace
              />
              )
            : <Navigate to="/login" replace />
        }
      />

      {/* ===== DASHBOARDS ===== */}
      <Route
        path="/dashboard-admin"
        element={
          <Protected allow={["Admin"]}>
            <Layout><AdminDashboardPage /></Layout>
          </Protected>
        }
      />

      <Route
        path="/dashboard/head-sales"
        element={
          <Protected allow={["Head Sales", "Admin"]}>
            <Layout><HeadOfSalesDashboard /></Layout>
          </Protected>
        }
      />

      <Route
        path="/dashboard/sales"
        element={
          <Protected allow={["Sales", "Head Sales"]}>
            <Layout><SalesDashboard /></Layout>
          </Protected>
        }
      />

      <Route
        path="/dashboard/expert"
        element={
          <Protected allow={["Expert"]}>
            <Layout><ExpertDashboard /></Layout>
          </Protected>
        }
      />


      {/* ===== MODULE PAGES ===== */}
      <Route
        path="/opti"
        element={
          <Protected allow={["Sales", "Head Sales", "Admin"]}>
            <Layout><OptiPage /></Layout>
          </Protected>
        }
      />

      <Route
        path="/customer"
        element={
          <Protected allow={["Sales", "Head Sales", "Admin"]}>
            <Layout><CustomerPage /></Layout>
          </Protected>
        }
      />

      <Route
        path="/customer/add"
        element={
          <Protected allow={["Sales", "Head Sales", "Admin"]}>
            <Layout><AddCustomerPage /></Layout>
          </Protected>
        }
      />

      <Route
        path="/customer/:id"
        element={
          <Protected allow={["Sales", "Head Sales", "Admin"]}>
            <Layout><CustomerDetailPage /></Layout>
          </Protected>
        }
      />

      <Route
        path="/sales"
        element={
          <Protected allow={["Admin", "Head Sales"]}>
            <Layout><SalesPage /></Layout>
          </Protected>
        }
      />

      {/* >>> FIX: izinkan Sales & Head Sales buka Training / Project / Outsource */}
      <Route
        path="/training"
        element={
          <Protected allow={["Sales", "Head Sales", "Expert", "Head of Expert", "Admin"]}>
            <Layout><TrainingPage /></Layout>
          </Protected>
        }
      />

      <Route
        path="/project"
        element={
          <Protected allow={["Sales", "Head Sales", "Expert", "Head of Expert", "Admin"]}>
            <Layout><ProjectPage /></Layout>
          </Protected>
        }
      />

      <Route
        path="/outsource"
        element={
          <Protected allow={["Sales", "Head Sales", "Expert", "Head of Expert", "Admin"]}>
            <Layout><OutsourcePage /></Layout>
          </Protected>
        }
      />

      {/* >>> FIX ADMIN: ExpertPage & Manage User dapat diakses Admin */}
      <Route
        path="/expert"
        element={
          <Protected allow={["Admin"]}>
            <Layout><ExpertPage /></Layout>
          </Protected>
        }
      />

      <Route
        path="/users"
        element={
          <Protected allow={["Admin"]}>
            <Layout><UserManagementPage /></Layout>
          </Protected>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </Router>
);

export default App;
