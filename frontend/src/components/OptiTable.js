// frontend/src/components/OptiTable.js
import React from "react";

const OptiTable = ({ optis, onViewOpti, onEditOpti }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Follow Up":
        return "bg-blue-100 text-blue-800";
      case "On-Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Success":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      case "Just Get Info":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      {/* Table for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                NAMA OPTI
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                NAMA PERUSAHAAN
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                NAMA CUSTOMER
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                TANGGAL
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                STATUS OPTI
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {optis.length > 0 ? (
              optis.map((opti) => (
                <tr key={opti.idOpti}>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {opti.nmOpti}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {opti.corpCustomer || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {opti.nmCustomer || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(opti.datePropOpti)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        opti.statOpti
                      )}`}
                    >
                      {opti.statOpti || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => onViewOpti(opti)}
                      className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditOpti(opti)}
                      className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Belum ada data opportunity. Klik "Tambah Opti" untuk memulai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden">
        {optis.length > 0 ? (
          optis.map((opti) => (
            <div key={opti.idOpti} className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">{opti.nmOpti}</p>
                  <p className="text-sm text-gray-500">{opti.corpCustomer || "-"}</p>
                </div>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    opti.statOpti
                  )}`}
                >
                  {opti.statOpti || "-"}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <strong>Customer:</strong> {opti.nmCustomer || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Tanggal:</strong> {formatDate(opti.datePropOpti)}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onViewOpti(opti)}
                  className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                >
                  View
                </button>
                <button
                  onClick={() => onEditOpti(opti)}
                  className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Belum ada data opportunity. Klik "Tambah Opti" untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
};

export default OptiTable;