// frontend/src/pages/UserManagementPage.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Import Sidebar

/* ===== Base URL (untuk avatar jika path relatif) ===== */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

/* ===== User chip helpers (nama & avatar) ===== */
const getDisplayName = (user) => {
  if (!user) return "User";
  return (
    user.name ||
    user.nmExpert ||
    user.fullName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "User")
  );
};
const getAvatarUrl = (user) => {
  if (!user) return null;
  const candidate =
    user.photoURL ||
    user.photoUrl ||
    user.photo ||
    user.avatar ||
    user.image ||
    user.photoUser ||
    null;
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return `${API_BASE}/uploads/avatars/${String(candidate).split(/[\\/]/).pop()}`;
};
const Initials = ({ name }) => {
  const ini = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
      {ini}
    </div>
  );
};


const UserManagementPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || user.role.toLowerCase() !== "admin") return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-grow p-8">
        <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">👥 User Management</h1>
          <div className="flex items-center gap-3 pl-4 border-l">
              {getAvatarUrl(user) ? (
                <img
                  src={getAvatarUrl(user)}
                  alt="avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <Initials name={getDisplayName(user)} />
              )}
              <div className="leading-5">
                <div className="text-sm font-bold">{getDisplayName(user)}</div>
                <div className="text-xs text-gray-500">Logged in • {user?.role || "User"}</div>
              </div>
            </div>
        </header>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <UserManagement />
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
