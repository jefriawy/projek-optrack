// src/router/RoleGuard.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleGuard({ allow, children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null; // bisa diganti spinner kecil

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // kalau backend ngasih redirectPath di /login atau /verify, pakai sebagai fallback
  const fallback = user.redirectPath || "/";

  return allow.includes(user.role) ? children : <Navigate to={fallback} replace />;
}
