// frontend/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import CustomerPage from "./pages/CustomerPage";
import AddCustomerPage from "./pages/AddCustomerPage";
import UserManagementPage from "./pages/UserManagementPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import OptiPage from "./pages/OptiPage";
import SalesPage from "./pages/SalesPage";
import Layout from "./components/Layout";
import "./App.css";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
          <Route path="/" element={<LoginPage />} />{" "}
          {/* Default route to login */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;