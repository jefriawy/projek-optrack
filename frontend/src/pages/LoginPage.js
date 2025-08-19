// frontend/src/pages/LoginPage.js
import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/customer", { replace: true });
    }
  }, [user, navigate]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;