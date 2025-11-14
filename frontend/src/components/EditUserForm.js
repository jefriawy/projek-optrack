// frontend/src/components/EditUserForm.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Select from "react-select";

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
    statOutsourcer: "",
  });

  const [skillCategories, setSkillCategories] = useState([]);
  const [expertSkills, setExpertSkills] = useState([]); // Dynamic skills array
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

      setExpertSkills([]);
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

  // Load existing expert skills
  useEffect(() => {
    const isExpertRole = ["Expert", "Trainer", "Head of Expert"].includes(
      formData.role
    );

    // Load skills when role indicates an expert and when detailed skills arrive
    if (isExpertRole && authUser?.token) {
      // Only set from userToEditProp.skills when it's available and we don't already have skills
      if (expertSkills.length === 0 && userToEditProp?.skills && Array.isArray(userToEditProp.skills)) {
        const convertedSkills = userToEditProp.skills.map((skill) => ({
          idSkillCtg: skill.idSkillCtg,
          nmSkillCtg: skill.nmSkillCtg, // Store skill name directly from backend response
          experience: skill.experience || "",
          certificate: null, // Existing certificate, tidak perlu re-upload untuk edit
          certificateFileName: null,
          existingCertificatePath: skill.certificate_path, // Path certificate yang sudah ada
        }));
        setExpertSkills(convertedSkills);
      }
    } else if (!isExpertRole) {
      setExpertSkills([]);
    }
  }, [formData.role, userToEditProp?.skills, authUser?.token]);

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "role") {
      setExpertSkills([]);
    }
  };

  // Handler untuk menambahkan skill baru
  const handleAddSkill = (selectedOption) => {
    if (selectedOption) {
      const skillExists = expertSkills.some(
        (s) => s.idSkillCtg === selectedOption.value
      );
      if (!skillExists) {
        setExpertSkills([
          ...expertSkills,
          {
            idSkillCtg: selectedOption.value,
            nmSkillCtg: selectedOption.label, // Store skill name from react-select
            experience: "",
            certificate: null,
            certificateFileName: null,
            existingCertificatePath: null,
          },
        ]);
      }
    }
  };

  // Handler untuk menghapus skill
  const handleRemoveSkill = (skillIdToRemove) => {
    setExpertSkills(
      expertSkills.filter((s) => s.idSkillCtg !== skillIdToRemove)
    );
  };

  // Handler untuk mengubah experience
  const handleSkillExperienceChange = (skillId, value) => {
    setExpertSkills(
      expertSkills.map((s) =>
        s.idSkillCtg === skillId ? { ...s, experience: value } : s
      )
    );
  };

  // Handler untuk upload certificate
  const handleCertificateUpload = (skillId, file) => {
    setExpertSkills(
      expertSkills.map((s) =>
        s.idSkillCtg === skillId
          ? {
              ...s,
              certificate: file,
              certificateFileName: file?.name || null,
            }
          : s
      )
    );
  };

  // Handler untuk menghapus certificate
  const handleRemoveCertificate = (skillId) => {
    setExpertSkills(
      expertSkills.map((s) =>
        s.idSkillCtg === skillId
          ? {
              ...s,
              certificate: null,
              certificateFileName: null,
            }
          : s
      )
    );
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const isExpertRole = ["Expert", "Trainer", "Head of Expert"].includes(
      formData.role
    );

    let finalPayload = { ...formData };

    // Untuk Expert: gunakan expertSkills array
    if (isExpertRole) {
      finalPayload.expertSkills = expertSkills;
    }

    let formIsValid = true;
    let newErrors = {};

    if (!finalPayload.name) {
      newErrors.name = "Name is required";
      formIsValid = false;
    }
    if (!finalPayload.email) {
      newErrors.email = "Email is required";
      formIsValid = false;
    }

    // Validasi skills untuk Expert
    if (isExpertRole && expertSkills.length === 0) {
      newErrors.expertSkills = "Minimal satu skill harus ditambahkan";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      // Untuk Expert dengan file upload, convert ke FormData
      if (isExpertRole && expertSkills.some(s => s.certificate)) {
        const formDataPayload = new FormData();
        
        // Append basic fields
        formDataPayload.append("nmExpert", finalPayload.name);
        formDataPayload.append("emailExpert", finalPayload.email);
        if (finalPayload.password) {
          formDataPayload.append("password", finalPayload.password);
        }
        formDataPayload.append("mobileExpert", finalPayload.mobile || "");
        formDataPayload.append("role", finalPayload.role);
        formDataPayload.append("statExpert", finalPayload.statExpert || "");
        formDataPayload.append("Row", finalPayload.Row || "");
        
        // Build expertSkills array with certificateFileKey for files
        const expertSkillsForPayload = expertSkills.map((skill) => ({
          idSkillCtg: skill.idSkillCtg,
          experience: skill.experience,
          existingCertificatePath: skill.existingCertificatePath || null,
          certificateFileKey: skill.certificate ? `certificate_${skill.idSkillCtg}` : null,
        }));
        
        // Append expertSkills sebagai JSON string
        formDataPayload.append("expertSkills", JSON.stringify(expertSkillsForPayload));
        
        // Append files
        expertSkills.forEach((skill) => {
          if (skill.certificate) {
            const fieldName = `certificate_${skill.idSkillCtg}`;
            formDataPayload.append(fieldName, skill.certificate);
          }
        });
        
        onSubmit(userToEditProp.id, userToEditProp.role, formDataPayload);
      } else {
        onSubmit(userToEditProp.id, userToEditProp.role, finalPayload);
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

      {/* Expert Specific Fields - UPDATED */}
      {isExpertRole && (
        <div className="space-y-4 pt-4 border-t mt-4">
          <h3 className="font-semibold text-gray-800">
            Expert/Trainer Details
          </h3>

          {/* Add Skill Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tambah Skill Baru
            </label>
            <Select
              options={skillCategories.filter(
                (cat) => !expertSkills.some((s) => s.idSkillCtg === cat.value)
              )}
              onChange={handleAddSkill}
              placeholder="Pilih skill untuk ditambahkan..."
              isClearable
              styles={selectStyles}
              className="mt-1"
            />
            {errors.expertSkills && (
              <p className="text-red-500 text-xs mt-1">{errors.expertSkills}</p>
            )}
          </div>

          {/* Skills List */}
          {expertSkills.length > 0 && (
            <div className="space-y-3 mt-4">
              <h4 className="font-medium text-gray-700">Skills yang Dipilih:</h4>
              {expertSkills.map((skill, index) => {
                const skillLabel =
                  skill.nmSkillCtg ||
                  skillCategories.find((cat) => cat.value === skill.idSkillCtg)
                    ?.label ||
                  `Skill ${skill.idSkillCtg}`;

                const existingFull = skill.existingCertificatePath || null;
                const existingFileName = existingFull
                  ? String(existingFull).split(/[\\\/]/).pop()
                  : null;
                const existingDisplayName = existingFileName
                  ? existingFileName.split('.').slice(0, -1).join('.') || existingFileName
                  : null;

                return (
                  <div key={skill.idSkillCtg || index} className="flex items-center space-x-2">
                    <div className="flex-grow flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2 text-sm shadow-sm">
                      <span className="font-medium text-gray-800 whitespace-nowrap mr-3">{skillLabel}</span>
                      <span className="mx-2 text-gray-400">–</span>

                      <input
                        type="text"
                        name={`expertSkills[${index}].experience`}
                        value={skill.experience}
                        onChange={(e) => handleSkillExperienceChange(skill.idSkillCtg, e.target.value)}
                        placeholder="Pengalaman"
                        className="flex-grow border-none focus:ring-0 p-0 text-sm placeholder-gray-500 text-gray-700"
                      />

                      {/* Certificate area */}
                      <div className="flex items-center ml-2 border-l border-gray-200 pl-2">
                        {skill.certificateFileName ? (
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-medium text-sm truncate max-w-[120px]">{skill.certificateFileName}</span>
                            <button type="button" onClick={() => handleRemoveCertificate(skill.idSkillCtg)} className="ml-1 text-red-500 hover:text-red-700 text-xs font-bold">&times;</button>
                          </div>
                        ) : existingDisplayName ? (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 text-xs">📄 {existingFileName}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setExpertSkills(
                                  expertSkills.map((s) =>
                                    s.idSkillCtg === skill.idSkillCtg
                                      ? {
                                          ...s,
                                          certificate: null,
                                          certificateFileName: null,
                                          existingCertificatePath: null,
                                        }
                                      : s
                                  )
                                );
                              }}
                              className="text-red-600 hover:text-red-800 text-xs ml-2"
                            >
                              Ganti
                            </button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              id={`certificate-file-${skill.idSkillCtg}`}
                              onChange={(e) => handleCertificateUpload(skill.idSkillCtg, e.target.files[0])}
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <label htmlFor={`certificate-file-${skill.idSkillCtg}`} className="text-gray-500 hover:text-gray-700 text-xs cursor-pointer border rounded-md px-2 py-1">Upload Sertifikat</label>
                          </>
                        )}
                      </div>
                    </div>

                    <button type="button" onClick={() => handleRemoveSkill(skill.idSkillCtg)} className="bg-red-500 text-white w-20 px-3 py-2 rounded-md hover:bg-red-600 transition shadow-md">Hapus</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Status and Notes */}
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
