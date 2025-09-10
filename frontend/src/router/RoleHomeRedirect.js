// src/router/RoleHomeRedirect.jsx
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const mapRoleToHome = (role) => {
  switch (role) {
    case "Admin": return "/dashboard-admin";
    case "Head Sales": return "/dashboard/head-sales";
    case "Sales": return "/dashboard/sales";
    case "Expert": return "/dashboard/expert";
    case "Head of Expert": return "/dashboard/head-expert";
    default: return "/login";
  }
};

export default function RoleHomeRedirect() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    const to = user.redirectPath || mapRoleToHome(user.role);
    navigate(to, { replace: true });
  }, [user, loading, navigate]);

  return null;
}
