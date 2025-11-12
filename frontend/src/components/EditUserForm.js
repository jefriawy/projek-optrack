// frontend/src/components/EditUserForm.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Select from "react-select"; // Import react-select

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const EditUserForm = ({ user: userToEditProp, onSubmit, onClose }) => {
  const { user: authUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    mobile: "",
    descSales: "",
    statExpert: "",
    Row: "",
    statOutsourcer: "", // <-- TAMBAHKAN INI
  });

  const [skillCategories, setSkillCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [initialSkillsLoaded, setInitialSkillsLoaded] = useState(false);
  const [errors, setErrors] = useState({});

  // Effect untuk mengisi form saat userToEditProp berubah
  useEffect(() => {
    if (userToEditProp) {
      setFormData({
        name: userToEditProp.name || "",
        email: userToEditProp.email || "",
        password: "",
        role: userToEditProp.role || "",
        mobile:
          userToEditProp.mobile ||
          userToEditProp.mobileSales ||
          userToEditProp.mobileExpert ||
          userToEditProp.mobileAkademik ||
          userToEditProp.mobilePM ||
          userToEditProp.mobileHR || // <-- TAMBAHAN
          userToEditProp.mobileOutsourcer || // <-- TAMBAHAN
          "",
        // Specific fields
        descSales: userToEditProp.descSales || "",
        statExpert: userToEditProp.statExpert || "",
        Row: userToEditProp.Row || "",
        statOutsourcer: userToEditProp.statOutsourcer || "", // <-- TAMBAHAN
      });

      setSelectedSkills([]);
      setInitialSkillsLoaded(false);
    }
  }, [userToEditProp]);

  // ... (useEffect untuk fetchSkillCategories tetap sama) ...
  useEffect(() => {
    const isExpertRole = ["Expert", "Trainer", "Head of Expert"].includes(
      formData.role
    );
    if (isExpertRole && authUser?.token) {
      const fetchSkillCategories = async () => {
        try {
          const response = await axios.get(`${API_BASE}/api/skill-categories`, {
            headers: { Authorization: `Bearer ${authUser.token}` },
          });
          const options = response.data.map((cat) => ({
            value: cat.idSkillCtg,
            label: cat.nmSkillCtg,
          }));
          setSkillCategories(options);
        } catch (error) {
          console.error("Failed to fetch skill categories:", error);
          setSkillCategories([]);
          setErrors((prev) => ({ ...prev, skills: "Failed to load skills." }));
        }
      };
      fetchSkillCategories();
    } else {
      setSkillCategories([]);
    }
  }, [formData.role, authUser?.token]);

  // ... (useEffect untuk set CURRENT skills tetap sama) ...
  useEffect(() => {
    const isExpertRole = ["Expert", "Trainer", "Head of Expert"].includes(
      formData.role
    );
    if (
      isExpertRole &&
      userToEditProp?.id &&
      skillCategories.length > 0 &&
      !initialSkillsLoaded &&
      authUser?.token
    ) {
      const fetchExpertDetailsIncludingSkills = async () => {
        try {
          // userToEditProp.skills diambil dari fetch detail di UserManagement.js
          const currentSkillIds =
            userToEditProp.skills?.map((s) => s.idSkillCtg) || [];

          const initialSelection = skillCategories.filter((option) =>
            currentSkillIds.includes(option.value)
          );
          setSelectedSkills(initialSelection);
          setInitialSkillsLoaded(true);
        } catch (error) {
          console.error("Failed to set expert's current skills:", error);
        }
      };
      fetchExpertDetailsIncludingSkills();
    } else if (!isExpertRole) {
      setSelectedSkills([]);
      setInitialSkillsLoaded(false);
    }
  }, [
    formData.role,
    userToEditProp,
    skillCategories,
    initialSkillsLoaded,
    authUser?.token,
  ]);

  // ... (handleChange dan handleMultiSelectChange tetap sama) ...
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "role") {
      setSelectedSkills([]);
      setInitialSkillsLoaded(false);
    }
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
    setErrors((prev) => ({ ...prev, skillCtgIds: "" }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = { ...formData };

    const isExpertRole = ["Expert", "Trainer", "Head of Expert"].includes(
      formData.role
    );
    if (isExpertRole) {
      payload.skillCtgIds = selectedSkills.map((skill) => skill.value);
    } else {
      delete payload.skillCtgIds;
    }

    let formIsValid = true;
    let newErrors = {};
    if (!payload.name) {
      newErrors.name = "Name is required";
      formIsValid = false;
    }
    if (!payload.email) {
      newErrors.email = "Email is required";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      onSubmit(userToEditProp.id, userToEditProp.role, payload);
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused
        ? "#3b82f6"
        : errors.skillCtgIds
        ? "#ef4444"
        : "#d1d5db",
      "&:hover": {
        borderColor: state.isFocused
          ? "#3b82f6"
          : errors.skillCtgIds
          ? "#ef4444"
          : "#9ca3af",
      },
      boxShadow: state.isFocused
        ? "0 0 0 1px #3b82f6"
        : errors.skillCtgIds
        ? "0 0 0 1px #ef4444"
        : "none",
    }),
    menu: (base) => ({ ...base, zIndex: 50 }),
  };

  // Tentukan role untuk field kondisional
  const role = formData.role;
  const isSalesRole = role === "Sales" || role === "Head Sales";
  const isExpertRole =
    role === "Expert" || role === "Trainer" || role === "Head of Expert";
  const isAdminRole = role === "Admin";
  const isAkademikRole = role === "Akademik";
  const isPmRole = role === "PM";
  const isHrRole = role === "HR"; // <-- TAMBAHAN
  const isOutsourcerRole = role === "external" || role === "internal"; // <-- TAMBAHAN

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Common Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password (kosongkan jika tidak ingin mengubah)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md p-2 ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
          )}
        </div>
      </div>

      {/* --- PERUBAHAN DROPDOWN ROLE --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Role *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md ${
            errors.role ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="Admin">Admin</option>
          <option value="Sales">Sales</option>
          <option value="Head Sales">Head Sales</option>
          <option value="Expert">Expert</option>
          <option value="Trainer">Trainer</option>
          <option value="Head of Expert">Head of Expert</option>
          <option value="Akademik">Akademik</option>
          <option value="PM">PM</option>
          <option value="HR">HR</option>
          <option value="external">Outsourcer (External)</option>
          <option value="internal">Outsourcer (Internal)</option>
        </select>
        {errors.role && (
          <p className="text-red-500 text-xs mt-1">{errors.role}</p>
        )}
      </div>
      {/* --- AKHIR PERUBAHAN DROPDOWN --- */}

      {/* Sales Specific Fields */}
      {isSalesRole && (
        <div className="space-y-4 pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">Sales Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              name="descSales"
              value={formData.descSales}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows="3"
            />
          </div>
        </div>
      )}

      {/* Expert Specific Fields */}
      {isExpertRole && (
        <div className="space-y-4 pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">
            Expert/Trainer Details
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Skills (Pilih satu atau lebih)
            </label>
            <Select
              isMulti
              name="skillCtgIds"
              options={skillCategories}
              className="basic-multi-select mt-1"
              classNamePrefix="select"
              value={selectedSkills}
              onChange={handleMultiSelectChange}
              placeholder="Pilih skill..."
              isLoading={!skillCategories.length && isExpertRole}
              styles={selectStyles}
            />
            {errors.skillCtgIds && typeof errors.skillCtgIds === "string" && (
              <p className="text-red-500 text-xs mt-1">{errors.skillCtgIds}</p>
            )}
            {errors.skills && (
              <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status (Optional)
            </label>
            <input
              type="text"
              name="statExpert"
              value={formData.statExpert}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              name="Row"
              value={formData.Row}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows="3"
            />
          </div>
        </div>
      )}

      {/* --- TAMBAHAN BLOK KONDISIONAL --- */}
      {isAdminRole && (
        <div className="pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">Admin Details</h3>
        </div>
      )}
      {isAkademikRole && (
        <div className="pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">Akademik Details</h3>
        </div>
      )}
      {isPmRole && (
        <div className="pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">PM Details</h3>
        </div>
      )}
      {isHrRole && (
        <div className="pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">HR Details</h3>
        </div>
      )}

      {/* Outsourcer Specific Fields */}
      {isOutsourcerRole && (
        <div className="space-y-4 pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">Outsourcer Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status (Optional)
            </label>
            <input
              type="text"
              name="statOutsourcer"
              value={formData.statOutsourcer || ""} // Gunakan statOutsourcer
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Contoh: Active, On Contract"
            />
          </div>
        </div>
      )}
      {/* --- AKHIR TAMBAHAN --- */}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
