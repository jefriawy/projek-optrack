// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek token saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser({ token, ...response.data });
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Login function dengan opsi remember me
  const login = async (email, password, remember) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      const { token, role, userId, name } = response.data;

      if (remember) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      setUser({ token, role, userId, name });
      return true;
    } catch (error) {
      throw error.response?.data?.error || "Login failed";
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};