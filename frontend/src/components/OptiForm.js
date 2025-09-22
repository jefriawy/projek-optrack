// src/components/OptiForm.js

import React, { useContext, useEffect, useState, useMemo } from "react";
import Select from 'react-select';
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Helper functions (formatRupiah, parseRupiah, etc.) remain the same
const formatRupiah = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "";
  return new Intl.NumberFormat("id-ID").format(amount);
};

const parseRupiah = (rupiahString) => {
  if (typeof rupiahString !== "string") {
    return rupiahString;
  }
  if (!rupiahString) return null;
  const cleanedString = rupiahString.replace(/[^,\d]/g, "").replace(/,/g, ".");
  const parsed = parseFloat(cleanedString);
  return isNaN(parsed) ? null : parsed;
};

const TYPE_TRAININGS = [
  { id: 2, name: "Public Training" },
  { id: 3, name: "Inhouse Training" },
  { id: 4, name: "Online Training" },
];
const TYPE_PROJECTS = [
  { id: 2, name: "Public Project" },
  { id: 3, name: "Inhouse Project" },
  { id: 4, name: "Online Project" },
];

const STATUS_OPTIONS_DATA = [
    { value: "opti entry", label: "Opti Entry" },
    { value: "opti on going", label: "On Going" },
    { value: "opti failed", label: "Opti Failed" },
    { value: "po received", label: "PO Received" },
];

const normalizeMySQLDateTimeToLocal = (val) => {
  if (!val) return "";
  const date = new Date(val);
  if (isNaN(date.getTime())) {
    return "";
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${mi}`;
};

const normalizeDateOnly = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  return "";
};

const normalizeInitialData = (data) => {
  if (!data) return {};
  const norm = {
    ...data,
    datePropOpti: normalizeDateOnly(data.datePropOpti),
    startTraining: normalizeMySQLDateTimeToLocal(data.startTraining),
    endTraining: normalizeMySQLDateTimeToLocal(data.endTraining),
    placeTraining: data.placeTraining || "",
    idTypeTraining:
      data.idTypeTraining === null || data.idTypeTraining === undefined
        ? ""
        : String(data.idTypeTraining),
    valOpti: parseRupiah(data.valOpti),
  };
  return norm;
};

const emptyToNullNumber = (value, originalValue) => {
  if (originalValue === "" || originalValue === undefined) return null;
  const n = Number(originalValue);
  return Number.isNaN(n) ? null : n;
};
const getValidationSchema = (role) =>
  Yup.object({
    nmOpti: Yup.string().required("Nama Opti wajib diisi"),
    idCustomer: Yup.number()
      .typeError("Pilih perusahaan")
      .required("Perusahaan wajib dipilih"),
    idSumber: Yup.number()
      .typeError("Pilih sumber")
      .required("Sumber wajib dipilih"),
    statOpti: Yup.string().when([], (__, schema) => {
      if (role !== "Sales") {
        return schema.required("Status Opti wajib diisi");
      }
      return schema;
    }),
    datePropOpti: Yup.string().required("Tanggal wajib diisi"),
    jenisOpti: Yup.string()
      .oneOf(["Training", "Project", "Outsource"])
      .required("Jenis Opti wajib diisi"),
    idExpert: Yup.number()
      .transform(emptyToNullNumber)
      .nullable()
      .when("jenisOpti", (jenisOpti, schema) => {
        if (jenisOpti[0] === "Training" || jenisOpti[0] === "Project") {
          return schema.required("Expert wajib dipilih untuk jenis ini");
        }
        return schema;
      }),
    idTypeTraining: Yup.number()
      .transform(emptyToNullNumber)
      .nullable()
      .when("jenisOpti", (jenisOpti, schema) => {
        if (jenisOpti[0] === "Training" || jenisOpti[0] === "Project") {
          return schema.required("Tipe wajib dipilih untuk jenis ini");
        }
        return schema;
      }),
    startTraining: Yup.string().nullable(),
    endTraining: Yup.string().nullable(),
    placeTraining: Yup.string().nullable(),
    contactOpti: Yup.string().nullable(),
    emailOpti: Yup.string().email("Email tidak valid").nullable(),
    mobileOpti: Yup.string().nullable(),
    kebutuhan: Yup.string().nullable(),
    valOpti: Yup.number().typeError("Value harus berupa angka").nullable(),
  });

const OptiForm = ({
  initialData,
  onSubmit,
  onPaymentSubmit,
  onClose,
}) => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("Training");
  const [editTab, setEditTab] = useState("edit_details");
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const baseState = {
    nmOpti: "",
    idCustomer: "",
    contactOpti: "",
    emailOpti: "",
    mobileOpti: "",
    statOpti: "Entry",
    datePropOpti: new Date().toISOString().slice(0, 10),
    idSumber: "",
    kebutuhan: "",
    jenisOpti: activeTab,
    idExpert: "",
    idTypeTraining: "",
    startTraining: "",
    endTraining: "",
    placeTraining: "",
    valOpti: "",
  };

  const seed = normalizeInitialData(initialData);
  const [formData, setFormData] = useState({
    ...baseState,
    ...seed,
    statOpti: seed.statOpti || baseState.statOpti,
    datePropOpti: seed.datePropOpti || baseState.datePropOpti,
    jenisOpti: seed.jenisOpti || activeTab,
  });
  const [displayValOpti, setDisplayValOpti] = useState(
    formatRupiah(seed.valOpti)
  );
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [sumber, setSumber] = useState([]);
  const [experts, setExperts] = useState([]);
  const [proposalFile, setProposalFile] = useState(null);

  useEffect(() => {
    if (initialData?.jenisOpti) {
      setActiveTab(initialData.jenisOpti);
    }
    setFormData((prev) => ({ ...prev, jenisOpti: activeTab }));
  }, [activeTab, initialData]);

  // Filter experts by role for dropdown: Trainers for Training, Experts for Project
  const expertOptions = useMemo(() => {
    if (formData.jenisOpti === "Training") {
      return experts
        .filter(ex => ex.role === "Trainer")
        .map(ex => ({ value: ex.idExpert, label: ex.nmExpert }));
    } else if (formData.jenisOpti === "Project") {
      return experts
        .filter(ex => ex.role === "Expert" || ex.role === "Head of Expert")
        .map(ex => ({ value: ex.idExpert, label: ex.nmExpert }));
    } else {
      // For Outsource or other types, show all
      return experts.map(ex => ({ value: ex.idExpert, label: ex.nmExpert }));
    }
  }, [experts, formData.jenisOpti]);

  useEffect(() => {
    const run = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get(`${API_BASE}/api/opti/form-options`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCustomers(res.data.customers || []);
        setSumber(res.data.sumber || []);
        const rawExperts = Array.isArray(res.data.experts)
          ? res.data.experts
          : [];
        const normalizedExperts = rawExperts
          .map((e) => ({
            idExpert: e.idExpert ?? e.id_expert ?? e.id ?? e.ID ?? null,
            nmExpert:
              e.nmExpert ??
              e.nm_expert ??
              e.name ??
              e.fullName ??
              e.username ??
              null,
            role: e.role ?? "Expert", // Ensure role is present for filtering
          }))
          .filter((e) => e.idExpert && e.nmExpert);
        setExperts(normalizedExperts);
      } catch (e) {
        console.error("Error fetching form options:", e);
      }
    };
    run();
  }, [user?.token]);


  const customerOptions = useMemo(() =>
    customers.map(c => ({ value: c.idCustomer, label: `${c.corpCustomer} - ${c.nmCustomer}` })),
    [customers]
  );

  const sumberOptions = useMemo(() =>
    sumber.map(s => ({ value: s.idSumber, label: s.nmSumber })),
    [sumber]
  );

  const trainingTypeOptions = useMemo(() => 
    TYPE_TRAININGS.map(t => ({ value: t.id, label: t.name })), 
    []
  );

  const projectTypeOptions = useMemo(() => 
    TYPE_PROJECTS.map(p => ({ value: p.id, label: p.name })), 
    []
  );

  const statusOptions = useMemo(() => STATUS_OPTIONS_DATA, []);

  useEffect(() => {
    const safe = normalizeInitialData(initialData);
    setFormData((prev) => ({
      ...baseState,
      ...safe,
      statOpti: safe.statOpti || baseState.statOpti,
      datePropOpti: safe.datePropOpti || baseState.datePropOpti,
      jenisOpti: safe.jenisOpti || activeTab,
    }));
    setDisplayValOpti(formatRupiah(safe.valOpti));
  }, [initialData, activeTab]);

  const inputClass =
    "w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "valOpti") {
      const parsedValue = parseRupiah(value);
      setFormData((s) => ({ ...s, [name]: parsedValue }));
      setDisplayValOpti(value);
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
    if (errors[name]) setErrors((err) => ({ ...err, [name]: "" }));
  };

  const handleSelectChange = (name) => (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) {
      setErrors((err) => ({ ...err, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setProposalFile(file);
    if (user?.role === "Sales" && file) {
      setFormData((s) => ({ ...s, statOpti: "Entry" }));
    }
  };

  const handlePaymentFileChange = (e) => {
    const file = e.target.files[0] || null;
    setPaymentProofFile(file);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentProofFile) return;
    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // onPaymentSubmit harus mengembalikan Promise (lihat OptiPage.handlePaymentSubmit)
      await onPaymentSubmit(paymentProofFile);
      setSuccessMsg("Dokumen pendaftaran berhasil diunggah.");
      // tutup form/modal setelah sebentar agar user lihat notifikasi
      setTimeout(() => {
        if (onClose) onClose();
      }, 700);
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Gagal mengunggah dokumen pendaftaran.");
    } finally {
      setUploading(false);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "valOpti") {
      const parsedValue = parseRupiah(value);
      setDisplayValOpti(formatRupiah(parsedValue));
    }
  };

  const handleReset = () => {
    const safe = normalizeInitialData(initialData);
    setActiveTab(initialData?.jenisOpti || "Training");
    setFormData({
      ...baseState,
      ...safe,
      statOpti: safe.statOpti || baseState.statOpti,
      datePropOpti: safe.datePropOpti || baseState.datePropOpti,
      jenisOpti: safe.jenisOpti || "Training",
    });
    setProposalFile(null);
    setErrors({});
    setDisplayValOpti(formatRupiah(safe.valOpti));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      const schema = getValidationSchema(user?.role);
      await schema.validate(payload, { abortEarly: false });
    
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
              fd.append(k, v);
          }
      });
      
      if (proposalFile) {
          fd.append("proposalOpti", proposalFile);
      }
      
      onSubmit(fd);
    } catch (err) {
      const vErr = {};
      if (err.inner) err.inner.forEach((e) => (vErr[e.path] = e.message));
      setErrors(vErr);
    }
  };

  const isExpertRequired =
    formData.jenisOpti === "Training" || formData.jenisOpti === "Project";

  const selectedExpertValue = expertOptions.find(option => option.value === formData.idExpert);
  const selectedCustomerValue = customerOptions.find(option => option.value === formData.idCustomer);
  const selectedSumberValue = sumberOptions.find(option => option.value === formData.idSumber);
  const selectedStatusValue = statusOptions.find(option => option.value === formData.statOpti);
  const selectedTrainingTypeValue = trainingTypeOptions.find(option => option.value === Number(formData.idTypeTraining));
  const selectedProjectTypeValue = projectTypeOptions.find(option => option.value === Number(formData.idTypeTraining));

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? '#f3f4f6' : 'white',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
      }
    }),
    menu: base => ({ ...base, zIndex: 50 })
  };

  const TabButton = ({ tabName, activeTab, onClick, children }) => (
    <button
      type="button"
      className={`py-2 px-4 font-medium text-sm focus:outline-none ${
        activeTab === tabName
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => onClick(tabName)}
    >
      {children}
    </button>
  );

  return (
    <form
      onSubmit={editTab === "edit_details" ? handleSubmit : handlePaymentSubmit}
      className="space-y-5"
    >
      {!initialData ? (
        <div className="flex border-b mb-4">
          <TabButton tabName="Training" activeTab={activeTab} onClick={setActiveTab}>Training</TabButton>
          <TabButton tabName="Project" activeTab={activeTab} onClick={setActiveTab}>Project</TabButton>
          <TabButton tabName="Outsource" activeTab={activeTab} onClick={setActiveTab}>Outsource</TabButton>
        </div>
      ) : (
        <div className="flex border-b mb-4">
          <TabButton tabName="edit_details" activeTab={editTab} onClick={setEditTab}>Edit Opportunity</TabButton>
          <TabButton tabName="upload_payment" activeTab={editTab} onClick={setEditTab}>Upload Dokumen Pendaftaran</TabButton>
        </div>
      )}

      <div className="min-h-[55vh]">
        {(!initialData || editTab === "edit_details") && (
          <>
            <input type="hidden" name="dokPendaftaran" value={formData.dokPendaftaran || ""} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Opti *</label>
                <input type="text" name="nmOpti" value={formData.nmOpti || ""} onChange={handleChange} placeholder="Masukkan nama opportunity" className={inputClass} />
                {errors.nmOpti && <p className="text-red-600 text-sm">{errors.nmOpti}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Kontak Opti</label>
                <input type="text" name="contactOpti" value={formData.contactOpti || ""} onChange={handleChange} placeholder="Nama kontak PIC" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="emailOpti" value={formData.emailOpti || ""} onChange={handleChange} placeholder="contoh@email.com" className={inputClass} />
                {errors.emailOpti && <p className="text-red-600 text-sm">{errors.emailOpti}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <input type="text" name="mobileOpti" value={formData.mobileOpti || ""} onChange={handleChange} placeholder="08xxxxxxxxxx" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {formData.jenisOpti === "Training" ? "Trainer" : "Expert"} {isExpertRequired ? "*" : ""}
                </label>
                <Select
                  name="idExpert"
                  options={expertOptions}
                  value={selectedExpertValue}
                  onChange={handleSelectChange('idExpert')}
                  placeholder={formData.jenisOpti === "Training" ? "Pilih atau cari Trainer..." : "Pilih atau cari Expert..."}
                  isClearable
                  isDisabled={!isExpertRequired}
                  styles={selectStyles}
                  classNamePrefix="react-select"
                />
                {errors.idExpert && <p className="text-red-600 text-sm">{errors.idExpert}</p>}
              </div>
              {user?.role === "Head Sales" && initialData && (
                <div>
                  <label className="block text-sm font-medium mb-1">Ubah Status Program</label>
                  <Select name="statOpti" options={statusOptions} value={selectedStatusValue} onChange={handleSelectChange('statOpti')} styles={selectStyles} classNamePrefix="react-select" />
                  {errors.statOpti && <p className="text-red-600 text-sm">{errors.statOpti}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Sumber *</label>
                <Select name="idSumber" options={sumberOptions} value={selectedSumberValue} onChange={handleSelectChange('idSumber')} placeholder="Pilih sumber opportunity" isClearable styles={selectStyles} classNamePrefix="react-select" />
                {errors.idSumber && <p className="text-red-600 text-sm">{errors.idSumber}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Lampiran Dokumen</label>
                <input type="file" name="proposalOpti" onChange={handleFileChange} accept=".pdf,.doc,.docx" className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tanggal *</label>
                <input type="date" name="datePropOpti" value={formData.datePropOpti || ""} onChange={handleChange} className={inputClass} />
                {errors.datePropOpti && <p className="text-red-600 text-sm">{errors.datePropOpti}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Perusahaan *</label>
                <Select name="idCustomer" options={customerOptions} value={selectedCustomerValue} onChange={handleSelectChange('idCustomer')} placeholder="Pilih perusahaan customer" isClearable styles={selectStyles} classNamePrefix="react-select" />
                {errors.idCustomer && <p className="text-red-600 text-sm">{errors.idCustomer}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea name="kebutuhan" value={formData.kebutuhan || ""} onChange={handleChange} placeholder="(opsional)" className={inputClass} rows={3} />
              </div>
              <div className="md:col-span-2">
                {activeTab === "Training" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipe Training *</label>
                      <Select name="idTypeTraining" options={trainingTypeOptions} value={selectedTrainingTypeValue} onChange={handleSelectChange('idTypeTraining')} placeholder="Pilih tipe training" styles={selectStyles} classNamePrefix="react-select" />
                      {errors.idTypeTraining && <p className="text-red-600 text-sm">{errors.idTypeTraining}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Value</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">Rp.</span>
                        <input type="text" name="valOpti" value={displayValOpti} onChange={handleChange} onBlur={handleBlur} placeholder="Value" className={inputClass + " pl-12"} />
                      </div>
                      {errors.valOpti && <p className="text-red-600 text-sm">{errors.valOpti}</p>}
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Mulai</label>
                        <input type="datetime-local" name="startTraining" value={formData.startTraining || ""} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Selesai</label>
                        <input type="datetime-local" name="endTraining" value={formData.endTraining || ""} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <label className="block text-sm font-medium mb-1">Tempat / Platform</label>
                      <input type="text" name="placeTraining" value={formData.placeTraining || ""} onChange={handleChange} placeholder="Online / alamat / venue" className={inputClass} />
                    </div>
                  </div>
                )}
                {activeTab === "Project" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipe Proyek *</label>
                      <Select name="idTypeTraining" options={projectTypeOptions} value={selectedProjectTypeValue} onChange={handleSelectChange('idTypeTraining')} placeholder="Pilih tipe proyek" styles={selectStyles} classNamePrefix="react-select" />
                      {errors.idTypeTraining && <p className="text-red-600 text-sm">{errors.idTypeTraining}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Value</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">Rp.</span>
                        <input type="text" name="valOpti" value={displayValOpti} onChange={handleChange} onBlur={handleBlur} placeholder="Value" className={inputClass + " pl-12"} />
                      </div>
                      {errors.valOpti && <p className="text-red-600 text-sm">{errors.valOpti}</p>}
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Mulai</label>
                        <input type="datetime-local" name="startTraining" value={formData.startTraining || ""} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Selesai</label>
                        <input type="datetime-local" name="endTraining" value={formData.endTraining || ""} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <label className="block text-sm font-medium mb-1">Tempat / Platform</label>
                      <input type="text" name="placeTraining" value={formData.placeTraining || ""} onChange={handleChange} placeholder="Online / alamat / venue" className={inputClass} />
                    </div>
                  </div>
                )}
                {activeTab === "Outsource" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">Value</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">Rp.</span>
                        <input type="text" name="valOpti" value={displayValOpti} onChange={handleChange} onBlur={handleBlur} placeholder="Value" className={inputClass + " pl-12"} />
                      </div>
                      {errors.valOpti && <p className="text-red-600 text-sm">{errors.valOpti}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {initialData && editTab === "upload_payment" && (
           <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Upload Dokumen Pendaftaran
            </h3>
            {successMsg && (
              <div className="mb-3 p-3 bg-green-50 text-green-800 rounded">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-3 p-3 bg-red-50 text-red-800 rounded">
                {errorMsg}
              </div>
            )}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-40 text-center cursor-pointer hover:border-blue-500 transition-colors"
              onDrop={(e) => {
                e.preventDefault();
                handlePaymentFileChange({
                  target: { files: e.dataTransfer.files },
                });
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                className="hidden"
                onChange={handlePaymentFileChange}
                accept="image/*,.pdf"
                id="payment-upload"
              />
              <label htmlFor="payment-upload" className="cursor-pointer">
                <p className="text-gray-500">
                  Drag & drop file di sini, atau klik untuk memilih file
                </p>
                {paymentProofFile && (
                  <p className="text-green-600 mt-2">
                    File terpilih: {paymentProofFile.name}
                  </p>
                )}
              </label>
            </div>
            {initialData.dokPendaftaranPath && (
               <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Dokumen pendaftaran yang sudah ada:
                </p>
                <a
                  href={`${API_BASE}/${initialData.dokPendaftaranPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-red-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {initialData.dokPendaftaranPath.split("_").pop()}
                  </span>
                </a>
               </div>
             )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="bg-black text-white font-semibold py-2 px-5 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          disabled={(editTab === "upload_payment" && !paymentProofFile) || uploading}
        >
          {uploading ? "Uploading..." : editTab === "upload_payment" ? "Upload File" : "Simpan Data"}
        </button>
        <button type="button" onClick={handleReset} className="bg-white text-gray-700 font-semibold py-2 px-5 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Reset Form
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="ml-auto text-gray-600 hover:underline">
            Tutup
          </button>
        )}
      </div>
    </form>
  );
};
export default OptiForm;