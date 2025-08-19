import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import * as Yup from "yup";

const validationSchema = Yup.object({
  nmOpti: Yup.string().required("Nama Opti wajib diisi"),
  idCustomer: Yup.number().required("Perusahaan wajib dipilih"),
  contactOpti: Yup.string(),
  emailOpti: Yup.string().email("Email tidak valid"),
  mobileOpti: Yup.string(),
  statOpti: Yup.string().required("Status Opti wajib diisi"),
  propOpti: Yup.string(),
  datePropOpti: Yup.date().required("Tanggal wajib diisi"),
  idSumber: Yup.number().required("Sumber wajib dipilih"),
  kebutuhan: Yup.string(),
});

const initialFormState = {
  nmOpti: "",
  idCustomer: "",
  contactOpti: "",
  emailOpti: "",
  mobileOpti: "",
  statOpti: "",
  propOpti: "",
  datePropOpti: "",
  idSumber: "",
  kebutuhan: "",
};

const OptiForm = ({ initialData = {}, onSubmit, onClose }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    ...initialFormState,
    ...initialData,
  });
  const [customers, setCustomers] = useState([]);
  const [sumber, setSumber] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialData,
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

  const handleReset = () => {
    setFormData({ ...initialFormState });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      onSubmit(formData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Opti *
          </label>
          <input
            type="text"
            name="nmOpti"
            value={formData.nmOpti}
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
            value={formData.contactOpti}
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
            value={formData.emailOpti}
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
            value={formData.mobileOpti}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status Opti *
          </label>
          <select
            name="statOpti"
            value={formData.statOpti}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Pilih status opportunity</option>
            <option value="Prospect">Prospect</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed-Won">Closed-Won</option>
            <option value="Closed-Lost">Closed-Lost</option>
          </select>
          {errors.statOpti && <p className="error">{errors.statOpti}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proposal Opti
          </label>
          <input
            type="text"
            name="propOpti"
            value={formData.propOpti}
            onChange={handleChange}
            placeholder="Nomor atau referensi proposal"
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Opti
          </label>
          <input
            type="date"
            name="datePropOpti"
            value={
              formData.datePropOpti
                ? formData.datePropOpti.slice(0, 10)
                : ""
            }
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
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
            value={formData.idCustomer}
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
            Sumber
          </label>
          <select
            name="idSumber"
            value={formData.idSumber}
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

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            name="kebutuhan"
            value={formData.kebutuhan}
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
