// frontend/src/componenets/CustomerForm.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";

// Schema validasi disesuaikan untuk tidak memerlukan idStatCustomer jika role adalah Sales
const validationSchema = Yup.object({
  nmCustomer: Yup.string().required("Customer name is required"),
  emailCustomer: Yup.string().email("Invalid email format").required("Email is required"),
  mobileCustomer: Yup.string().matches(/^\d+$/, "Phone number must be numeric").optional(),
  addrCustomer: Yup.string().optional(),
  corpCustomer: Yup.string().optional(),
  idStatCustomer: Yup.number().when("$userRole", {
    is: (userRole) => userRole !== "Sales",
    then: (schema) => schema.required("Status is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  descCustomer: Yup.string().optional(),
  customerCat: Yup.string().required("Customer category is required"),
  NPWP: Yup.string().when("customerCat", {
    is: "Perusahaan",
    then: (schema) => schema.required("NPWP is required for companies"),
    otherwise: (schema) => schema.optional(),
  }),
});

const CustomerForm = ({ initialData, onSubmit, onClose }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nmCustomer: "",
    emailCustomer: "",
    mobileCustomer: "",
    addrCustomer: "",
    corpCustomer: "",
    idStatCustomer: "",
    descCustomer: "",
    customerCat: "Perusahaan",
    NPWP: "",
  });
  const [statusOptions, setStatusOptions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch status options hanya jika user bukan Sales atau jika sedang edit
    if (user && user.token && (user.role !== 'Sales' || initialData)) {
      axios.get("http://localhost:3000/api/customer/status", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => setStatusOptions(response.data))
        .catch((error) => console.error("Error fetching status options:", error));
    }

    // Mengisi form jika ada initialData
    if (initialData) {
      setFormData({
        nmCustomer: initialData.nmCustomer || "",
        emailCustomer: initialData.emailCustomer || "",
        mobileCustomer: initialData.mobileCustomer || "",
        addrCustomer: initialData.addrCustomer || "",
        corpCustomer: initialData.corpCustomer || "",
        idStatCustomer: initialData.idStatCustomer || "",
        descCustomer: initialData.descCustomer || "",
        customerCat: initialData.customerCat || "Perusahaan",
        NPWP: initialData.NPWP || "",
      });
    } else {
      // Mengatur default status untuk Sales saat form kosong
      setFormData({
        nmCustomer: "",
        emailCustomer: "",
        mobileCustomer: "",
        addrCustomer: "",
        corpCustomer: "",
        idStatCustomer: user?.role === 'Sales' ? 1 : "", // Default 1 untuk Sales
        descCustomer: "",
        customerCat: "Perusahaan",
        NPWP: "",
      });
    }
  }, [user, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCategoryChange = (value) => {
    const newFormData = { ...formData, customerCat: value };
    if (value === 'Pribadi') {
      newFormData.corpCustomer = ''; // Clear corporation when switching to Pribadi
    }
    setFormData(newFormData);
    setErrors({ ...errors, customerCat: "" }); // Clear potential error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Menyesuaikan validasi Yup dengan role pengguna
      await validationSchema.validate(formData, { context: { userRole: user?.role }, abortEarly: false });
      
      // Kirim data yang sudah divalidasi ke komponen parent
      onSubmit(formData);
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="nmCustomer" placeholder="Customer Name" value={formData.nmCustomer} onChange={handleChange} />
          {errors.nmCustomer && <p className="error">{errors.nmCustomer}</p>}
        </div>
        <div className="form-group">
          <label>Mobile Phone</label>
          <input type="text" name="mobileCustomer" placeholder="Customer Mobile Phone" value={formData.mobileCustomer} onChange={handleChange} />
          {errors.mobileCustomer && <p className="error">{errors.mobileCustomer}</p>}
        </div>
        <div className="form-group">
          <label>E-Mail</label>
          <input type="email" name="emailCustomer" placeholder="Customer Email" value={formData.emailCustomer} onChange={handleChange} />
          {errors.emailCustomer && <p className="error">{errors.emailCustomer}</p>}
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="addrCustomer" placeholder="Customer Address" value={formData.addrCustomer} onChange={handleChange} />
        </div>
        
        <div className="form-group md:col-span-2">
          <label>Category</label>
          <div className="relative flex w-full bg-gray-200 rounded-full p-1 mt-2">
            <button
              type="button"
              onClick={() => handleCategoryChange('Perusahaan')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                formData.customerCat === 'Perusahaan' ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              Perusahaan
            </button>
            <button
              type="button"
              onClick={() => handleCategoryChange('Pribadi')}
              className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                formData.customerCat === 'Pribadi' ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              Pribadi
            </button>
          </div>
          {errors.customerCat && <p className="error">{errors.customerCat}</p>}
        </div>

        {formData.customerCat === "Perusahaan" && (
          <div className="form-group md:col-span-2">
            <label>Corporation</label>
            <input type="text" name="corpCustomer" placeholder="Customer Corporation" value={formData.corpCustomer} onChange={handleChange} />
          </div>
        )}

        <div className="form-group">
          <label>NPWP {formData.customerCat !== 'Perusahaan' && <span className="text-gray-500 text-sm">(optional)</span>}</label>
          <input type="text" name="NPWP" placeholder="NPWP" value={formData.NPWP} onChange={handleChange} />
          {errors.NPWP && <p className="error">{errors.NPWP}</p>}
        </div>

        {/* Status Customer hanya ditampilkan jika role bukan Sales */}
        {(user?.role !== 'Sales') && (
            <div className="form-group">
                <label>Status Customer</label>
                <select name="idStatCustomer" value={formData.idStatCustomer} onChange={handleChange}>
                    <option value="">Select Status Customer</option>
                    {statusOptions.map((status) => (
                    <option key={status.idStatCustomer} value={status.idStatCustomer}>
                        {status.nmStatCustomer}
                    </option>
                    ))}
                </select>
                {errors.idStatCustomer && <p className="error">{errors.idStatCustomer}</p>}
            </div>
        )}
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea name="descCustomer" placeholder="Customer Description" value={formData.descCustomer} onChange={handleChange} />
      </div>
      <div className="flex justify-between items-center pt-4">
        <div className="flex space-x-3">
          <button type="submit" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            {initialData ? "Update Customer" : "Add Customer"}
          </button>
          <button type="button" onClick={() => setFormData({
            nmCustomer: "",
            emailCustomer: "",
            mobileCustomer: "",
            addrCustomer: "",
            corpCustomer: "",
            idStatCustomer: user?.role === 'Sales' ? 1 : "",
            descCustomer: "",
            customerCat: "Perusahaan",
            NPWP: "",
          })} className="border border-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-100">
            Reset Form
          </button>
        </div>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
          Close
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;