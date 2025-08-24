// frontend/src/pages/UserManagementPage.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Import Sidebar

const UserManagementPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || user.role.toLowerCase() !== "admin") return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-grow p-8">
        <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">👥 User Management</h1>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
