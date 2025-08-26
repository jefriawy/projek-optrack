import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  role: Yup.string().oneOf(["Sales", "Head Sales", "Admin", "Human Capital", "Trainer", "Expert"]).required("Role is required"),
  secondRole: Yup.string().oneOf(["", "Sales", "Head Sales", "Admin", "Human Capital", "Trainer", "Expert"]).optional(),
  mobileSales: Yup.string().matches(/^\d*$/, "Phone number must be numeric").optional(),
});

const UpdateUserForm = ({ onClose, onSubmit, userToEdit }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Sales",
    secondRole: "",
    mobileSales: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        role: userToEdit.role || "Sales",
        secondRole: userToEdit.secondRole || "",
        mobileSales: userToEdit.mobileSales || "",
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setErrorMessage("");
  };

  const handleClearSecondRole = () => {
    setFormData({ ...formData, secondRole: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortsEarly: false });
      await onSubmit(userToEdit.id, formData);
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrorMessage(error.response?.data?.error || "Failed to update user.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Nama</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md" required>
            <option value="Sales">Sales</option>
            <option value="Head Sales">Head Sales</option>
            <option value="Admin">Admin</option>
            <option value="Human Capital">Human Capital</option>
            <option value="Trainer">Trainer</option>
            <option value="Expert">Expert</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Second Role (Opsional)</label>
          <div className="flex items-center">
            <select name="secondRole" value={formData.secondRole} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="">None</option>
              <option value="Sales">Sales</option>
              <option value="Head Sales">Head Sales</option>
              <option value="Admin">Admin</option>
              <option value="Human Capital">Human Capital</option>
              <option value="Trainer">Trainer</option>
              <option value="Expert">Expert</option>
            </select>
            {formData.secondRole && (
              <button type="button" onClick={handleClearSecondRole} className="ml-2 text-red-500 hover:text-red-700">
                Clear
              </button>
            )}
          </div>
          {errors.secondRole && <p className="text-red-500 text-sm mt-1">{errors.secondRole}</p>}
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Nomor HP</label>
        <input type="text" name="mobileSales" value={formData.mobileSales} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Opsional" />
        {errors.mobileSales && <p className="text-red-500 text-sm mt-1">{errors.mobileSales}</p>}
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
          Batal
        </button>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
          Update Pengguna
        </button>
      </div>
    </form>
  );
};

export default UpdateUserForm;