// frontend/src/componenets/CustomerList.js
import React from "react";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const CustomerList = ({ customers, onViewCustomer, onEditCustomer, onDeleteCustomer }) => {

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleString('id-ID', options) + ' WIB';
  };

  const handleActionClick = (e, action, customer) => {
    e.stopPropagation(); // Prevent card's onClick from firing
    action(customer);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {customers.length > 0 ? (
        customers.map((customer) => (
          <div 
            key={customer.idCustomer} 
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div className="p-5 flex-grow cursor-pointer" onClick={() => onViewCustomer(customer)}>
              <h3 className="text-xl font-bold text-gray-800 truncate mb-1">{customer.nmCustomer}</h3>
              <p className="text-sm text-gray-500 mb-4 truncate">{customer.corpCustomer || "No Corporation"}</p>
              <div className="border-t pt-3">
                  <p className="text-xs text-gray-400">Input Date:</p>
                  <p className="text-sm text-gray-600">{formatDate(customer.tglInput)}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-2 flex justify-end space-x-2 border-t rounded-b-lg">
              <button 
                onClick={(e) => handleActionClick(e, onEditCustomer, customer)}
                className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors duration-200"
                title="Edit Customer"
              >
                <FaEdit />
              </button>
              <button 
                // onClick={(e) => handleActionClick(e, onDeleteCustomer, customer)} // Uncomment when delete is implemented
                className="text-gray-500 hover:text-red-600 p-2 rounded-full transition-colors duration-200"
                title="Delete Customer"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full p-10 text-center text-gray-500 bg-white rounded-lg shadow-sm">
          <p>No customers match the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
