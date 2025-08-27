// frontend/src/components/AddUserForm.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";
import axios from "axios";

// Skema validasi diperbarui untuk menangani field kondisional
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string()
    .oneOf(["Sales", "Head Sales", "Admin", "Expert"])
    .required("Role is required"),
  mobile: Yup.string().required("Mobile number is required"),

  // Validasi field 'descSales' hanya jika rolenya Sales atau Head Sales
  descSales: Yup.string().when("role", {
    is: (role) => role === "Sales" || role === "Head Sales",
    then: (schema) => schema.optional(),
  }),

  // Validasi field 'idSkill' hanya jika rolenya Expert
  idSkill: Yup.string().when("role", {
    is: "Expert",
    then: (schema) => schema.required("Skill is required"),
  }),
  statExpert: Yup.string().when("role", {
    is: "Expert",
    then: (schema) => schema.optional(),
  }),
  Row: Yup.string().when("role", {
    is: "Expert",
    then: (schema) => schema.optional(),
  }),
});

const AddUserForm = ({ onClose, onSubmit }) => {
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState([]); // State untuk menampung daftar skill

  // State awal untuk semua field yang mungkin
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Sales", // Default role
    mobile: "",
    descSales: "",
    idSkill: "",
    statExpert: "",
    Row: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Mengambil data skills dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchSkills = async () => {
      if (user.token) {
        try {
          const response = await axios.get("http://localhost:3000/api/skills", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setSkills(response.data);
        } catch (error) {
          console.error("Failed to fetch skills", error);
          setErrorMessage("Could not load skills data.");
        }
      }
    };
    fetchSkills();
  }, [user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Hapus pesan error untuk field yang sedang diubah
    setErrors({ ...errors, [e.target.name]: "" });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validasi semua data dalam form
      await validationSchema.validate(formData, { abortEarly: false });
      // Kirim data ke parent component untuk diproses
      await onSubmit(formData);
    } catch (error) {
      if (error.name === "ValidationError") {
        // Jika ada error validasi, tampilkan pesan di bawah setiap field
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // Jika error dari server
        setErrorMessage(
          error.response?.data?.error || "Failed to add new user."
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}

      {/* --- Bagian Field Umum --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Nama</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="Sales">Sales</option>
            <option value="Head Sales">Head Sales</option>
            <option value="Admin">Admin</option>
            <option value="Expert">Expert</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-1">
            Nomor HP
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
          )}
        </div>
      </div>

      <hr className="my-4" />

      {/* --- Bagian Field Khusus Sales (Muncul jika role = Sales/Head Sales) --- */}
      {(formData.role === "Sales" || formData.role === "Head Sales") && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Detail Sales</h3>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Deskripsi Sales (Opsional)
            </label>
            <textarea
              name="descSales"
              value={formData.descSales}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder="Tambahkan catatan atau keterangan khusus tentang sales..."
            />
          </div>
        </div>
      )}

      {/* --- Bagian Field Khusus Expert (Muncul jika role = Expert) --- */}
      {formData.role === "Expert" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Detail Expert</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Skill Utama *
              </label>
              <select
                name="idSkill"
                value={formData.idSkill}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Pilih Skill</option>
                {skills.map((skill) => (
                  <option key={skill.idSkill} value={skill.idSkill}>
                    {skill.nmSkill}
                  </option>
                ))}
              </select>
              {errors.idSkill && (
                <p className="text-red-500 text-sm mt-1">{errors.idSkill}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Status Expert (Opsional)
              </label>
              <input
                type="text"
                name="statExpert"
                value={formData.statExpert}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="Contoh: Aktif, Freelance, dll."
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              name="Row"
              value={formData.Row}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="3"
              placeholder="Catatan tambahan mengenai expert..."
            />
          </div>
        </div>
      )}

      {/* --- Tombol Aksi --- */}
      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          Tambah Pengguna
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
