import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SalesTable from '../components/SalesTable';
import Modal from '../components/Modal';
import AddSalesForm from '../components/AddSalesForm';

const SalesPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [salesData, setSalesData] = useState([]);
  const [headSalesData, setHeadSalesData] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSalesData = async () => {
    if (user && user.token && (user.role === 'Head Sales' || user.role === 'Admin')) {
      try {
        const response = await axios.get('http://localhost:3000/api/sales', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setSalesData(response.data.regularSales || []);
        setHeadSalesData(response.data.headSales || []);
      } catch (err) {
        setError(err.response?.data?.error || '❌ Gagal mengambil data sales.');
      }
    }
  };

  useEffect(() => {
    fetchSalesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddSalesSubmit = async (formData) => {
    try {
      await axios.post('http://localhost:3000/api/user', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchSalesData();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || '❌ Gagal menambah data sales.');
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || !['Admin', 'Head Sales'].includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex-grow p-8 bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl mb-8">
        <h1 className="text-2xl font-bold text-gray-800">📊 Sales Page</h1>
        {user.role === 'Admin' && (
          <button
            onClick={handleOpenModal}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Tambah Sales
          </button>
        )}
      </header>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Sales</h2>
        <p className="text-gray-500 mb-6">Laporan Data Sales</p>

        {/* Head of Sales */}
        {user.role === 'Admin' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Head of Sales</h3>
            {headSalesData.length > 0 ? (
              <SalesTable sales={headSalesData} />
            ) : (
              <p className="p-4 text-gray-500 bg-white rounded-lg shadow-sm">
                Tidak ada data Head of Sales.
              </p>
            )}
          </div>
        )}

        {/* Sales */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales</h3>
          {salesData.length > 0 ? (
            <SalesTable sales={salesData} />
          ) : (
            <p className="p-4 text-gray-500 bg-white rounded-lg shadow-sm">
              Tidak ada data Sales.
            </p>
          )}
        </div>
      </div>

      {/* Modal Add Sales */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Tambah Sales Baru">
        <AddSalesForm onClose={handleCloseModal} onSubmit={handleAddSalesSubmit} />
      </Modal>
    </div>
  );
};

export default SalesPage;
