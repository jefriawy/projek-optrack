// frontend/src/components/UserManagement.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUsers = () => {
    if (user && user.token) {
      axios
        .get("http://localhost:3000/api/user", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("✅ User deleted successfully");
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "❌ Failed to delete user");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  if (!user || user.role !== "Admin")
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold text-red-600">
          🚫 Unauthorized Access
        </p>
      </div>
    );

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        All Users
      </h2>

      {success && (
        <p className="mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
          {success}
        </p>
      )}
      {errorMessage && (
        <p className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Role
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-gray-800">{user.name}</td>
                  <td className="px-6 py-3 text-gray-600">{user.email}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "Admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserManagement;
