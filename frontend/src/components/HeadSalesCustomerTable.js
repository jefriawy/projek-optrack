// frontend/src/components/HeadSalesCustomerTable.js
import React from "react";
import { FaEye } from "react-icons/fa";

const HeadSalesCustomerTable = ({ customers, onViewCustomer, openUpdateStatusModal }) => {
  const getStatusText = (id) => {
    switch (id) {
      case 1:
        return "Review"; // Sesuai desain
      case 2:
        return "Approved";
      case 3:
        return "Reject"; // Sesuai desain
      default:
        return "-";
    }
  };

  const getStatusColor = (id) => {
    switch (id) {
      case 1:
        return "bg-yellow-100 text-yellow-800"; // Review
      case 2:
        return "bg-green-100 text-green-800"; // Approved
      case 3:
        return "bg-red-100 text-red-800"; // Reject
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  };

  return (
    <div>
      {/* Table for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Perusahaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Telepon
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tanggal Input
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.idCustomer}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.nmCustomer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.corpCustomer || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.nmSales || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.mobileCustomer || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        customer.idStatCustomer
                      )}`}
                    >
                      {getStatusText(customer.idStatCustomer)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(customer.tglInput)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                    <button
                      onClick={() => onViewCustomer(customer)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openUpdateStatusModal(customer)}
                      className="text-yellow-600 hover:text-yellow-900 px-3 py-1 rounded-md bg-yellow-100"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No customers match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div key={customer.idCustomer} className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">{customer.nmCustomer}</p>
                  <p className="text-sm text-gray-500">{customer.corpCustomer || "-"}</p>
                </div>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    customer.idStatCustomer
                  )}`}
                >
                  {getStatusText(customer.idStatCustomer)}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <strong>Sales:</strong> {customer.nmSales || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Telepon:</strong> {customer.mobileCustomer || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Tanggal Input:</strong> {formatDate(customer.tglInput)}
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onViewCustomer(customer)}
                  className="text-blue-600 hover:text-blue-900 mr-2 px-3 py-1 rounded-md bg-blue-100"
                >
                  View
                </button>
                <button
                  onClick={() => openUpdateStatusModal(customer)}
                  className="text-yellow-600 hover:text-yellow-900 px-3 py-1 rounded-md bg-yellow-100"
                >
                  Update Status
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No customers match the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadSalesCustomerTable;