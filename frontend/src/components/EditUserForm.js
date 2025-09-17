import React, { useState, useEffect } from "react";

const EditUserForm = ({ user, onSubmit, onClose }) => {

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "", // kosongkan, hanya diisi jika ingin ganti password
    role: user.role || "",
    mobile: user.mobile || "",
    descSales: user.descSales || "",
  });

  // Update formData setiap kali user berubah
  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "",
      mobile: user.mobile || "",
      descSales: user.descSales || "",
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password (kosongkan jika tidak ingin mengubah)</label>
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
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      {/* Field khusus Sales */}
      {formData.role === 'Sales' || formData.role === 'Head Sales' ? (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Sales Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="Sales">Sales</option>
              <option value="Head Sales">Head Sales</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea name="descSales" value={formData.descSales} onChange={handleChange} className="w-full p-2 border rounded-md" rows="3" />
          </div>
        </div>
      ) : null}

      <div className="flex justify-end space-x-2 mt-4">
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
          Save
        </button>
      </div>
    </form>
  );
};

export default EditUserForm;
