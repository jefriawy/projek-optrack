// frontend/src/components/EditUserForm.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Select from "react-select"; // Import react-select

// Base URL (redundant if using AuthContext token for API calls, but good for consistency)
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const EditUserForm = ({ user: userToEditProp, onSubmit, onClose }) => {
  const { user: authUser } = useContext(AuthContext); // Logged-in admin user

  // Initialize form state based on the user being edited
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Keep password blank initially for updates
    role: "",
    mobile: "",
    // Sales specific
    descSales: "",
    // Expert specific
    statExpert: "",
    Row: "",
    // skillCtgIds will be derived from selectedSkills state
  });

  const [skillCategories, setSkillCategories] = useState([]); // Available skill categories
  const [selectedSkills, setSelectedSkills] = useState([]); // Currently selected skills for the expert
  const [initialSkillsLoaded, setInitialSkillsLoaded] = useState(false); // Flag to load skills once
  const [errors, setErrors] = useState({}); // Validation errors

  // Effect to populate form when userToEditProp changes or on initial load
  useEffect(() => {
    if (userToEditProp) {
      setFormData({
        name: userToEditProp.name || "",
        email: userToEditProp.email || "",
        password: "", // Always start blank for edit
        role: userToEditProp.role || "",
        mobile:
          userToEditProp.mobile ||
          userToEditProp.mobileSales ||
          userToEditProp.mobileExpert ||
          userToEditProp.mobileAkademik ||
          userToEditProp.mobilePM ||
          "",
        // Specific fields based on potential role in the passed user object
        descSales: userToEditProp.descSales || "",
        statExpert: userToEditProp.statExpert || "",
        Row: userToEditProp.Row || "",
      });

      // Reset skill states if the user changes
      setSelectedSkills([]);
      setInitialSkillsLoaded(false); // Allow skills to reload for the new user
    }
  }, [userToEditProp]);

  // Effect to fetch available skill categories IF the user being edited is an Expert/Trainer/Head of Expert
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
          setSkillCategories([]); // Clear on error
          setErrors((prev) => ({ ...prev, skills: "Failed to load skills." }));
        }
      };
      fetchSkillCategories();
    } else {
      setSkillCategories([]); // Clear if not an expert role
    }
  }, [formData.role, authUser?.token]); // Re-run if role changes

  // Effect to fetch and set the CURRENT skills of the expert being edited
  useEffect(() => {
    const isExpertRole = ["Expert", "Trainer", "Head of Expert"].includes(
      formData.role
    );
    // Fetch only if it's an expert role, we have categories, and haven't loaded initial skills yet
    if (
      isExpertRole &&
      userToEditProp?.id &&
      skillCategories.length > 0 &&
      !initialSkillsLoaded &&
      authUser?.token
    ) {
      const fetchExpertDetailsIncludingSkills = async () => {
        try {
          // Assuming you have an endpoint like this, or adjust as needed
          // It should return the expert details including an array of their current skillCtgIds or skill objects
          // For now, let's assume `userToEditProp` might contain a `skills` array like [{ idSkillCtg: 1, nmSkillCtg: 'JS' }]
          // If not, you'd fetch from `/api/expert/:id` which should include skills

          // Example: If userToEditProp.skills is like [{idSkillCtg: 5}, {idSkillCtg: 2}]
          const currentSkillIds =
            userToEditProp.skills?.map((s) => s.idSkillCtg) || [];

          // Map the IDs to the { value, label } format needed by react-select, using the fetched categories
          const initialSelection = skillCategories.filter((option) =>
            currentSkillIds.includes(option.value)
          );
          setSelectedSkills(initialSelection);
          setInitialSkillsLoaded(true); // Mark as loaded
        } catch (error) {
          console.error("Failed to fetch expert's current skills:", error);
          // Handle error - maybe show a message
        }
      };
      fetchExpertDetailsIncludingSkills();
    }
    // If the role is not expert, ensure selected skills are cleared
    else if (!isExpertRole) {
      setSelectedSkills([]);
      setInitialSkillsLoaded(false); // Reset flag if role changes away from expert
    }
  }, [
    formData.role,
    userToEditProp,
    skillCategories,
    initialSkillsLoaded,
    authUser?.token,
  ]); // Dependencies

  // Standard form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear specific error on change

    // If role changes, reset skills states
    if (name === "role") {
      setSelectedSkills([]);
      setInitialSkillsLoaded(false); // Force reload of skills if role changes back to expert
    }
  };

  // Handler for react-select multi (for skills)
  const handleMultiSelectChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
    setErrors((prev) => ({ ...prev, skillCtgIds: "" })); // Clear skill validation error
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare the payload to send to the backend
    let payload = { ...formData };

    // If it's an expert, add the skill IDs array
    const isExpertRole = ["Expert", "Trainer", "Head of Expert"].includes(
      formData.role
    );
    if (isExpertRole) {
      payload.skillCtgIds = selectedSkills.map((skill) => skill.value);
    } else {
      // Ensure skillCtgIds is not sent or is empty if not an expert
      delete payload.skillCtgIds;
    }

    // Basic Frontend Validation (Optional, can rely on backend or add Yup)
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
    // Add more validation if needed

    setErrors(newErrors);

    if (formIsValid) {
      // Call the onSubmit prop passed from UserManagement, passing the ID and payload
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

  // Determine which fields to show based on the role
  const role = formData.role;
  const isSalesRole = role === "Sales" || role === "Head Sales";
  const isExpertRole =
    role === "Expert" || role === "Trainer" || role === "Head of Expert";
  const isAdminRole = role === "Admin";
  const isAkademikRole = role === "Akademik";
  const isPmRole = role === "PM";

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
          {/* No error display for optional password */}
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

      {/* Role Selection (Only allow changing within compatible groups if needed, but simple dropdown for now) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Role *
        </label>
        {/* Simple select for all roles */}
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
        </select>
        {errors.role && (
          <p className="text-red-500 text-xs mt-1">{errors.role}</p>
        )}
      </div>

      {/* Sales Specific Fields */}
      {isSalesRole && (
        <div className="space-y-4 pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">Sales Details</h3>
          {/* Role selection specifically for Sales/Head Sales if needed, but handled above */}
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
          {/* Role selection specifically for Expert/Trainer/Head if needed, but handled above */}
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
              isLoading={!skillCategories.length && isExpertRole} // Show loading state
              styles={selectStyles}
            />
            {errors.skillCtgIds && typeof errors.skillCtgIds === "string" && (
              <p className="text-red-500 text-xs mt-1">{errors.skillCtgIds}</p>
            )}
            {errors.skills && (
              <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
            )}{" "}
            {/* Error fetching skills */}
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

      {/* Fields for other roles (Admin, Akademik, PM) - Add if they have specific editable fields */}
      {isAdminRole && (
        <div className="pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">Admin Details</h3>{" "}
          {/* Admin specific fields */}{" "}
        </div>
      )}
      {isAkademikRole && (
        <div className="pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">Akademik Details</h3>{" "}
          {/* Akademik specific fields */}{" "}
        </div>
      )}
      {isPmRole && (
        <div className="pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">PM Details</h3>{" "}
          {/* PM specific fields */}{" "}
        </div>
      )}

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
