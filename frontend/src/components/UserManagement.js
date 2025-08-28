// frontend/src/components/UserManagement.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";



const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addUserType, setAddUserType] = useState(null); // 'Admin', 'Sales', or 'Expert'
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Will store { id, role, name }
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
  };

  const handleEditUserSubmit = async (formData) => {
    if (!userToEdit) return;
    try {
      await axios.put(`http://localhost:3000/api/user/${userToEdit.role}/${userToEdit.id}`,
        formData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSuccess("✅ User updated successfully");
      fetchUsers();
      handleCloseEditModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "❌ Failed to update user");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const fetchUsers = () => {
    if (user && user.token) {
      axios
        .get("http://localhost:3000/api/user/all", { // <-- Updated endpoint
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleOpenModal = (type) => {
    setAddUserType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAddUserType(null);
  };

  const handleAddUserSubmit = async (formData) => {
    let url = "";
    let payload = {};

    // Determine the endpoint and payload based on the user type
    switch (addUserType) {
      case 'Admin':
        url = "http://localhost:3000/api/admin";
        payload = {
          nmAdmin: formData.name,
          emailAdmin: formData.email,
          password: formData.password,
          mobileAdmin: formData.mobile,
        };
        break;
      case 'Sales':
        url = "http://localhost:3000/api/sales";
        payload = {
          nmSales: formData.name,
          emailSales: formData.email,
          password: formData.password,
          mobileSales: formData.mobile,
          descSales: formData.descSales,
          role: formData.role, // 'Sales' or 'Head Sales'
        };
        break;
      case 'Expert':
        url = "http://localhost:3000/api/expert";
        payload = {
          nmExpert: formData.name,
          emailExpert: formData.email,
          password: formData.password,
          mobileExpert: formData.mobile,
          idSkill: formData.idSkill,
          statExpert: formData.statExpert,
          Row: formData.Row,
        };
        break;
      default:
        setErrorMessage("Invalid user type to add.");
        return;
    }

    try {
      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess(`✅ ${addUserType} user added successfully`);
      fetchUsers();
      handleCloseModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || `❌ Failed to add ${addUserType} user`);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user); // Store the whole user object
    setIsDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        // <-- Updated endpoint with role
        await axios.delete(`http://localhost:3000/api/user/${userToDelete.role}/${userToDelete.id}`, {
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

  // Note: Update functionality is not implemented in this refactor

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => handleOpenModal('Admin')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Tambah Admin
        </button>
        <button
          onClick={() => handleOpenModal('Sales')}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Tambah Sales
        </button>
        <button
          onClick={() => handleOpenModal('Expert')}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          + Tambah Expert
        </button>
      </div>

      {success && <p className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</p>}
      {errorMessage && <p className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorMessage}</p>}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={`${u.id}-${u.role}`}>
                  <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'Admin' ? 'bg-blue-100 text-blue-800' : u.role === 'Head Sales' ? 'bg-yellow-100 text-yellow-800' : u.role === 'Sales' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEditClick(u)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-medium px-3 py-1 rounded shadow-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(u)}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded shadow-md transition"
                    >
                      Delete
                    </button>
                  </td>
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title={"Edit User"}>
          <EditUserForm user={userToEdit} onClose={handleCloseEditModal} onSubmit={handleEditUserSubmit} />
        </Modal>
      )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Tambah Pengguna ${addUserType}`}>
          <AddUserForm userType={addUserType} onClose={handleCloseModal} onSubmit={handleAddUserSubmit} />
        </Modal>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={userToDelete ? userToDelete.name : ''}
      />
    </>
  );
};

export default UserManagement;
