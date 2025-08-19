// frontend/src/componenets/CustomerTable.js
import React from "react";

const CustomerTable = ({ customers, onViewCustomer, onEditCustomer }) => {
  const getStatusText = (id) => {
    switch (id) {
      case 1:
        return "Review";
      case 2:
        return "Approved";
      case 3:
        return "Rejected";
      default:
        return "-";
    }
  };

  const getStatusColor = (id) => {
    switch (id) {
      case 1:
        return "bg-yellow-100 text-yellow-800"; // Pending
      case 2:
        return "bg-green-100 text-green-800"; // Active
      case 3:
        return "bg-red-100 text-red-800"; // Inactive
      default:
        return "bg-gray-100 text-gray-800"; // Default
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Perusahaan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telepon
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  {customer.emailCustomer}
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewCustomer(customer)}
                    className="text-blue-600 hover:text-blue-900 mr-2 px-3 py-1 rounded-md bg-blue-100"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEditCustomer(customer)}
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

export default CustomerTable;
