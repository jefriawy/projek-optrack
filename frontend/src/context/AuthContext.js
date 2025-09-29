// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // <-- BARU: State untuk titik merah

  // FUNGSI HELPER: Ambil jumlah notifikasi belum dibaca
  const fetchUnreadCount = async (token, userId, role) => {
    if (!token || !userId) return;
    try {
      const response = await axios.get("http://localhost:3000/api/notifications/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(response.data.unreadCount || 0);
    } catch (e) {
      console.error("Failed to fetch unread count:", e);
      setUnreadCount(0);
    }
  };

  // FUNGSI BARU: Tandai semua notifikasi sebagai terbaca
  const markAllAsRead = async () => {
    if (!user?.token) return;
    try {
      await axios.put("http://localhost:3000/api/notifications/mark-read", {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUnreadCount(0); // Clear state setelah sukses
    } catch (e) {
      console.error("Failed to mark as read:", e);
    }
  };

  // Cek token saat pertama kali load
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:3000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const userData = { token, ...response.data };
        setUser(userData);
        fetchUnreadCount(token, userData.userId, userData.role); // <-- Ambil count saat verifikasi
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

  // Polling untuk notifikasi baru (mengganti WebSockets)
  useEffect(() => {
      if (!user?.token) return;
      const interval = setInterval(() => {
          fetchUnreadCount(user.token, user.userId, user.role);
      }, 10000); // Poll setiap 10 detik
      return () => clearInterval(interval);
  }, [user]); 

  // Login function
  const login = async (email, password, remember) => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      const { token, role, userId, name } = response.data;

      if (remember) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      const userData = { token, role, userId, name };
      setUser(userData);
      fetchUnreadCount(token, userId, role); // <-- Ambil count saat login sukses
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
    setUnreadCount(0); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, unreadCount, markAllAsRead, fetchUnreadCount }}>
      {children}
    </AuthContext.Provider>
  );
};