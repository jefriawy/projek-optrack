import React, { useState } from "react";
import PmDetail from "./PmDetail";

const PmTable = ({ pmUsers }) => {
  // State untuk detail (jika nanti diperlukan)
  const [selectedPm, setSelectedPm] = useState(null);

  // Helper untuk mendapatkan nomor telepon dari berbagai kemungkinan field
  const getMobileNumber = (user) => {
    return user.mobilePM || "-";
  };

  return (
    <div>
      {/* Table for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Nomor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pmUsers.length > 0 ? (
              pmUsers.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {item.nmPM || item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {getMobileNumber(item)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.emailPM || item.email || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => setSelectedPm(item)}
                      className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                    >
                      VIEW
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/${getMobileNumber(item)}`, '_blank')}
                      className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                      disabled={getMobileNumber(item) === "-"}
                    >
                      CHAT
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data Project Manager.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden">
        {pmUsers.length > 0 ? (
          pmUsers.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">{item.nmPM || item.name}</p>
                  <p className="text-sm text-gray-500">{getMobileNumber(item)}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {item.emailPM || item.email || "-"}
                </p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedPm(item)}
                  className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                >
                  VIEW
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/${getMobileNumber(item)}`, '_blank')}
                  className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                  disabled={getMobileNumber(item) === "-"}
                >
                  CHAT
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Tidak ada data Project Manager.
          </div>
        )}
      </div>
      {selectedPm && (
        <PmDetail user={selectedPm} onClose={() => setSelectedPm(null)} />
      )}
    </div>
  );
};

export default PmTable;