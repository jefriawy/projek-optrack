import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";
import axios from "axios";
import Select from "react-select"; 

// Define separate validation schemas for each user type for clarity
const adminSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(),
});

const salesSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(),
  role: Yup.string()
    .oneOf(["Sales", "Head Sales"])
    .required("Role is required"),
  descSales: Yup.string().optional(),
});

// Expert schema for dynamic multi-skill with details
const expertSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(),
  
  // Skema array untuk validasi skill yang dipilih
  expertSkills: Yup.array()
    .of(
      Yup.object({
        idSkillCtg: Yup.number().required('Skill ID is required'), 
        experience: Yup.string().required('Pengalaman is required'), 
        certificate: Yup.mixed().nullable(), 
      })
    )
    .min(1, 'Minimal satu Skill harus ditambahkan.') 
    .required('Minimal satu Skill harus ditambahkan.'),

  role: Yup.string()
    .oneOf(["Expert", "Trainer", "Head of Expert"])
    .required("Role is required"),
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

const hrSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(),
});

const outsourcerSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  mobile: Yup.string().optional(),
  role: Yup.string()
    .oneOf(["external", "internal"])
    .required("Role is required"),
  statOutsourcer: Yup.string().optional(),
});

const validationSchemaMap = {
  Admin: adminSchema,
  Sales: salesSchema,
  Expert: expertSchema,
  Akademik: akademikSchema,
  PM: pmSchema,
  HR: hrSchema,
  Outsourcer: outsourcerSchema, 
};

const AddUserForm = ({ userType, onClose, onSubmit }) => {
  const { user } = useContext(AuthContext);
  const API_BASE = "http://localhost:3000"; 
  
  const [skillCategories, setSkillCategories] = useState([]); 
  const [expertSkills, setExpertSkills] = useState([]); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
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
        : userType === "HR"
        ? "HR"
        : userType === "Outsourcer"
        ? "external" 
        : "",
    descSales: "",
    statExpert: "",
    Row: "",
    statOutsourcer: "", 
  });

  const [errors, setErrors] = useState({});

  // Fetch Skill Categories when userType is Expert
  useEffect(() => {
    setExpertSkills([]); 
    setSkillCategories([]);

    if (userType === "Expert") {
      const fetchSkillCategories = async () => {
        if (user.token) {
          try {
            const response = await axios.get(
              `${API_BASE}/api/skill-categories`,
              {
                headers: { Authorization: `Bearer ${user.token}` },
              }
            );
            const options = response.data.map((cat) => ({
              value: cat.idSkillCtg,
              label: cat.nmSkillCtg,
            }));
            setSkillCategories(options);
          } catch (error) {
            console.error("Failed to fetch skill categories", error);
          }
        }
      };
      fetchSkillCategories();
    }
  }, [userType, user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  
  // Handler untuk memilih skill dari dropdown dan menambahkannya ke array
  const handleSkillSelect = (selectedOption) => {
    if (selectedOption) {
      if (!expertSkills.find(s => s.idSkillCtg === selectedOption.value)) {
        setExpertSkills((prevSkills) => [
          ...prevSkills,
          {
            idSkillCtg: selectedOption.value,
            nmSkillCtg: selectedOption.label, 
            experience: "", 
            certificate: null, 
            certificateFileName: null, 
          },
        ]);
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.expertSkills;
          return newErrors;
        });
      }
    }
  };

  // Handler untuk menghapus baris skill
  const handleRemoveSkill = (skillIdToRemove) => {
    setExpertSkills((prevSkills) =>
      prevSkills.filter((skill) => skill.idSkillCtg !== skillIdToRemove)
    );
    setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.expertSkills;
        return newErrors;
    });
  };

  // Handler untuk mengubah nilai input (pengalaman)
  const handleSkillExperienceChange = (skillId, value) => {
    setExpertSkills((prevSkills) => {
      const updatedSkills = prevSkills.map((skill) =>
        skill.idSkillCtg === skillId
          ? { ...skill, experience: value }
          : skill
      );
      
      // Perhitungan index untuk membersihkan error
      const index = updatedSkills.findIndex(s => s.idSkillCtg === skillId);
      if (index !== -1) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[`expertSkills[${index}].experience`];
          return newErrors;
        });
      }
      return updatedSkills;
    });
  };

  // Handler untuk upload file (sertifikat)
  const handleCertificateUpload = (skillId, file) => {
    setExpertSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.idSkillCtg === skillId
          ? { 
              ...skill, 
              certificate: file, 
              certificateFileName: file ? file.name : null
            }
          : skill
      )
    );
  };
  
  // Handler untuk menghapus sertifikat saja
  const handleRemoveCertificate = (skillId) => {
    setExpertSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.idSkillCtg === skillId
          ? { ...skill, certificate: null, certificateFileName: null }
          : skill
      )
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentValidationSchema = validationSchemaMap[userType];

    let payload = { ...formData };
    let finalPayload = payload;

    if (userType === "Expert") {
      payload.expertSkills = expertSkills;
      
      try {
        await currentValidationSchema.validate(payload, { abortEarly: false });
        
        const data = new FormData();
        
        // Tambahkan field umum
        data.append('nmExpert', formData.name);
        data.append('emailExpert', formData.email);
        data.append('password', formData.password);
        data.append('mobileExpert', formData.mobile || '');
        data.append('role', formData.role);
        data.append('statExpert', formData.statExpert || '');
        data.append('Row', formData.Row || '');
        
        // Tambahkan array skill dan file
        const skillDataArray = expertSkills.map(skill => {
            if (skill.certificate) {
                const fileKey = `certificate_${skill.idSkillCtg}`;
                data.append(fileKey, skill.certificate, skill.certificateFileName);
                return {
                    idSkillCtg: skill.idSkillCtg,
                    experience: skill.experience,
                    certificateFileKey: fileKey, 
                };
            }
            return {
                idSkillCtg: skill.idSkillCtg,
                experience: skill.experience,
                certificateFileKey: null,
            };
        });

        data.append('expertSkills', JSON.stringify(skillDataArray));
        
        finalPayload = data;

      } catch (error) {
        if (error.name === "ValidationError") {
          const validationErrors = {};
          error.inner.forEach((err) => {
            validationErrors[err.path] = err.message;
          });
          console.log("Validation Errors:", validationErrors);
          setErrors(validationErrors);
          return; 
        } else {
          console.error("Validation failed:", error);
          setErrors({ general: 'Validation error occurred.' });
          return;
        }
      }
    } 

    await onSubmit(finalPayload);
  };
  
  // Custom Styles untuk react-select (DIPERBAIKI: menggunakan errors.expertSkills)
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused
        ? "#3b82f6"
        : errors.expertSkills
        ? "#ef4444"
        : "#d1d5db", 
      "&:hover": {
        borderColor: state.isFocused
          ? "#3b82f6"
          : errors.expertSkills
          ? "#ef4444"
          : "#9ca3af",
      },
      boxShadow: state.isFocused
        ? "0 0 0 1px #3b82f6"
        : errors.expertSkills
        ? "0 0 0 1px #ef4444"
        : "none",
    }),
    menu: (base) => ({ ...base, zIndex: 50 }), 
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

      {/* Sales, Akademik, PM, Admin, HR, Outsourcer blocks (Tidak diubah) */}
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

      {userType === "Akademik" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Akademik Details</h3>
          <input type="hidden" name="role" value="Akademik" />
        </div>
      )}

      {userType === "PM" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">
            Project Manager Details
          </h3>
          <input type="hidden" name="role" value="PM" />
        </div>
      )}

      {userType === "Admin" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Admin Details</h3>
          <input type="hidden" name="role" value="Admin" />
        </div>
      )}
      
      {userType === "HR" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">
            Human Resource Details
          </h3>
          <input type="hidden" name="role" value="HR" />
        </div>
      )}

      {userType === "Outsourcer" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">Outsourcer Details</h3>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Tipe Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="external">External</option>
              <option value="internal">Internal</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Status (Optional)
            </label>
            <input
              type="text"
              name="statOutsourcer"
              value={formData.statOutsourcer}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Contoh: Active, On Contract"
            />
          </div>
        </div>
      )}

      {/* --- Expert Block dengan Dynamic Skills BARU (Minimalis Design) --- */}
      {userType === "Expert" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="font-semibold text-gray-800">
            Expert/Trainer Details
          </h3>
          
          {/* Role Selection */}
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
              <option value="Head of Expert">Head of Expert</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>
          
          {/* Dynamic Skills Input (Minimalis Design) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Skills (Pilih satu atau lebih) *
            </label>
            
            {/* Dropdown untuk Menambah Skill Baru (Add Skills) */}
            <Select
              name="skillSelector"
              options={skillCategories.filter(opt => !expertSkills.find(s => s.idSkillCtg === opt.value))}
              className="basic-single-select"
              classNamePrefix="select"
              value={null}
              onChange={handleSkillSelect}
              placeholder="Add Skills" 
              isClearable={false}
              isDisabled={skillCategories.length === expertSkills.length}
              styles={selectStyles}
            />
            {errors.expertSkills && typeof errors.expertSkills === "string" && (
              <p className="text-red-500 text-sm mt-1">{errors.expertSkills}</p>
            )}

            {/* Daftar Skill yang Sudah Dipilih (Re-designed minimalis) */}
            <div className="mt-4 space-y-3">
              {expertSkills.map((skill, index) => (
                <div 
                  key={skill.idSkillCtg} 
                  className="flex items-center space-x-2" 
                >
                  <div className="flex-grow flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2 text-sm shadow-sm">
                    {/* Nama Skill & Input Pengalaman */}
                    <span className="font-medium text-gray-800 whitespace-nowrap">
                      {skill.nmSkillCtg}
                    </span>
                    <span className="mx-2 text-gray-400">–</span>
                    
                    {/* Input Pengalaman (Mirip dengan text biasa) */}
                    <input
                      type="text"
                      name={`expertSkills[${index}].experience`}
                      value={skill.experience}
                      onChange={(e) =>
                        handleSkillExperienceChange(skill.idSkillCtg, e.target.value)
                      }
                      className={`flex-grow border-none focus:ring-0 p-0 text-sm placeholder-gray-500 ${
                        errors[`expertSkills[${index}].experience`] ? "text-red-600" : "text-gray-700"
                      }`}
                      placeholder="Pengalaman" 
                    />
                    
                    {/* Error Pengalaman (jika ada) */}
                    {errors[`expertSkills[${index}].experience`] && (
                        <span className="text-red-500 text-xs ml-2">
                          {/* Menampilkan hanya ikon (atau disingkat) jika perlu */}
                          !
                        </span>
                    )}

                    {/* Indikator dan tombol Sertifikat */}
                    {skill.certificateFileName ? (
                      <div className="flex items-center ml-2 border-l border-gray-200 pl-2">
                        <span className="text-blue-600 font-medium text-sm truncate max-w-[100px] sm:max-w-none">
                          {/* Nama Sertif */}
                          {skill.certificateFileName.split('.').slice(0, -1).join('.') || 'Sertifikat'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertificate(skill.idSkillCtg)}
                          className="ml-1 text-red-500 hover:text-red-700 text-xs font-bold"
                          title="Hapus Dokumen"
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center ml-2 border-l border-gray-200 pl-2">
                         <input
                          type="file"
                          id={`certificate-file-${skill.idSkillCtg}`}
                          onChange={(e) =>
                            handleCertificateUpload(skill.idSkillCtg, e.target.files[0])
                          }
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label 
                          htmlFor={`certificate-file-${skill.idSkillCtg}`}
                          className="text-gray-500 hover:text-gray-700 text-xs cursor-pointer whitespace-nowrap border rounded-md px-2 py-1"
                          title="Upload Sertifikat"
                        >
                          Upload Sertifikat
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* Tombol Hapus Baris Skill (Merah, sesuai gambar) */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.idSkillCtg)}
                    className="bg-red-500 text-white w-20 px-3 py-2 rounded-md hover:bg-red-600 transition shadow-md whitespace-nowrap"
                    title="Hapus Baris"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
            {/* Akhir Daftar Skill */}
          </div>
          {/* --- Akhir Dynamic Skills Input --- */}
          
          {/* Status & Notes (tidak berubah) */}
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