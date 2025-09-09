// frontend/src/components/AddUserForm.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";
import axios from "axios";

// Define separate validation schemas for each user type for clarity
const adminSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  mobile: Yup.string().required("Mobile number is required"),
});

const salesSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  mobile: Yup.string().required("Mobile number is required"),
  role: Yup.string().oneOf(['Sales', 'Head Sales']).required("Role is required"),
  descSales: Yup.string().optional(),
});

const expertSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  mobile: Yup.string().required("Mobile number is required"),
  idSkill: Yup.string().required("Skill is required"),
  role: Yup.string().oneOf(["Expert", "Head of Expert"]).required("Role is required"),
  statExpert: Yup.string().optional(),
  Row: Yup.string().optional(),
});

const validationSchemaMap = {
  Admin: adminSchema,
  Sales: salesSchema,
  Expert: expertSchema,
};

const AddUserForm = ({ userType, onClose, onSubmit }) => {
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: userType === "Expert" ? "Expert" : "Sales", // Default sesuai tipe user
    descSales: "",
    idSkill: "",
    statExpert: "",
    Row: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userType === 'Expert') {
      const fetchSkills = async () => {
        if (user.token) {
          try {
            const response = await axios.get("http://localhost:3000/api/skills", {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            setSkills(response.data);
          } catch (error) {
            console.error("Failed to fetch skills", error);
          }
        }
      };
      fetchSkills();
    }
  }, [userType, user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentValidationSchema = validationSchemaMap[userType];
    try {
      await currentValidationSchema.validate(formData, { abortEarly: false });
      await onSubmit(formData);
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // Errors from parent (API calls) are handled in UserManagement.js
        console.error("Submission error:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* --- Common Fields for All User Types --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded-md" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Mobile Number</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-2 border rounded-md" />
          {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
        </div>
      </div>

      <hr className="my-4" />

      {/* --- Conditional Fields for Sales --- */}
      {userType === 'Sales' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Sales Details</h3>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="Sales">Sales</option>
              <option value="Head Sales">Head Sales</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Description (Optional)</label>
            <textarea name="descSales" value={formData.descSales} onChange={handleChange} className="w-full p-2 border rounded-md" rows="3" />
          </div>
        </div>
      )}

      {/* --- Conditional Fields for Expert --- */}
      {userType === 'Expert' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Expert Details</h3>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="Expert">Expert</option>
              <option value="Head of Expert">Head of Expert</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Primary Skill *</label>
            <select name="idSkill" value={formData.idSkill} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="">Select Skill</option>
              {skills.map((skill) => (
                <option key={skill.idSkill} value={skill.idSkill}>{skill.nmSkill}</option>
              ))}
            </select>
            {errors.idSkill && <p className="text-red-500 text-sm mt-1">{errors.idSkill}</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Status (Optional)</label>
            <input type="text" name="statExpert" value={formData.statExpert} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Notes (Optional)</label>
            <textarea name="Row" value={formData.Row} onChange={handleChange} className="w-full p-2 border rounded-md" rows="3" />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
          Cancel
        </button>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
          Add User
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
