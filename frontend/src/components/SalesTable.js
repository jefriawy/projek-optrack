// frontend/src/components/SalesTable.js
import React, { useState } from "react";
import { FaDownload, FaEye, FaCommentDots } from "react-icons/fa";
import SalesDetail from "./SalesDetail";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalesListPdf from "./SalesListPdf"; // Asumsi Anda akan membuat komponen ini

const SalesTable = ({ sales }) => {
  const [selectedSales, setSelectedSales] = useState(null);
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
                Total Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Export
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.length > 0 ? (
              sales.map((item) => (
                <tr key={item.idSales}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {item.nmSales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.mobileSales || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.totalCustomer || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.emailSales || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Komponen untuk Export PDF */}
                    <PDFDownloadLink
                      document={<SalesListPdf sales={item} />}
                      fileName={`sales_report_${item.nmSales}.pdf`}
                      className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition flex items-center justify-center"
                    >
                      {({ loading }) => (loading ? "..." : <FaDownload />)}
                    </PDFDownloadLink>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => setSelectedSales(item)}
                      className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                    >
                      VIEW
                    </button>
                    <button
                      onClick={() => window.open(`https://wa.me/${item.mobileSales}`, '_blank')}
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
                  Tidak ada data sales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden">
        {sales.length > 0 ? (
          sales.map((item) => (
            <div key={item.idSales} className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">{item.nmSales}</p>
                  <p className="text-sm text-gray-500">{item.mobileSales || "-"}</p>
                </div>
                <PDFDownloadLink
                  document={<SalesListPdf sales={item} />}
                  fileName={`sales_report_${item.nmSales}.pdf`}
                  className="px-3 py-1 rounded bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition flex items-center justify-center"
                >
                  {({ loading }) => (loading ? "..." : <FaDownload />)}
                </PDFDownloadLink>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <strong>Total Customer:</strong> {item.totalCustomer || 0}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {item.emailSales || "-"}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedSales(item)}
                  className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                >
                  VIEW
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/${item.mobileSales}`, '_blank')}
                  className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                >
                  CHAT
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Tidak ada data sales.
          </div>
        )}
      </div>
      {/* Modal Detail Sales */}
      {selectedSales && (
        <SalesDetail sales={selectedSales} onClose={() => setSelectedSales(null)} />
      )}
    </div>
  );
};

export default SalesTable;