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
    <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAMA OPTI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAMA PERUSAHAAN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAMA CUSTOMER
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAMA KONTAK PIC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TANGGAL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS OPTI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SUMBER
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {optis.length > 0 ? (
              optis.map((opti) => (
                <tr key={opti.idOpti}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {opti.nmOpti}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.corpCustomer || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.nmCustomer || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.contactOpti || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(opti.datePropOpti)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        opti.statOpti
                      )}`}
                    >
                      {opti.statOpti || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.nmSumber || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewOpti(opti)}
                      className="text-blue-600 hover:text-blue-900 mr-2 px-3 py-1 rounded-md bg-blue-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditOpti(opti)}
                      className="text-green-600 hover:text-green-900 px-3 py-1 rounded-md bg-green-100"
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
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
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