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
      case "Prospect":
        return "bg-blue-100 text-blue-800";
      case "Negotiation":
        return "bg-yellow-100 text-yellow-800";
      case "Closed-Won":
        return "bg-green-100 text-green-800";
      case "Closed-Lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
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
              NAMA KONTAK PIC
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              TANGGAL
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              STATUS OPTI
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              SUMBER
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
                  {opti.contactOpti || "-"}
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
                <td className="px-6 py-4 text-gray-700">
                  {opti.nmSumber || "-"}
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
                colSpan="8"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                Belum ada data opportunity. Klik "Tambah Opti" untuk memulai.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OptiTable;