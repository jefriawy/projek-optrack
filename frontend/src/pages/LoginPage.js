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
        // ====================== PERUBAHAN DI SINI ======================
        case "Expert":
        case "Head of Expert": // Head of Expert ditambahkan di sini
          navigate("/training", { replace: true }); // Diarahkan ke halaman training
          break;
        // ====================== AKHIR PERUBAHAN ======================
        default:
          navigate("/login", { replace: true });
      }
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0">
      {/* Background + Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/70 to-black/80" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Mobile Header - Logo Only */}
        <div className="lg:hidden flex justify-center pt-6 pb-2">
          <img src={logo} alt="OPTrack Logo" className="h-12 sm:h-16 w-auto" />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-4 lg:py-0 gap-6 lg:gap-12 xl:gap-16">
          {/* Left Side: Logo + Text (Hidden on mobile, shown on lg+) */}
          <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:max-w-2xl text-white">
            <img
              src={logo}
              alt="OPTrack Logo"
              className="mb-8 w-full max-w-md xl:max-w-lg 2xl:max-w-xl"
            />
            <div className="space-y-4">
              <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold leading-tight">
                Selamat datang di{" "}
                <span className="text-blue-400">OPTrack!</span>
              </h1>
              <p className="text-lg xl:text-xl 2xl:text-2xl leading-relaxed text-gray-200">
                Platform smart tracking untuk mengoptimalkan operasional
                perusahaan Anda.
              </p>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl lg:flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 lg:p-10 xl:p-12 rounded-2xl shadow-2xl">
              {/* Mobile Title */}
              <div className="lg:hidden text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Masuk ke Akun Anda
                </h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  Platform smart tracking OPTrack
                </p>
              </div>

              {/* Desktop Title */}
              <div className="hidden lg:block text-center mb-8">
                <h2 className="text-2xl xl:text-3xl font-bold text-white mb-2">
                  Masuk ke Akun Anda
                </h2>
                <p className="text-gray-300">
                  Silakan masukkan kredensial Anda
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </div>

        {/* Mobile Footer Text */}
        <div className="lg:hidden text-center px-6 pb-4">
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
            Platform smart tracking untuk mengoptimalkan operasional perusahaan
            Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
