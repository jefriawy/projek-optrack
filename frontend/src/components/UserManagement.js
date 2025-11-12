// frontend/src/components/UserManagement.js (MODIFIKASI)
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Modal from "./Modal";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import CreateUserButton from "./CreateUserButton";
import SkillCategoryModal from "./SkillCategoryModal";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const getDisplayName = (user) => {
  if (!user) return "User";
  return (
    user.name ||
    user.nmExpert ||
    user.nmSales ||
    user.nmAdmin ||
    user.nmAkademik ||
    user.nmPM ||
    user.nmHR ||
    user.nmOutsourcer || // <-- Nama dari outsourcer
    user.fullName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "User")
  );
};
const getAvatarUrl = (user) => {
  // ... (fungsi ini tidak berubah) ...
  if (!user) return null;
  const candidate =
    user.photoURL ||
    user.photoUrl ||
    user.photo ||
    user.avatar ||
    user.image ||
    user.photoUser ||
    null;
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return `${API_BASE}/uploads/avatars/${String(candidate)
    .split(/[\\/]/)
    .pop()}`;
};
const Initials = ({ name }) => {
  // ... (fungsi ini tidak berubah) ...
  const ini = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
      {ini}
    </div>
  );
};

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addUserType, setAddUserType] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // background detail loading (non-blocking)
  const [detailLoading, setDetailLoading] = useState(false);

  const [isCategorySkillsModalOpen, setIsCategorySkillsModalOpen] =
    useState(false);

  const fetchUsers = useCallback(async () => {
    if (!user || !user.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/user/all`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // --- PERUBAHAN MAPPING ---
      setUsers(
        response.data.map((u) => ({
          ...u, // <-- Sertakan semua properti (termasuk statOutsourcer)
          id:
            u.id ||
            u.idAdmin ||
            u.idSales ||
            u.idExpert ||
            u.idAkademik ||
            u.idPM ||
            u.idHR ||
            u.idOutsourcer, // ID outsourcer
          name:
            u.name ||
            u.nmAdmin ||
            u.nmSales ||
            u.nmExpert ||
            u.nmAkademik ||
            u.nmPM ||
            u.nmHR ||
            u.nmOutsourcer, // Nama outsourcer
          email:
            u.email ||
            u.emailAdmin ||
            u.emailSales ||
            u.emailExpert ||
            u.emailAkademik ||
            u.emailPM ||
            u.emailHR ||
            u.emailOutsourcer, // Email outsourcer
          mobile:
            u.mobile ||
            u.mobileAdmin ||
            u.mobileSales ||
            u.mobileExpert ||
            u.mobileAkademik ||
            u.mobilePM ||
            u.mobileHR ||
            u.mobileOutsourcer, // Mobile outsourcer
          skills: u.skills,
          // statOutsourcer akan otomatis ada di 'u' karena query backend
        }))
      );
      // --- AKHIR PERUBAHAN MAPPING ---

      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("❌ Failed to fetch users.");
      setUsers([]);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ... (handleOpenAddModal, handleCloseAddModal, handleOpenCategorySkillsModal, handleCloseCategorySkillsModal) ...
  const handleOpenAddModal = (type) => {
    setAddUserType(type);
    setIsAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setAddUserType(null);
  };

  const handleOpenCategorySkillsModal = () => {
    setIsCategorySkillsModalOpen(true);
  };

  const handleCloseCategorySkillsModal = () => {
    setIsCategorySkillsModalOpen(false);
  };

  // --- handleAddUserSubmit (Sudah benar dari respons sebelumnya) ---
  const handleAddUserSubmit = async (formData) => {
    let url = "";
    let payload = {};

    switch (addUserType) {
      case "Admin":
        url = `${API_BASE}/api/admin`;
        payload = {
          nmAdmin: formData.name,
          emailAdmin: formData.email,
          password: formData.password,
          mobileAdmin: formData.mobile,
        };
        break;
      case "Sales":
        url = `${API_BASE}/api/sales`;
        payload = {
          nmSales: formData.name,
          emailSales: formData.email,
          password: formData.password,
          mobileSales: formData.mobile,
          role: formData.role,
          descSales: formData.descSales,
        };
        break;
      case "Expert":
        url = `${API_BASE}/api/expert`;
        payload = {
          nmExpert: formData.name,
          emailExpert: formData.email,
          password: formData.password,
          mobileExpert: formData.mobile,
          role: formData.role,
          skillCtgIds: formData.skillCtgIds,
          statExpert: formData.statExpert,
          Row: formData.Row,
        };
        break;
      case "Akademik":
        url = `${API_BASE}/api/admin/akademik`;
        payload = {
          nmAkademik: formData.name,
          emailAkademik: formData.email,
          password: formData.password,
          mobileAkademik: formData.mobile,
        };
        break;
      case "PM":
        url = `${API_BASE}/api/admin/pm`;
        payload = {
          nmPM: formData.name,
          emailPM: formData.email,
          password: formData.password,
          mobilePM: formData.mobile,
        };
        break;
      case "HR":
        url = `${API_BASE}/api/user/hr`;
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
        };
        break;
      case "Outsourcer":
        url = `${API_BASE}/api/outsourcer`;
        payload = {
          nmOutsourcer: formData.name,
          emailOutsourcer: formData.email,
          password: formData.password,
          mobileOutsourcer: formData.mobile,
          role: formData.role, // 'external' or 'internal'
          statOutsourcer: formData.statOutsourcer,
        };
        break;
      default:
        setErrorMessage("Invalid user type.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
    }

    try {
      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess(`✅ ${addUserType} user added successfully`);
      fetchUsers();
      handleCloseAddModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(
        `Error adding ${addUserType} user:`,
        error.response?.data || error.message
      );
      const backendError =
        error.response?.data?.error || `❌ Failed to add ${addUserType} user`;
      setErrorMessage(backendError);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // --- Edit & Delete Handlers (Sudah benar dari respons sebelumnya) ---
  const handleEditClick = async (userToEditData) => {
    const isExpertRole = ["Expert", "Trainer", "Head of Expert"].includes(
      userToEditData.role
    );

    setUserToEdit(userToEditData); // <-- Set data dasar dari tabel
    setIsEditModalOpen(true);

    if (isExpertRole && user?.token) {
      setDetailLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE}/api/expert/${userToEditData.id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setUserToEdit((prev) => ({
          ...prev, // Data dasar
          ...response.data, // Data detail (termasuk .skills)
          id: prev.id,
          name: response.data.nmExpert || prev.name,
          email: response.data.emailExpert || prev.email,
          mobile: response.data.mobileExpert || prev.mobile,
        }));
      } catch (err) {
        console.warn(
          "Expert detail fetch failed (non-blocking):",
          err?.response?.status || err.message
        );
        setErrorMessage(
          "Info: Gagal mengambil detail skills, menggunakan data dasar."
        );
        setTimeout(() => setErrorMessage(""), 3000);
      } finally {
        setDetailLoading(false);
      }
    }
    // Tidak perlu fetch detail untuk Outsourcer karena semua data (termasuk statOutsourcer) sudah diambil di fetchUsers
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
  };

  const buildPayloadForRole = (role, formData) => {
    const clean = (v) => (v === "" ? undefined : v);
    const p = {};
    if (["Expert", "Trainer", "Head of Expert"].includes(role)) {
      p.nmExpert = clean(formData.name);
      p.emailExpert = clean(formData.email);
      if (clean(formData.password)) p.password = formData.password;
      p.mobileExpert = clean(formData.mobile);
      p.role = clean(formData.role);
      if (formData.skillCtgIds) {
        p.skillCtgIds = Array.isArray(formData.skillCtgIds)
          ? formData.skillCtgIds
          : String(formData.skillCtgIds)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
      }
      if (clean(formData.statExpert)) p.statExpert = formData.statExpert;
      return p;
    }

    if (["Outsourcer", "external", "internal"].includes(role)) {
      p.name = clean(formData.name);
      p.email = clean(formData.email);
      if (clean(formData.password)) p.password = formData.password;
      p.mobile = clean(formData.mobile);
      p.role = clean(formData.role); // Mengirim 'external' atau 'internal'
      p.statOutsourcer = clean(formData.statOutsourcer); // Mengirim status
      return p;
    }

    p.name = clean(formData.name);
    p.email = clean(formData.email);
    if (clean(formData.password)) p.password = formData.password;
    p.mobile = clean(formData.mobile);
    p.role = clean(formData.role);
    if (["Sales", "Head Sales"].includes(role)) {
      p.descSales = clean(formData.descSales);
    }
    return p;
  };

  const handleEditUserSubmit = async (id, originalRole, formData) => {
    const targetRole = formData.role || originalRole;
    let endpoint = "";

    switch (targetRole) {
      case "Admin":
        endpoint = `${API_BASE}/api/user/Admin/${id}`;
        break;
      case "Sales":
      case "Head Sales":
        endpoint = `${API_BASE}/api/user/${targetRole}/${id}`;
        break;
      case "Expert":
      case "Trainer":
      case "Head of Expert":
        endpoint = `${API_BASE}/api/expert/${id}`;
        break;
      case "Akademik":
        endpoint = `${API_BASE}/api/user/Akademik/${id}`;
        break;
      case "PM":
        endpoint = `${API_BASE}/api/user/PM/${id}`;
        break;
      case "HR":
        endpoint = `${API_BASE}/api/user/HR/${id}`;
        break;
      case "Outsourcer":
      case "external":
      case "internal":
        // Gunakan role 'Outsourcer' untuk endpoint update generik
        endpoint = `${API_BASE}/api/user/Outsourcer/${id}`;
        break;
      default:
        setErrorMessage("❌ Invalid role for update.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
    }

    const payload = buildPayloadForRole(targetRole, formData);
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );

    try {
      const res = await axios.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("✅ User updated successfully");
      fetchUsers();
      handleCloseEditModal();
      setTimeout(() => setSuccess(""), 3000);
      return res;
    } catch (error) {
      const resp = error.response?.data;
      let msg = "❌ Failed to update user";
      if (resp) {
        if (Array.isArray(resp.errors) && resp.errors.length) {
          msg = resp.errors
            .map((e) => e.msg || e.message || JSON.stringify(e))
            .join("; ");
        } else if (resp.error) {
          msg = resp.error;
        } else {
          msg = JSON.stringify(resp);
        }
      }
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 6000);
    }
  };

  const handleDeleteClick = (userToDeleteData) => {
    setUserToDelete({
      id: userToDeleteData.id,
      role: userToDeleteData.role,
      name: userToDeleteData.name,
    });
    setIsDeleteConfirmOpen(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    let urlSuffix = "";
    // Gunakan role asli dari data user (termasuk 'external'/'internal')
    switch (userToDelete.role) {
      case "Admin":
        urlSuffix = `Admin/${userToDelete.id}`;
        break;
      case "Sales":
      case "Head Sales":
        urlSuffix = `${userToDelete.role}/${userToDelete.id}`;
        break;
      case "Expert":
      case "Trainer":
      case "Head of Expert":
        urlSuffix = `${userToDelete.role}/${userToDelete.id}`;
        break;
      case "Akademik":
        urlSuffix = `Akademik/${userToDelete.id}`;
        break;
      case "PM":
        urlSuffix = `PM/${userToDelete.id}`;
        break;
      case "HR":
        urlSuffix = `HR/${userToDelete.id}`;
        break;
      case "external":
      case "internal":
        // Gunakan role 'Outsourcer' untuk endpoint delete generik
        urlSuffix = `Outsourcer/${userToDelete.id}`;
        break;
      default:
        setErrorMessage("❌ Invalid role for delete.");
        setTimeout(() => setErrorMessage(""), 3000);
        handleCancelDelete();
        return;
    }

    try {
      await axios.delete(`${API_BASE}/api/user/${urlSuffix}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("✅ User deleted successfully");
      fetchUsers();
      handleCancelDelete();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "❌ Failed to delete user"
      );
      setTimeout(() => setErrorMessage(""), 5000);
      handleCancelDelete();
    }
  };

  // --- PERUBAHAN TAMPILAN ROLE ---
  const getRoleClass = (role) => {
    switch (role) {
      case "Sales":
        return "bg-green-100 text-green-800";
      case "Head Sales":
        return "bg-blue-100 text-blue-800";
      case "Admin":
        return "bg-yellow-100 text-yellow-800";
      case "Expert":
        return "bg-purple-100 text-purple-800";
      case "Trainer":
        return "bg-pink-100 text-pink-700";
      case "Head of Expert":
        return "bg-fuchsia-100 text-fuchsia-800";
      case "Akademik":
        return "bg-indigo-100 text-indigo-800";
      case "PM":
        return "bg-red-100 text-red-800";
      case "HR":
        return "bg-teal-100 text-teal-800";
      case "external": // <-- Tambahkan ini
      case "internal": // <-- Tambahkan ini
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleDisplayName = (role) => {
    if (role === "external" || role === "internal") {
      return "Outsourcer";
    }
    return role || "N/A";
  };
  // --- AKHIR PERUBAHAN TAMPILAN ROLE ---

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Users</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        <CreateUserButton onRoleSelect={handleOpenAddModal} />
        <button
          onClick={handleOpenCategorySkillsModal}
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition text-sm"
        >
          + Category Skills
        </button>
      </div>

      {success && (
        <p className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
          {success}
        </p>
      )}
      {errorMessage && (
        <p className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {errorMessage}
        </p>
      )}

      {loading && (
        <p className="text-center text-gray-500 py-4">Loading users...</p>
      )}

      {!loading && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={`${u.id}-${u.role}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {u.mobile || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {/* --- PERUBAHAN TAMPILAN ROLE --- */}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(
                          u.role
                        )}`}
                      >
                        {getRoleDisplayName(u.role)}
                      </span>
                      {/* --- AKHIR PERUBAHAN --- */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(u)}
                        title={`Edit ${u.name}`}
                        aria-label={`Edit ${u.name}`}
                        disabled={loading || detailLoading}
                        className="inline-flex items-center gap-2 px-2 py-1 mr-2 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 transition disabled:opacity-50"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span className="hidden md:inline text-sm">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteClick(u)}
                        title={`Delete ${u.name}`}
                        aria-label={`Delete ${u.name}`}
                        className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-900 transition"
                      >
                        <FaTrashAlt className="w-4 h-4" />
                        <span className="hidden md:inline text-sm">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals: Add User */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          title={`Tambah Pengguna ${addUserType}`}
        >
          <AddUserForm
            userType={addUserType}
            onClose={handleCloseAddModal}
            onSubmit={handleAddUserSubmit}
          />
        </Modal>
      )}

      {/* Modals: Edit User */}
      {isEditModalOpen && userToEdit && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title={`Edit User: ${userToEdit.name}`}
        >
          {detailLoading ? (
            <div className="text-center p-8">Memuat detail user...</div>
          ) : (
            <EditUserForm
              user={userToEdit} // userToEdit sekarang mungkin berisi skills
              onSubmit={handleEditUserSubmit}
              onClose={handleCloseEditModal}
            />
          )}
        </Modal>
      )}

      {/* Modals: Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={
          userToDelete
            ? `${userToDelete.name} (${getRoleDisplayName(userToDelete.role)})`
            : "User"
        }
      />

      {/* MODAL BARU: Category Skills */}
      {isCategorySkillsModalOpen && (
        <Modal
          isOpen={isCategorySkillsModalOpen}
          onClose={handleCloseCategorySkillsModal}
          title="Kelola Kategori Skills"
          maxWidthClass="sm:max-w-md md:max-w-lg"
        >
          <SkillCategoryModal onClose={handleCloseCategorySkillsModal} />
        </Modal>
      )}
    </>
  );
};

export default UserManagement;
