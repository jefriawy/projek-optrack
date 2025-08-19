import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SalesTable from '../components/SalesTable';

const SalesPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSalesData = async () => {
      if (user && user.token && (user.role === 'Head Sales' || user.role === 'Admin')) {
        try {
          const response = await axios.get('http://localhost:3000/api/sales', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setSalesData(response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Gagal mengambil data sales.');
        }
      }
    };

    fetchSalesData();
  }, [user]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || !['Admin', 'Head Sales'].includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sales Page</h1>
        </div>
      </header>

      {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div className="mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Data Sales</h2>
        <p className="text-gray-600 mb-6">Laporan Data Sales</p>
        {salesData.length > 0 ? (
          <SalesTable sales={salesData} />
        ) : (
          <p className="p-4 text-gray-500 bg-white rounded-lg shadow-sm">Tidak ada data sales.</p>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
