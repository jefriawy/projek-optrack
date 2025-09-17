import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PmTable from '../components/PmTable'; 

/* ===== Base URL (untuk avatar jika path relatif) ===== */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

/* ===== User chip helpers (nama & avatar) ===== */
const getDisplayName = (user) => {
  if (!user) return "User";
  return (
    user.name ||
    user.nmPM ||
    user.fullName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "User")
  );
};
const getAvatarUrl = (user) => {
  if (!user) return null;
  const candidate = 
    user.photoURL || 
    user.photoUrl || 
    user.photo || 
    user.avatar || 
    user.image || 
    user.photoUser || 
    null;
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return `${API_BASE}/uploads/avatars/${String(candidate).split(/[\\/]/).pop()}`;
};
const Initials = ({ name }) => {
  const ini = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
      {ini}
    </div>
  );
};

const PmPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [pmData, setPmData] = useState([]);
  const [error, setError] = useState('');

  const fetchPmData = async () => {
    if (user && user.token && user.role === 'Admin') {
      try {
        // Mengambil semua user dan filter di frontend
        const response = await axios.get('http://localhost:3000/api/user/all', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const allUsers = response.data;
        const filteredData = allUsers.filter(u => u.role === 'PM');
        setPmData(filteredData);
      } catch (err) {
        setError(err.response?.data?.error || '❌ Gagal mengambil data Project Manager.');
      }
    }
  };

  useEffect(() => {
    fetchPmData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex-grow p-8 bg-gray-100">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Halaman Project Manager</h1>
        <div className="flex items-center gap-3 pl-4 border-l">
            {getAvatarUrl(user) ? (
              <img
                src={getAvatarUrl(user)}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <Initials name={getDisplayName(user)} />
            )}
            <div className="leading-5">
              <div className="text-sm font-bold">{getDisplayName(user)}</div>
              <div className="text-xs text-gray-500">Logged in • {user?.role || "User"}</div>
            </div>
          </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Akun Project Manager</h2>
        <p className="text-gray-500 mb-6">Daftar semua pengguna dengan peran Project Manager.</p>
        {pmData.length > 0 ? (
          <PmTable pmUsers={pmData} />
        ) : (
          <p className="p-4 text-gray-500 bg-white rounded-lg shadow-sm">Tidak ada data Project Manager.</p>
        )}
      </div>
    </div>
  );
};

export default PmPage;