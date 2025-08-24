// UserManagement.js - Added comment to force re-render
// frontend/src/components/UserManagement.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import AddUserForm from "./AddUserForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import UpdateUserForm from "./UpdateUserForm";

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddUserSubmit = async (formData) => {
    try {
      await axios.post("http://localhost:3000/api/user", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("✅ User added successfully");
      fetchUsers();
      handleCloseModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "❌ Failed to add user");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/user/${userToDelete}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSuccess("✅ User deleted successfully");
        fetchUsers();
        handleCancelDelete();
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "❌ Failed to delete user");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUserToEdit(null);
  };

  const handleUpdateUserSubmit = async (userId, formData) => {
    try {
      await axios.put(`http://localhost:3000/api/user/${userId}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("✅ User updated successfully");
      fetchUsers();
      handleCloseUpdateModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "❌ Failed to update user");
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
      <button
        onClick={handleOpenModal}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition mb-6"
      >
        + Tambah Pengguna
      </button>

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

      {/* Table for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
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
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
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

      {/* Cards for small screens */}
      <div className="md:hidden">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === "Admin"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleEditClick(user)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(user.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No users found
          </div>
        )}
      </div>

      {/* Modal Add User */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Tambah Pengguna Baru">
        <AddUserForm onClose={handleCloseModal} onSubmit={handleAddUserSubmit} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={userToDelete ? users.find(u => u.id === userToDelete)?.name : ''}
      />

      {/* Update User Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={handleCloseUpdateModal} title="Update Pengguna">
        <UpdateUserForm onClose={handleCloseUpdateModal} onSubmit={handleUpdateUserSubmit} userToEdit={userToEdit} />
      </Modal>
    </>
  );
};

export default UserManagement;