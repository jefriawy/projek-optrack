// frontend/src/components/UserManagement.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "", mobileSales: "", descSales: "",
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().oneOf(["Sales", "Admin", "HC", "Expert", "Trainer", "Head Sales"]).required("Role is required"),
    mobileSales: Yup.string().matches(/^\d*$/, "Phone number must be numeric").when("role", {
      is: "Sales",
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.notRequired(),
    }),
    descSales: Yup.string().optional(),
  });

  const fetchUsers = () => {
    if (user && user.token) {
      axios.get("http://localhost:3000/api/user", { headers: { Authorization: `Bearer ${user.token}` } })
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Error fetching users:", error));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortsEarly: false });
      await axios.post("http://localhost:3000/api/user", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("User created successfully");
      setFormData({ name: "", email: "", password: "", role: "", mobileSales: "", descSales: "", });
      fetchUsers();
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => { validationErrors[err.path] = err.message; });
        setErrors(validationErrors);
      } else {
        setErrorMessage(error.response?.data?.error || "Failed to create user");
      }
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess("User deleted successfully");
      fetchUsers();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to delete user");
    }
  };

  if (!user || user.role !== "Admin") return <div className="text-center mt-20 text-red-500">Unauthorized</div>;

  return (
    <div className="user-management-container">
      <h2 className="user-management-title">User Management</h2>
      {success && <p className="text-green-500 mb-4">{success}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="user-management-form">
        <div className="form-grid">
          <div>
            <label className="form-label">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div>
            <label className="form-label">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="form-input">
              <option value="">Select Role</option>
              <option value="Sales">Sales</option>
              <option value="Admin">Admin</option>
              <option value="HC">HC</option>
              <option value="Expert">Expert</option>
              <option value="Trainer">Trainer</option>
              <option value="Head Sales">Head Sales</option>
            </select>
            {errors.role && <p className="error">{errors.role}</p>}
          </div>
        </div>
        {formData.role === "Sales" && (
          <div className="mt-4 form-grid">
            <div>
              <label className="form-label">Mobile Sales</label>
              <input type="text" name="mobileSales" value={formData.mobileSales} onChange={handleChange} className="form-input" placeholder="Enter phone number" />
              {errors.mobileSales && <p className="error">{errors.mobileSales}</p>}
            </div>
            <div>
              <label className="form-label">Description Sales</label>
              <textarea name="descSales" value={formData.descSales} onChange={handleChange} className="form-input" placeholder="Enter description" />
              {errors.descSales && <p className="error">{errors.descSales}</p>}
            </div>
          </div>
        )}
        <button type="submit" className="login-btn mt-6">Add User</button>
      </form>
      
      <h3 className="user-list-title">User List</h3>
      <div className="user-list-table-wrapper">
        <table className="user-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDelete(user.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;