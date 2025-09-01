import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ExpertTable from '../components/ExpertTable';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExpertListPdf from '../components/ExpertListPdf';

const ExpertPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [expertData, setExpertData] = useState([]);
  const [error, setError] = useState('');

  const fetchExpertData = async () => {
    if (user && user.token && user.role === 'Admin') {
      try {
        const response = await axios.get('http://localhost:3000/api/expert', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setExpertData(response.data || []);
      } catch (err) {
        setError(err.response?.data?.error || '❌ Gagal mengambil data expert.');
      }
    }
  };

  useEffect(() => {
    fetchExpertData();
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">📊 Expert Page</h1>
      </header>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Expert</h2>
          <PDFDownloadLink
            document={<ExpertListPdf experts={expertData} />}
            fileName="expert_report.pdf"
            className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition flex items-center justify-center"
          >
            {({ loading }) => (loading ? "..." : "Export PDF")}
          </PDFDownloadLink>
        </div>
        <p className="text-gray-500 mb-6">Laporan Data Expert</p>

        {/* Expert */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Experts</h3>
          {expertData.length > 0 ? (
            <ExpertTable experts={expertData} />
          ) : (
            <p className="p-4 text-gray-500 bg-white rounded-lg shadow-sm">
              Tidak ada data Expert.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertPage;