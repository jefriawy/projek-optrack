// frontend/src/pages/LoginPage.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Logika pengalihan berdasarkan role pengguna setelah login
      switch (user.role) {
        case "Admin":
          navigate("/dashboard-admin", { replace: true });
          break;
        case "Head Sales":
          navigate("/customer", { replace: true });
          break;
        case "Sales":
          navigate("/customer", { replace: true });
          break;
        default:
          // Arahkan ke halaman default jika role tidak terdaftar
          navigate("/login", { replace: true });
      }
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
