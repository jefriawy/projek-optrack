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

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
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
                colSpan="6"
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                No customers match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HeadSalesCustomerTable;