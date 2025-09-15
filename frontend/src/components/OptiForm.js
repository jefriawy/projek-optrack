// src/components/OptiForm.js
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Function to format number to Rupiah currency string
const formatRupiah = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "";
  return new Intl.NumberFormat("id-ID").format(amount);
};

// Function to parse Rupiah currency string to number
const parseRupiah = (rupiahString) => {
  if (typeof rupiahString !== 'string') {
    return rupiahString;
  }
  if (!rupiahString) return null;
  const cleanedString = rupiahString.replace(/[^,\d]/g, '').replace(/,/g, '.');
  const parsed = parseFloat(cleanedString);
  return isNaN(parsed) ? null : parsed;
};

// ---- static list: samakan dengan isi tabel `typetraining`
const TYPE_TRAININGS = [
  { id: 1, name: "Default Training" },
  { id: 2, name: "Public Training" },
  { id: 3, name: "Inhouse Training" },
  { id: 4, name: "Online Training" },
];

// ---- static list: samakan dengan isi tabel `typeproject`
const TYPE_PROJECTS = [
  { id: 1, name: "Default Project" },
  { id: 2, name: "Public Project" },
  { id: 3, name: "Inhouse Project" },
  { id: 4, name: "Online Project" },
];

/* =========================
   Helpers normalisasi waktu
   ========================= */
const normalizeMySQLDateTimeToLocal = (val) => {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val)) return val.slice(0, 16);
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(val)) {
    const [d, t] = val.split(" ");
    const [hh, mm] = t.split(":");
    return `${d}T${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
  }
  const d = new Date(val);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day}T${h}:${mi}`;
  }
  return "";
};
const normalizeDateOnly = (val) => {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  if (/^\d{4}-\d{2}-\d{2}\b/.test(val)) return val.slice(0, 10);
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
  // eslint-disable-next-line no-console
  console.log("[OptiForm] initialData:", data);
  let start = "", end = "", idType = "", place = "";
  if (data.jenisOpti === "Training") {
    start = data.startTraining ? normalizeMySQLDateTimeToLocal(data.startTraining) : "";
    end = data.endTraining ? normalizeMySQLDateTimeToLocal(data.endTraining) : "";
    idType = data.idTypeTraining === null || data.idTypeTraining === undefined ? "" : String(data.idTypeTraining);
    place = data.placeTraining || "";
  } else if (data.jenisOpti === "Project") {
    start = data.startProject ? normalizeMySQLDateTimeToLocal(data.startProject) : "";
    end = data.endProject ? normalizeMySQLDateTimeToLocal(data.endProject) : "";
    idType = data.idTypeProject === null || data.idTypeProject === undefined ? "" : String(data.idTypeProject);
    place = data.placeProject || "";
  }
  const norm = {
    ...data,
    datePropOpti: normalizeDateOnly(data.datePropOpti),
    startTraining: start,
    endTraining: end,
    idTypeTraining: idType,
    placeTraining: place,
    valOpti: parseRupiah(data.valOpti),
  };
  // eslint-disable-next-line no-console
  console.log("[OptiForm] normalized initialData:", norm);
  return norm;
};
/* =========================
   Yup Schema (dinamis by role)
   ========================= */
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
        if (jenisOpti === "Training" || jenisOpti === "Project") {
          return schema.required("Expert wajib dipilih untuk jenis ini");
        }
        return schema;
      }),
    idTypeTraining: Yup.number()
      .typeError("Pilih tipe")
      .when("jenisOpti", {
        is: (val) => val === "Training" || val === "Project",
        then: (s) => s.required("Tipe wajib dipilih"),
        otherwise: (s) => s.nullable(),
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
/* =========================
   Komponen Form
   ========================= */
const OptiForm = ({ initialData, onSubmit, onClose, mode = "create" }) => {
  const { user } = useContext(AuthContext);
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
    jenisOpti: "",
    idExpert: "",
    idTypeTraining: "",
    startTraining: "",
    endTraining: "",
    placeTraining: "",
    valOpti: "",
  };
  const seed = normalizeInitialData(initialData);
  // eslint-disable-next-line no-console
  console.log("[OptiForm] seed for formData:", seed);
  const [formData, setFormData] = useState({
    ...baseState,
    ...seed,
    statOpti: seed.statOpti || baseState.statOpti,
    datePropOpti: seed.datePropOpti || baseState.datePropOpti,
  });
  const [displayValOpti, setDisplayValOpti] = useState(formatRupiah(seed.valOpti));
  const [errors, setErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [sumber, setSumber] = useState([]);
  const [experts, setExperts] = useState([]);
  const [proposalFile, setProposalFile] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (!user?.token) return;
      try {
        const res = await axios.get(`${API_BASE}/api/opti/form-options`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCustomers(res.data.customers || []);
        setSumber(res.data.sumber || []);
        // ====== SATU-SATUNYA PERUBAHAN: normalisasi experts ======
        const rawExperts = Array.isArray(res.data.experts) ? res.data.experts : [];
        const normalizedExperts = rawExperts
          .map((e) => ({
            idExpert: e.idExpert ?? e.id_expert ?? e.id ?? e.ID ?? null,
            nmExpert:
              e.nmExpert ?? e.nm_expert ?? e.name ?? e.fullName ?? e.username ?? null,
          }))
          .filter((e) => e.idExpert && e.nmExpert);
        setExperts(normalizedExperts);
        // =========================================================
      } catch (e) {
        console.error("Error fetching form options:", e);
      }
    };
    run();
  }, [user?.token]);

  useEffect(() => {
    const safe = normalizeInitialData(initialData);
    // eslint-disable-next-line no-console
    console.log("[OptiForm] useEffect initialData changed, safe:", safe);
    setFormData((prev) => ({
      ...baseState,
      ...safe,
      statOpti: safe.statOpti || baseState.statOpti,
      datePropOpti: safe.datePropOpti || baseState.datePropOpti,
    }));
    setDisplayValOpti(formatRupiah(safe.valOpti));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

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
  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setProposalFile(file);
    if (user?.role === "Sales" && file) {
      setFormData((s) => ({ ...s, statOpti: "Entry" }));
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
    setFormData({
      ...baseState,
      ...safe,
      statOpti: safe.statOpti || baseState.statOpti,
      datePropOpti: safe.datePropOpti || baseState.datePropOpti,
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

      // === NORMALISASI FIELD JADWAL SESUAI JENIS ===
      if (payload.jenisOpti === "Project") {
        payload.startProject = payload.startTraining || "";
        payload.endProject   = payload.endTraining   || "";
        payload.placeProject = payload.placeTraining || "";
        payload.idTypeProject = payload.idTypeTraining ?? "";
      } else if (payload.jenisOpti === "Training") {
        payload.startTraining = payload.startTraining || "";
        payload.endTraining   = payload.endTraining   || "";
        payload.placeTraining = payload.placeTraining || "";
        payload.idTypeTraining = payload.idTypeTraining ?? "";
      }

      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v ?? ""));
      if (proposalFile) fd.append("proposalOpti", proposalFile);

      onSubmit(fd);
    } catch (err) {
      const vErr = {};
      if (err.inner) err.inner.forEach((e) => (vErr[e.path] = e.message));
      setErrors(vErr);
    }
  }

  const isExpertRequired =
    formData.jenisOpti === "Training" || formData.jenisOpti === "Project";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {/* Nama Opti */}
        <div>
          <label className="block text-sm font-medium mb-1">Nama Opti *</label>
          <input
            type="text"
            name="nmOpti"
            value={formData.nmOpti || ""}
            onChange={handleChange}
            placeholder="Masukkan nama opportunity"
            className={inputClass}
          />
          {errors.nmOpti && (
            <p className="text-red-600 text-sm">{errors.nmOpti}</p>
          )}
        </div>

        {/* Kontak */}
        <div>
          <label className="block text-sm font-medium mb-1">Kontak Opti</label>
          <input
            type="text"
            name="contactOpti"
            value={formData.contactOpti || ""}
            onChange={handleChange}
            placeholder="Nama kontak PIC"
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="emailOpti"
            value={formData.emailOpti || ""}
            onChange={handleChange}
            placeholder="contoh@email.com"
            className={inputClass}
          />
          {errors.emailOpti && (
            <p className="text-red-600 text-sm">{errors.emailOpti}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium mb-1">Mobile</label>
          <input
            type="text"
            name="mobileOpti"
            value={formData.mobileOpti || ""}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            className={inputClass}
          />
        </div>

        {/* Jenis Opti */}
        <div>
          <label className="block text-sm font-medium mb-1">Jenis Opti *</label>
          <select
            name="jenisOpti"
            value={formData.jenisOpti || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Pilih Jenis Opti</option>
            <option value="Training">Training</option>
            <option value="Project">Project</option>
            <option value="Outsource">Outsource</option>
          </select>
          {errors.jenisOpti && (
            <p className="text-red-600 text-sm">{errors.jenisOpti}</p>
          )}
        </div>

        {/* Expert */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Expert {isExpertRequired ? "*" : ""}
          </label>
          <select
            name="idExpert"
            value={formData.idExpert || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Pilih Expert</option>
            {experts.map((ex) => (
              <option key={ex.idExpert} value={ex.idExpert}>
                {ex.nmExpert}
              </option>
            ))}
          </select>
          {errors.idExpert && (
            <p className="text-red-600 text-sm">{errors.idExpert}</p>
          )}
        </div>

        {/* Status Opti */}
        {user?.role !== "Sales" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Status Opti *
            </label>
            <select
              name="statOpti"
              value={formData.statOpti || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Pilih status opportunity</option>
              <option value="Entry">Entry</option>
              <option value="Delivered">Delivered</option>
              <option value="PO Received">PO Received</option>
              <option value="Reject">Reject</option>
            </select>
            {errors.statOpti && (
              <p className="text-red-600 text-sm">{errors.statOpti}</p>
            )}
          </div>
        )}

        {/* Sumber */}
        <div>
          <label className="block text-sm font-medium mb-1">Sumber *</label>
          <select
            name="idSumber"
            value={formData.idSumber || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Pilih sumber opportunity</option>
            {sumber.length === 0 ? (
              <option value="" disabled>
                (Belum ada data sumber)
              </option>
            ) : (
              sumber.map((s) => (
                <option key={s.idSumber} value={s.idSumber}>
                  {s.nmSumber}
                </option>
              ))
            )}
          </select>
          {errors.idSumber && (
            <p className="text-red-600 text-sm">{errors.idSumber}</p>
          )}
        </div>

        {/* Proposal file */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Lampiran Dokumen
          </label>
          <input
            type="file"
            name="proposalOpti"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
          />
        </div>

        {/* Tanggal Opti */}
        <div>
          <label className="block text-sm font-medium mb-1">Tanggal *</label>
          <input
            type="date"
            name="datePropOpti"
            value={formData.datePropOpti || ""}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.datePropOpti && (
            <p className="text-red-600 text-sm">{errors.datePropOpti}</p>
          )}
        </div>

        {/* Perusahaan */}
        <div>
          <label className="block text-sm font-medium mb-1">Perusahaan *</label>
          <select
            name="idCustomer"
            value={formData.idCustomer || ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Pilih perusahaan customer</option>
            {customers.map((c) => (
              <option key={c.idCustomer} value={c.idCustomer}>
                {c.corpCustomer} - {c.nmCustomer}
              </option>
            ))}
          </select>
          {errors.idCustomer && (
            <p className="text-red-600 text-sm">{errors.idCustomer}</p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            name="kebutuhan"
            value={formData.kebutuhan || ""}
            onChange={handleChange}
            placeholder="(opsional)"
            className={inputClass}
            rows={3}
          />
        </div>

        {/* ====== Khusus Training atau Project ====== */}
        {(formData.jenisOpti === "Training" ||
          formData.jenisOpti === "Project") && (
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Tipe Training / Project */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {formData.jenisOpti === "Training"
                    ? "Tipe Training"
                    : "Tipe Proyek"}{" "}
                  *
                </label>
                <select
                  name="idTypeTraining"
                  value={formData.idTypeTraining || ""}
                  defaultValue={formData.idTypeTraining || ""}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">
                    {formData.jenisOpti === "Training"
                      ? "Pilih tipe training"
                      : "Pilih tipe proyek"}
                  </option>
                  {(formData.jenisOpti === "Training"
                    ? TYPE_TRAININGS
                    : TYPE_PROJECTS
                  ).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.idTypeTraining && (
                  <p className="text-red-600 text-sm">
                    {errors.idTypeTraining}
                  </p>
                )}
              </div>
              {/* Value */}
              <div>
                <label className="block text-sm font-medium mb-1">Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">
                    Rp.
                  </span>
                  <input
                    type="text"
                    name="valOpti"
                    value={displayValOpti}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Value"
                    className={inputClass + " pl-12"}
                  />
                </div>
                {errors.valOpti && (
                  <p className="text-red-600 text-sm">{errors.valOpti}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-2">
              {/* Mulai */}
              <div>
                <label className="block text-sm font-medium mb-1">Mulai</label>
                <input
                  type="datetime-local"
                  name="startTraining"
                  value={formData.startTraining || ""}
                  defaultValue={formData.startTraining || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              {/* Selesai */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Selesai
                </label>
                <input
                  type="datetime-local"
                  name="endTraining"
                  value={formData.endTraining || ""}
                  defaultValue={formData.endTraining || ""}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
            {/* Tempat/Platform */}
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">
                Tempat / Platform
              </label>
              <input
                type="text"
                name="placeTraining"
                value={formData.placeTraining || ""}
                defaultValue={formData.placeTraining || ""}
                onChange={handleChange}
                placeholder="Online / alamat / venue"
                className={inputClass}
              />
            </div>
          </div>
        )}
        {/* ====== END khusus Training / Project ====== */}
      </div>

      <div className="flex items-center gap-3 pt-2">
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
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-gray-600 hover:underline"
          >
            Tutup
          </button>
        )}
      </div>
    </form>
  );
};

export default OptiForm;
