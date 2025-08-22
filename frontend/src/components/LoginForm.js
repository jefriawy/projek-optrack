// frontend/src/components/LoginForm.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/customer");
    } catch (err) {
      setError(err || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 sm:p-4">
          <p className="text-red-100 text-sm sm:text-base text-center">{error}</p>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <label 
          className="block text-white text-sm sm:text-base font-semibold" 
          htmlFor="email"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-lg 
                     text-white placeholder-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     backdrop-blur-sm"
          required
          placeholder="Masukkan email Anda"
          disabled={isLoading}
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label 
          className="block text-white text-sm sm:text-base font-semibold" 
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 sm:py-4 bg-white/20 border border-white/30 rounded-lg 
                     text-white placeholder-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                     transition-all duration-200 ease-in-out
                     backdrop-blur-sm"
          required
          placeholder="Masukkan password Anda"
          disabled={isLoading}
        />
      </div>

      {/* Login Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 sm:py-4 px-6 rounded-lg text-white font-bold text-sm sm:text-base
                     bg-gradient-to-r from-blue-500 to-blue-600 
                     hover:from-blue-600 hover:to-blue-700
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transform hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-200 ease-in-out
                     shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Memproses...</span>
            </div>
          ) : (
            "Masuk"
          )}
        </button>
      </div>


    </form>
  );
};

export default LoginForm;