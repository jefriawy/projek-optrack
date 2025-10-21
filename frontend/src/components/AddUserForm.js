// frontend/src/components/AddUserForm.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";
import axios from "axios";
import Select from "react-select"; // Import react-select

// Define separate validation schemas for each user type for clarity
// ... (adminSchema, salesSchema, akademikSchema, pmSchema remain the same) ...
const adminSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(), // Make mobile optional if needed, or keep required
});

const salesSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(), // Make mobile optional if needed
  role: Yup.string()
    .oneOf(["Sales", "Head Sales"])
    .required("Role is required"),
  descSales: Yup.string().optional(),
});

// Update expertSchema for multi-skill
const expertSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(), // Make mobile optional
  // Change idSkill to skillCtgIds: an array, can be empty, but items must be numbers
  skillCtgIds: Yup.array()
    .of(Yup.number().integer().positive("Skill ID must be positive"))
    .nullable() // Allow empty selection initially
    .default([]), // Default to empty array
  role: Yup.string()
    .oneOf(["Expert", "Trainer", "Head of Expert"])
    .required("Role is required"), // Added Head of Expert
  statExpert: Yup.string().optional(),
  Row: Yup.string().optional(),
});

const akademikSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(),
});

const pmSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(),
});

const validationSchemaMap = {
  Admin: adminSchema,
  Sales: salesSchema,
  Expert: expertSchema,
  Akademik: akademikSchema,
  PM: pmSchema,
};

const AddUserForm = ({ userType, onClose, onSubmit }) => {
  const { user } = useContext(AuthContext);
  // Rename skills state to skillCategories
  const [skillCategories, setSkillCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]); // For react-select multi

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    // Default role based on userType
    role:
      userType === "Expert"
        ? "Expert"
        : userType === "Sales"
        ? "Sales"
        : userType === "Akademik"
        ? "Akademik"
        : userType === "PM"
        ? "PM"
        : userType === "Admin"
        ? "Admin"
        : "", // Add default for Admin
    // Sales specific
    descSales: "",
    // Expert specific (keep state simple, derive skillCtgIds on submit)
    // No idSkill or skillCtgIds here initially
    statExpert: "",
    Row: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch Skill Categories when userType is Expert
  useEffect(() => {
    if (userType === "Expert") {
      const fetchSkillCategories = async () => {
        if (user.token) {
          try {
            // Use the new endpoint
            const response = await axios.get(
              "http://localhost:3000/api/skill-categories",
              {
                headers: { Authorization: `Bearer ${user.token}` },
              }
            );
            // Map data for react-select options
            const options = response.data.map((cat) => ({
              value: cat.idSkillCtg,
              label: cat.nmSkillCtg,
            }));
            setSkillCategories(options);
          } catch (error) {
            console.error("Failed to fetch skill categories", error);
            // Optionally set an error state here
          }
        }
      };
      fetchSkillCategories();
    }
    // Reset skills when switching user type
    setSelectedSkills([]);
    setSkillCategories([]);
  }, [userType, user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handler specifically for react-select multi
  const handleMultiSelectChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []); // Ensure it's always an array
    // Clear potential validation error for skills
    setErrors((prevErrors) => ({ ...prevErrors, skillCtgIds: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentValidationSchema = validationSchemaMap[userType];

    // Prepare payload, extracting skill IDs from selectedSkills for Expert
    let payload = { ...formData };
    if (userType === "Expert") {
      payload.skillCtgIds = selectedSkills.map((skill) => skill.value);
    }

    try {
      await currentValidationSchema.validate(payload, { abortEarly: false });
      // Submit the potentially modified payload (with skillCtgIds)
      await onSubmit(payload);
      // Reset form or close modal handled by parent component (UserManagement)
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        console.log("Validation Errors:", validationErrors);
        setErrors(validationErrors);
      } else {
        // API errors are handled in UserManagement.js
        console.error("Submission error:", error);
      }
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused
        ? "#3b82f6"
        : errors.skillCtgIds
        ? "#ef4444"
        : "#d1d5db", // Error border color
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
    menu: (base) => ({ ...base, zIndex: 50 }), // Ensure dropdown is above other elements
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* --- Common Fields --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>
      </div>

      <hr className="my-4" />

      {/* --- Conditional Fields --- */}

      {/* Sales */}
      {userType === "Sales" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Sales Details</h3>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
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
              <option value="Sales">Sales</option>
              <option value="Head Sales">Head Sales</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description (Optional)
            </label>
            <textarea
              name="descSales"
              value={formData.descSales}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>
        </div>
      )}

      {/* Akademik */}
      {userType === "Akademik" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Akademik Details</h3>
          {/* Role is fixed */}
          <input type="hidden" name="role" value="Akademik" />
          {/* Add other Akademik-specific fields if any */}
        </div>
      )}

      {/* PM */}
      {userType === "PM" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">
            Project Manager Details
          </h3>
          {/* Role is fixed */}
          <input type="hidden" name="role" value="PM" />
          {/* Add other PM-specific fields if any */}
        </div>
      )}

      {/* Admin */}
      {userType === "Admin" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Admin Details</h3>
          {/* Role is fixed */}
          <input type="hidden" name="role" value="Admin" />
          {/* Add other Admin-specific fields if any */}
        </div>
      )}

      {/* Expert */}
      {userType === "Expert" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">
            Expert/Trainer Details
          </h3>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
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
              <option value="Expert">Expert</option>
              <option value="Trainer">Trainer</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Skills (Pilih satu atau lebih)
            </label>
            <Select
              isMulti
              name="skillCtgIds" // Name matches validation schema path
              options={skillCategories}
              className="basic-multi-select"
              classNamePrefix="select"
              value={selectedSkills}
              onChange={handleMultiSelectChange}
              placeholder="Pilih skill..."
              styles={selectStyles} // Apply custom styles for error indication
            />
            {/* Display validation error for the array itself if needed */}
            {errors.skillCtgIds && typeof errors.skillCtgIds === "string" && (
              <p className="text-red-500 text-sm mt-1">{errors.skillCtgIds}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Status (Optional)
            </label>
            <input
              type="text"
              name="statExpert"
              value={formData.statExpert}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="Row"
              value={formData.Row}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Add User
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
