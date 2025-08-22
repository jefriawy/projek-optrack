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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/customer");
    } catch (err) {
      setError(err || "An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="User Email"
        />
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="User Password"
        />
      </div>

      {/* Login Button */}
      <div className="mt-10">
  <button
    type="submit"
    className="w-full py-2 px-4 rounded-md text-white font-bold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    Login
  </button>
</div>
    </form>
  );
};

export default LoginForm;
