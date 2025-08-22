// frontend/App.js
import React, { useContext } from "react"; // Added useContext
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AdminDashboard from "./components/AdminDashboard"; // Pastikan Anda mengimpor komponen ini
import "./App.css";

const App = () => {
  const { user } = useContext(AuthContext); // Access user context

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rute untuk Dashboard Admin */}
          <Route
            path="/dashboard-admin"
            element={
              <Layout>
                <AdminDashboard />
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
              user && user.role === "Admin" ? (
                <Layout>
                  <AdminDashboard />
                </Layout>
              ) : (
                <Layout>
                  <HomePage />
                </Layout>
              )
            }
          />{" "}
          {/* Default route based on user role */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;