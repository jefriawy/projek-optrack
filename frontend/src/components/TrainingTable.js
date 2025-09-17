// src/components/TrainingTable.js
import React, { useState, useMemo } from 'react';
import FeedbackModal from './FeedbackModal';
import { FaSearch } from 'react-icons/fa';

const TrainingTable = ({ data = [] }) => {
  const [query, setQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  // Fungsi untuk mengembalikan status training berdasarkan tanggal
  const computeStatus = (start, end) => {
    const now = Date.now();
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();

    if (s && now < s) return 'received';
    if (s && (!e || now <= e) && now >= s) return 'onprogress';
    if (e && now > e) return 'delivered';
    return 'unknown';
  };

  const getStatusLabel = (key) => {
    switch(key) {
      case 'delivered': return 'Selesai';
      case 'onprogress': return 'Berjalan';
      case 'received': return 'Mendatang';
      default: return 'Tidak Diketahui';
    }
  };

  const filteredData = useMemo(() => {
    let result = data;
    const q = query.toLowerCase();

    // Terapkan filter status
    if (filterStatus !== 'all') {
      result = result.filter(t => computeStatus(t.startTraining, t.endTraining) === filterStatus);
    }

    // Terapkan pencarian
    if (q) {
      result = result.filter(t =>
        t.nmTraining?.toLowerCase().includes(q) ||
        t.corpCustomer?.toLowerCase().includes(q) ||
        t.nmSales?.toLowerCase().includes(q) ||
        t.nmExpert?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [data, query, filterStatus]);

  const openFeedbackModal = (t) => {
    setFeedbackTarget(t);
    setOpenFeedback(true);
  };
  
  // Fungsi untuk handle submit feedback, yang akan diperbarui
  const handleFeedbackSubmit = () => {
    // Fungsi ini bisa dibiarkan kosong atau tambahkan logika lain jika diperlukan
    // Logika pengiriman data sudah ada di TrainingPage.js
    setOpenFeedback(false);
  };

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari training..."
            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FaSearch className="absolute right-3 text-gray-400" />
        </div>
        <div className="flex-1 w-full md:w-auto flex justify-center md:justify-end gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus('received')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filterStatus === 'received' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Mendatang
          </button>
          <button
            onClick={() => setFilterStatus('onprogress')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filterStatus === 'onprogress' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Berjalan
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filterStatus === 'delivered' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Tabel untuk layar besar */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama Training</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expert</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sales</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.idTraining}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.nmTraining || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.corpCustomer || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.nmExpert || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.nmSales || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(item.startTraining).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${computeStatus(item.startTraining, item.endTraining) === 'delivered' ? 'bg-green-100 text-green-800' :
                        computeStatus(item.startTraining, item.endTraining) === 'onprogress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {getStatusLabel(computeStatus(item.startTraining, item.endTraining))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openFeedbackModal(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Feedback
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data training yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards untuk layar kecil */}
      <div className="md:hidden">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.idTraining} className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="text-lg font-bold text-gray-900">{item.nmTraining || '-'}</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${computeStatus(item.startTraining, item.endTraining) === 'delivered' ? 'bg-green-100 text-green-800' :
                  computeStatus(item.startTraining, item.endTraining) === 'onprogress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'}`}>
                  {getStatusLabel(computeStatus(item.startTraining, item.endTraining))}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                **Customer:** {item.corpCustomer || '-'}
              </p>
              <p className="text-sm text-gray-500">
                **Expert:** {item.nmExpert || '-'}
              </p>
              <p className="text-sm text-gray-500">
                **Sales:** {item.nmSales || '-'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                **Tanggal:** {new Date(item.startTraining).toLocaleDateString()}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => openFeedbackModal(item)}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Feedback
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Tidak ada data training yang cocok.
          </div>
        )}
      </div>

      {feedbackTarget && (
        <FeedbackModal 
          isOpen={openFeedback} 
          onClose={() => setOpenFeedback(false)} 
          targetData={feedbackTarget} 
          canEdit={true} 
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default TrainingTable;