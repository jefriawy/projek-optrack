import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";
import axios from "axios";

// Updated validation schema
const validationSchema = Yup.object({
  nmOpti: Yup.string().required("Nama Opti wajib diisi"),
  idCustomer: Yup.number().required("Perusahaan wajib dipilih"),
  contactOpti: Yup.string(),
  emailOpti: Yup.string().email("Email tidak valid"),
  mobileOpti: Yup.string(),
  statOpti: Yup.string().required("Status Opti wajib diisi"),
  datePropOpti: Yup.date().required("Tanggal wajib diisi"),
  idSumber: Yup.number().required("Sumber wajib dipilih"),
  kebutuhan: Yup.string(),
  // New fields
  jenisOpti: Yup.string().required("Jenis Opti wajib diisi"),
  namaExpert: Yup.string().required("Nama Expert wajib diisi"),
  proposalOpti: Yup.mixed().optional(), // For the file upload
});

const OptiForm = ({ initialData = {}, onSubmit, onClose }) => {
  const { user } = useContext(AuthContext);

  // Updated initial state
  const initialFormState = {
    nmOpti: "",
    idCustomer: "",
    contactOpti: "",
    emailOpti: "",
    mobileOpti: "",
    statOpti: user?.role === "Sales" ? "Just Get Info" : "",
    datePropOpti: new Date().toISOString().slice(0, 10),
    idSumber: "",
    kebutuhan: "",
    jenisOpti: "",
    namaExpert: "",
  };

  const safeInitialData = initialData || {};

  const [formData, setFormData] = useState({
    ...initialFormState,
    ...safeInitialData,
    datePropOpti:
      safeInitialData.datePropOpti || new Date().toISOString().slice(0, 10),
  });
  
  // State for file
  const [proposalFile, setProposalFile] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [sumber, setSumber] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData((prev) => ({
      ...initialFormState,
      ...safeInitialData,
      statOpti: user?.role === "Sales" ? "Just Get Info" : (safeInitialData.statOpti || ""),
      datePropOpti:
        safeInitialData.datePropOpti || new Date().toISOString().slice(0, 10),
    }));
  }, [initialData]);

  useEffect(() => {
    if (user?.token) {
      axios
        .get("http://localhost:3000/api/opti/form-options", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          setCustomers(response.data.customers);
          setSumber(response.data.sumber);
        })
        .catch((error) => console.error("Error fetching form options:", error));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handler for file input
  const handleFileChange = (e) => {
    setProposalFile(e.target.files[0]);
  };

  const handleReset = () => {
    setFormData({ ...initialFormState });
    setProposalFile(null);
    setErrors({});
  };

  // Updated submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a temporary object for validation, excluding the file
      const dataToValidate = { ...formData };
      if (proposalFile) {
        dataToValidate.proposalOpti = proposalFile;
      }
      
      await validationSchema.validate(dataToValidate, { abortEarly: false });

      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }
      if (proposalFile) {
        submissionData.append("proposalOpti", proposalFile);
      }

      onSubmit(submissionData);
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }
  };

  const inputStyle =
    "w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  const formatDateInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d)) return "";
    return d.toISOString().slice(0, 10);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Existing fields... */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Opti *
          </label>
          <input
            type="text"
            name="nmOpti"
            value={formData.nmOpti || ""}
            onChange={handleChange}
            placeholder="Masukkan nama opportunity"
            className={inputStyle}
          />
          {errors.nmOpti && <p className="error">{errors.nmOpti}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kontak Opti
          </label>
          <input
            type="text"
            name="contactOpti"
            value={formData.contactOpti || ""}
            onChange={handleChange}
            placeholder="Nama kontak PIC"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="emailOpti"
            value={formData.emailOpti || ""}
            onChange={handleChange}
            placeholder="contoh@email.com"
            className={inputStyle}
          />
          {errors.emailOpti && <p className="error">{errors.emailOpti}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile
          </label>
          <input
            type="text"
            name="mobileOpti"
            value={formData.mobileOpti || ""}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            className={inputStyle}
          />
        </div>

        {/* New Field: Jenis Opti */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Opti *
          </label>
          <select
            name="jenisOpti"
            value={formData.jenisOpti || ""}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Pilih Jenis Opti</option>
            <option value="Training">Training</option>
            <option value="Project">Project</option>
            <option value="Outsource">Outsource</option>
          </select>
          {errors.jenisOpti && <p className="error">{errors.jenisOpti}</p>}
        </div>

        {/* New Field: Nama Expert */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Expert *
          </label>
          <input
            type="text"
            name="namaExpert"
            value={formData.namaExpert || ""}
            onChange={handleChange}
            placeholder="Masukkan nama expert"
            className={inputStyle}
          />
          {errors.namaExpert && <p className="error">{errors.namaExpert}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status Opti *
          </label>
          <select
            name="statOpti"
            value={formData.statOpti || ""}
            onChange={handleChange}
            className={inputStyle}
            disabled={user?.role === "Sales"}
          >
            <option value="">Pilih status opportunity</option>
            <option value="Follow Up">Follow Up</option>
            <option value="On-Progress">On-Progress</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Just Get Info">Just Get Info</option>
          </select>
          {errors.statOpti && <p className="error">{errors.statOpti}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sumber
          </label>
          <select
            name="idSumber"
            value={formData.idSumber || ""}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Pilih sumber opportunity</option>
            {sumber.map((s) => (
              <option key={s.idSumber} value={s.idSumber}>
                {s.nmSumber}
              </option>
            ))}
          </select>
          {errors.idSumber && <p className="error">{errors.idSumber}</p>}
        </div>

        {/* Updated Field: Proposal Opti (File Upload) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proposal Opti
          </label>
          <input
            type="file"
            name="proposalOpti"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          />
          {errors.proposalOpti && <p className="error">{errors.proposalOpti}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Opti
          </label>
          <input
            type="date"
            name="datePropOpti"
            value={formatDateInput(formData.datePropOpti)}
            onChange={handleChange} // Added onChange here
            className={inputStyle}
          />
          {errors.datePropOpti && (
            <p className="error">{errors.datePropOpti}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Perusahaan *
          </label>
          <select
            name="idCustomer"
            value={formData.idCustomer || ""}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Pilih perusahaan customer</option>
            {customers.map((c) => (
              <option key={c.idCustomer} value={c.idCustomer}>
                {c.corpCustomer} - {c.nmCustomer}
              </option>
            ))}
          </select>
          {errors.idCustomer && <p className="error">{errors.idCustomer}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            name="kebutuhan"
            value={formData.kebutuhan || ""}
            onChange={handleChange}
            placeholder="(kosong, isi dengan deskripsi tambahan)"
            className={inputStyle}
            rows="3"
          ></textarea>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-4">
        <button
          type="submit"
          className="bg-black text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Simpan Data
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-white text-gray-700 font-semibold py-2 px-5 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset Form
        </button>
      </div>
    </form>
  );
};

export default OptiForm;
