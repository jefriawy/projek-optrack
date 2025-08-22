// frontend/src/pages/LoginPage.js
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { AuthContext } from "../context/AuthContext";
import logo from "../imgres/logo.png";
import background from "../imgres/backlogin.png";

const LoginPage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "Admin":
          navigate("/dashboard-admin", { replace: true });
          break;
        case "Head Sales":
        case "Sales":
          navigate("/customer", { replace: true });
          break;
        default:
          navigate("/login", { replace: true });
      }
    }
  }, [user, navigate]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
  <div className="h-screen w-screen overflow-hidden fixed inset-0">
    {/* Background + Overlay */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute inset-0 bg-black/70" /> {/* overlay gelap */}
    </div>

    {/* Konten */}
    <div className="relative z-10 flex flex-col lg:flex-row w-full h-full items-center justify-center lg:justify-between px-6 sm:px-10 lg:px-20 gap-10">
      {/* kiri: logo + teks */}
      <div className="text-white text-center lg:text-left max-w-2xl">
        <img
          src={logo}
          alt="OPTrack Logo"
          className="mb-4 mx-auto lg:mx-0 w-[250px] sm:w-[300px] md:w-[400px] lg:w-[500px]"
        />
        <p className="text-base sm:text-lg md:text-xl lg:text-3xl leading-relaxed">
          Selamat datang di{" "}
          <span className="font-bold">OPTrack!</span> Platform smart tracking
          untuk mengoptimalkan operasional perusahaan Anda.
        </p>
      </div>

      {/* kanan: form login */}
      <div className="bg-black/40 p-6 sm:p-10 lg:p-16 rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg">
        <LoginForm />
      </div>
    </div>
  </div>
);

};

export default LoginPage;