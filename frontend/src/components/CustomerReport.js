// frontend/src/componenets/CustomerReport.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CustomerReport = () => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [statusOptions, setStatusOptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch status options
    axios
      .get("http://localhost:3000/api/customer/status", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((response) => {
        console.log("Fetched status options:", response.data); // Debug
        setStatusOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching status options:", error);
        setError(
          error.response?.data?.error || "Failed to fetch status options"
        );
      });

    // Fetch customers
    axios
      .get(
        `http://localhost:3000/api/customer${
          statusFilter ? `?status=${statusFilter}` : ""
        }`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((response) => {
        console.log("Fetched customers:", response.data); // Debug
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        setError(error.response?.data?.error || "Failed to fetch customers");
      });
  }, [user.token, statusFilter]);

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Customer Report</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full p-2 border rounded md:w-1/4"
        >
          <option value="">All</option>
          {statusOptions.map((status) => (
            <option key={status.idStatCustomer} value={status.idStatCustomer}>
              {status.nmStatCustomer}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Status</th>
              {user.role === "Admin" && <th className="border p-2">Sales</th>}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.idCustomer}>
                <td className="border p-2">{customer.nmCustomer}</td>
                <td className="border p-2">{customer.emailCustomer}</td>
                <td className="border p-2">{customer.mobileCustomer || "-"}</td>
                <td className="border p-2">{customer.corpCustomer || "-"}</td>
                <td className="border p-2">{customer.nmStatCustomer}</td>
                {user.role === "Admin" && (
                  <td className="border p-2">{customer.nmSales || "-"}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerReport;
