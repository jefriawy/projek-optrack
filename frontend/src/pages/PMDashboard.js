// src/pages/PMDashboard.js
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Helper functions and UserChip component (copied from AkademikDashboard)
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
  return `${API_BASE}/uploads/avatars/${String(candidate)
    .split(/[\\/]/)
    .pop()}`;
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

const UserChip = ({ user }) => {
  const name = getDisplayName(user);
  const avatar = getAvatarUrl(user);
  return (
    <div className="flex items-center gap-3">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-9 h-9 rounded-full object-cover border"
        />
      ) : (
        <Initials name={name} />
      )}
      <div className="text-sm">
        <div className="font-medium text-gray-800">{name}</div>
        <div className="text-xs text-gray-500">{user?.role || ""}</div>
      </div>
    </div>
  );
};

const PMDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Project Manager Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <UserChip user={user} />
        </div>
      </div>
      <p>
        Welcome to the Project Manager Dashboard. Here you can manage project
        data.
      </p>
      {/* Add PM specific content here */}
    </div>
  );
};

export default PMDashboard;