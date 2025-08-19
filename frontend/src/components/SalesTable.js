// frontend/src/components/SalesTable.js
import React from "react";
import { FaDownload, FaEye, FaCommentDots } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalesListPdf from "./SalesListPdf"; // Asumsi Anda akan membuat komponen ini

const SalesTable = ({ sales }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-8">
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
                  {item.emailSales || 0}
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
                    onClick={() => console.log("View sales data:", item)} // Ganti dengan logika view
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
              <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada data sales.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;