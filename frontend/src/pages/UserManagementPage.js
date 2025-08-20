// frontend/src/pages/UserManagementPage.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";

const UserManagementPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || user.role.toLowerCase() !== "admin") return <Navigate to="/login" />;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">User Management Page</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <UserManagement />
        </div>
      </div>
    </Layout>
  );
};

export default UserManagementPage;
