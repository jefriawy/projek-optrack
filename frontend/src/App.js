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
import LoginPage from "./pages/LoginPage";
import CustomerPage from "././pages/CustomerPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import UserManagementPage from "./pages/UserManagementPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import OptiPage from "./pages/OptiPage";
import SalesPage from "./pages/SalesPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import TrainingPage from "./pages/TrainingPage";
import ProjectPage from "./pages/ProjectPage";
import OutsourcePage from "./pages/OutsourcePage";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertPage from "./pages/ExpertPage";
import HeadOfSalesDashboard from "./pages/HeadOfSalesDashboard";
import HeadOfExpertDashboard from "./pages/HeadOfExpertDashboard"; // New import
import "./App.css";

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && window.location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Rute untuk Dashboard Admin */}
      <Route
        path="/dashboard-admin"
        element={
          <Layout>
            <AdminDashboardPage />
          </Layout>
        }
      />

      {/* Routes wrapped with Layout */}
      <Route
        path="/opti"
        element={
          <Layout>
            <OptiPage />
          </Layout>
        }
      />
      <Route
        path="/customer"
        element={
          <Layout>
            <CustomerPage />
          </Layout>
        }
      />
      <Route
        path="/sales"
        element={
          <Layout>
            <SalesPage />
          </Layout>
        }
      />
      <Route
        path="/training"
        element={
          <Layout>
            <TrainingPage />
          </Layout>
        }
      />
      <Route 
      path="/head-of-sales" 
      element={<HeadOfSalesDashboard />} />
      <Route
        path="/project"
        element={
          <Layout>
            <ProjectPage />
          </Layout>
        }
      />
      <Route
        path="/outsource"
        element={
          <Layout>
            <OutsourcePage />
          </Layout>
        }
      />
      
};
      <Route
        path="/customer/add"
        element={
          <Layout>
            <AddCustomerPage />
          </Layout>
        }
      />
      <Route
        path="/customer/:id"
        element={
          <Layout>
            <CustomerDetailPage />
          </Layout>
        }
      />
      <Route
        path="/users"
        element={
          <Layout>
            <UserManagementPage />
          </Layout>
        }
      />
        <Route
          path="/"
          element={
            user ? (
              user.role === "Admin" ? (
                <Layout>
                  <AdminDashboardPage />
                </Layout>
              ) : user.role === "Expert" ? (
                <Layout>
                  <ExpertDashboard />
                </Layout>
              ) : user.role === "Head of Expert" ? ( // New role check
                <Layout>
                  <HeadOfExpertDashboard />
                </Layout>
              ) : (
                <Layout>
                  <HomePage />
                </Layout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;