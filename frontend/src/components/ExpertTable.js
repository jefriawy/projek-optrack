// frontend/src/components/ExpertTable.js
import React, { useState } from "react";
import { FaDownload, FaEye, FaCommentDots } from "react-icons/fa";
import ExpertDetail from "./ExpertDetail";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ExpertListPdf from "./ExpertListPdf";

const ExpertTable = ({ experts }) => {
  const [selectedExpert, setSelectedExpert] = useState(null);
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
                Total Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {experts.length > 0 ? (
              experts.map((item) => (
                <tr key={item.idExpert}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {item.nmExpert}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.mobileExpert || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.emailExpert || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.totalProjects || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.statExpert || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => setSelectedExpert(item)}
                      className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                    >
                      VIEW
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/${item.mobileExpert}`, '_blank')}
                      className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                    >
                      CHAT
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data expert.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden">
        {experts.length > 0 ? (
          experts.map((item) => (
            <div key={item.idExpert} className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">{item.nmExpert}</p>
                  <p className="text-sm text-gray-500">{item.mobileExpert || "-"}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {item.emailExpert || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Total Project:</strong> {item.totalProjects || 0}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {item.statExpert || "-"}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedExpert(item)}
                  className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                >
                  VIEW
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/${item.mobileExpert}`, '_blank')}
                  className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                >
                  CHAT
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Tidak ada data expert.
          </div>
        )}
      </div>
      {/* Modal Detail Expert */}
      {selectedExpert && (
        <ExpertDetail expert={selectedExpert} onClose={() => setSelectedExpert(null)} />
      )}
    </div>
  );
};

export default ExpertTable;