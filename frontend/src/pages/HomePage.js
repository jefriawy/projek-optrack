// frontend/src/pages/HomePage.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "Admin":
      return <Navigate to="/dashboard-admin" replace />;
    case "Head Sales":
      return <Navigate to="/dashboard/head-of-sales" replace />;
    case "Sales":
      return <Navigate to="/opti/dashboard" replace />;
    case "Head of Expert":
      return <Navigate to="/dashboard/head-expert" replace />;
    case "Expert":
      return <Navigate to="/dashboard/expert" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default HomePage;
