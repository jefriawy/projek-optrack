// frontend/src/componenets/LoginForm.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import personIcon from '../iconres/person.png';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password, remember);
      navigate("/customer");
    } catch (err) {
      setError(err || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-black hover:border-blue-400 w-full max-w-sm">
      <img src={personIcon} alt="Profile Icon" className="w-24 h-24 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-center mb-2">OPTrack</h1>
      <p className="text-center text-gray-600 mb-6">Log in into your account</p>
      
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            placeholder="User Email"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
            placeholder="User Password"
          />
        </div>

        {/* Remember Me */}
        <div className="mb-6 flex items-center">
          <input
            id="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="remember" className="text-sm text-gray-700">
            Remember Me
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-4 rounded w-full hover:bg-gray-800 focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
