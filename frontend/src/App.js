// frontend/App.js
import React, { useContext } from "react"; // Added useContext
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext"; // Added AuthContext
import LoginPage from "./pages/LoginPage";
import CustomerPage from "././pages/CustomerPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import UserManagementPage from "./pages/UserManagementPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import OptiPage from "./pages/OptiPage";
import SalesPage from "./pages/SalesPage";
import HomePage from "./pages/HomePage"; // Import HomePage
import Layout from "./components/Layout";
import AdminDashboardPage from "./pages/AdminDashboardPage"; // Pastikan Anda mengimpor komponen ini
import TrainingPage from "./pages/TrainingPage";
import ProjectPage from "./pages/ProjectPage";
import OutsourcePage from "./pages/OutsourcePage";
import ExpertDashboard from "./pages/ExpertDashboard";
import "./App.css";

const AppRoutes = () => {
  const { user } = useContext(AuthContext); // Access user context

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
      <Route
        path="/expert"
        element={
          <Layout>
            <TrainingPage />
          </Layout>
        }
      />
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
                  <ExpertDashboard />   {/* <== ganti ke dashboard expert */}
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