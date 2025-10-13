// src/pages/ProjectPage.js
import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import { AuthContext } from "../context/AuthContext";
import pdfIcon from "../iconres/pdf.png";
import {
  FaSearch,
  FaFilePdf,
  FaFileImage,
  FaFileAlt,
  FaTrashAlt,
  FaUpload,
} from "react-icons/fa"; // <-- TAMBAHKAN IKON
import Select from "react-select";
import FeedbackModal from "../components/FeedbackModal";
import AddExpertForm from "../components/AddExpertForm";
import BastUploadForm from "../components/BastUploadForm";
import NotificationBell from "../components/NotificationBell";
import ProjectDetailTab from "../components/ProjectDetailTab";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// --- PERUBAHAN DIMULAI: Komponen baru untuk tab Upload Dokumen ---
const DocumentUploadTab = ({ projectId }) => {
  const { user } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.get(
        `${API_BASE}/api/project/${projectId}/documents`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setExistingDocuments(response.data);
    } catch (err) {
      setError("Gagal memuat daftar dokumen.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user.token]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) setSelectedFiles(files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      setError("");
      await axios.post(
        `${API_BASE}/api/project/${projectId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      setSelectedFiles([]);
      fetchDocuments(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengunggah file.");
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDelete = async (idDocument) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen ini?"))
      return;
    try {
      setError("");
      await axios.delete(`${API_BASE}/api/project/documents/${idDocument}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchDocuments(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menghapus dokumen.");
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension))
      return <FaFilePdf className="text-red-500 text-xl" />;
    if (["jpg", "jpeg", "png", "gif"].includes(extension))
      return <FaFileImage className="text-blue-500 text-xl" />;
    return <FaFileAlt className="text-gray-500 text-xl" />;
  };

  return (
    <div className="space-y-4">
      {/* Drag & drop besar */}
      <div
        className={`rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging ? "bg-gray-50 border-blue-400" : "bg-white border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current && inputRef.current.click()}
        role="button"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="min-h-[160px] flex flex-col items-center justify-center text-center">
          {selectedFiles.length === 0 ? (
            <>
              <div className="text-gray-400 text-sm">
                <div className="text-lg font-medium mb-2">
                  Drag & drop file di sini
                </div>
                <div className="mb-2">atau klik untuk memilih file</div>
                <div className="text-xs text-gray-500">
                  PDF, JPG, PNG, dan dokumen lainnya. Klik area untuk membuka
                  dialog file.
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-green-600 font-medium mb-1">
                File terpilih:
              </div>
              <div className="max-h-28 overflow-auto text-sm text-green-700">
                <ul className="list-none space-y-1">
                  {selectedFiles.map((f, i) => (
                    <li key={i} className="truncate px-4">
                      {f.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Klik area untuk menambah/ubah pilihan file.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tombol di bawah, kanan; Batalkan di kiri Upload */}
      <div className="flex justify-end items-center gap-3">
        <button
          onClick={() => {
            setSelectedFiles([]);
            if (inputRef.current) inputRef.current.value = null;
          }}
          className="px-4 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-100"
        >
          Batalkan Pilihan
        </button>

        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploadProgress > 0}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <FaUpload />
          {uploadProgress > 0
            ? `Mengunggah... ${uploadProgress}%`
            : "Unggah File"}
        </button>
      </div>

      {/* Error / preview kecil */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Daftar dokumen tersimpan */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Dokumen Tersimpan</h4>
        {isLoading ? (
          <p>Memuat...</p>
        ) : (
          <div className="space-y-3">
            {existingDocuments.length > 0 ? (
              existingDocuments.map((doc) => (
                <div
                  key={doc.idDocument}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.fileNameOriginal)}
                    <div>
                      <a
                        href={`${API_BASE}/uploads/project_documents/${doc.fileNameStored}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {doc.fileNameOriginal}
                      </a>
                      <p className="text-xs text-gray-500">
                        diunggah oleh {doc.uploadedByName || "User"} pada{" "}
                        {new Date(doc.uploadTimestamp).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.idDocument)}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-full"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                Belum ada dokumen yang diunggah.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// --- AKHIR PERUBAHAN ---

/* Helpers tanggal & status, Icons, dan Modal tidak berubah */
// (Kode di bawah ini tidak diubah dan dibiarkan seperti aslinya)
const safeTime = (v) => {
  const t = new Date(v).getTime();
  return isNaN(t) ? null : t;
};
const fmtDateTime = (v) =>
  v
    ? new Date(v).toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "-";
const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";
const diffDays = (start, end) => {
  const s = safeTime(start);
  const e = safeTime(end);
  if (!s || !e) return null;
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
};
const formatRemaining = (ms) => {
  if (!ms || ms <= 0) return "0:00:00";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / (24 * 3600));
  if (days > 0) {
    const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
    return `${days} hari ${hours} jam`;
  }
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
};
const computeStatus = (start, end, now = Date.now()) => {
  const s = safeTime(start);
  const e = safeTime(end);
  if (s && now < s) {
    return {
      key: "pending",
      label: "Po Received",
      className: "bg-amber-500 text-white",
    };
  }
  if (s && (!e || now <= e) && now >= s) {
    const remaining = e ? e - now : 0;
    return {
      key: "running",
      label: e ? `Project On Progress · ${formatRemaining(remaining)}` : "Project On Progress",
      className: "bg-blue-600 text-white",
      remaining,
    };
  }
  if (e && now > e) {
    return {
      key: "finished",
      label: "Project Delivered",
      className: "bg-green-500 text-white",
    };
  }
  return {
    key: "pending",
    label: "Po Received",
    className: "bg-amber-500 text-white",
  };
};
const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
  </svg>
);
const IconClock = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);
const IconUsers = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconMap = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="M9 18l6-3 6 3V6l-6-3-6 3-6-3v12l6 3zM9 18V6M15 15V3" />
  </svg>
);
const Modal = ({ open, onClose, title, badge, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_.15s_ease]">
          <div className="px-6 py-4 border-b flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-xs text-gray-500">
                {badge && badge.customer
                  ? badge.customer
                  : "Detail informasi proyek"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {badge ? (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}
                >
                  {badge.text}
                </span>
              ) : null}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
const getDisplayName = (user) => {
  if (!user) return "User";
  return (
    user.name ||
    user.nmExpert ||
    user.fullName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "User")
  );
};
const getAvatarUrl = (user) => {
  if (!user) return null;
  const candidate =
    user.photoURL ||
    user.photoUrl ||
    user.photo ||
    user.avatar ||
    user.image ||
    user.photoUser ||
    null;
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return `${API_BASE}/uploads/avatars/${String(candidate)
    .split(/[\\/]/)
    .pop()}`;
};
const Initials = ({ name }) => {
  const ini = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
      {ini}
    </div>
  );
};

/* ===== Page Component ===== */
const ProjectPage = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErr, setDetailErr] = useState("");
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);
  const [activeTab, setActiveTab] = useState("detail");
  const [openBast, setOpenBast] = useState(false);

  const [, forceTick] = useState(0);
  const tickRef = useRef(null);
  useEffect(() => {
    tickRef.current = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  useEffect(() => {
    if (open || openBast) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open, openBast]);

  const fetchProjects = useCallback(
    async (signal) => {
      const endpoint = user?.role === "Admin" ? "" : "/mine";
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/api/project${endpoint}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          signal,
        });
        if (!res.ok)
          throw new Error(await res.text().catch(() => res.statusText));
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setErr("Gagal memuat data proyek.");
        }
      } finally {
        setLoading(false);
      }
    },
    [user?.token, user?.role]
  );

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    fetchProjects(controller.signal);
    return () => controller.abort();
  }, [user?.token, fetchProjects]);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase();
    return projects.filter((p) => {
      const name = (p.nmProject || "").toLowerCase();
      const cust = (p.corpCustomer || "").toLowerCase();
      const place = (p.placeProject || "").toLowerCase();
      return name.includes(q) || cust.includes(q) || place.includes(q);
    });
  }, [projects, query]);

  const openDetail = async (id) => {
    if (!user?.token) return;
    setOpen(true);
    setActiveTab("detail"); // Reset to detail tab when opening
    setDetail(null);
    setDetailErr("");
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/project/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok)
        throw new Error(await res.text().catch(() => res.statusText));
      const data = await res.json();
      setDetail(data);
    } catch (e) {
      console.error(e);
      setDetailErr("Gagal memuat detail proyek.");
    } finally {
      setDetailLoading(false);
    }
  };
  const openFeedbackModal = (p) => {
    setFeedbackTarget(p);
    setOpenFeedback(true);
  };
  const handleFeedbackSubmit = async (target, feedbackData) => {
    if (!target || !feedbackData) return;
    try {
      await axios.put(
        `${API_BASE}/api/project/${target.idProject}/feedback`,
        feedbackData, // feedbackData is now FormData
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOpenFeedback(false);
      // Perbarui state secara lokal agar perubahan langsung terlihat
      setProjects(prevProjects => 
        prevProjects.map(p => {
          if (p.idProject === target.idProject) {
            // Ambil data dari FormData untuk update lokal
            const newFeedback = feedbackData.get('feedback');
            // Karena kita tidak bisa membaca file dari FormData di client,
            // kita panggil fetchProjects untuk mendapatkan data lampiran yang akurat.
            fetchProjects(); 
            return { ...p, fbProject: newFeedback }; // Update feedback text sementara
          }
          return p;
        })
      );
    } catch (error) {
      console.error("Failed to submit feedback", error);
      alert("Gagal menyimpan feedback.");
    }
  };

  if (!user?.token) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Project Page</h1>
        <p className="text-gray-600">
          Silakan login sebagai <b>Expert</b> atau <b>Sales</b> untuk melihat
          daftar proyek Anda.
        </p>
      </div>
    );
  }

  const now = Date.now();
  const isPM = user?.role === "PM";

  return (
    <div className="p-6">
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Project Page
          </h1>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center">
          <div className="relative flex items-center w-full md:w-64 mb-4 md:mb-0 md:mr-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-3 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FaSearch className="absolute right-3 text-gray-400" />
          </div>
          <div className="flex items-center gap-3 pl-4 border-l">
            {getAvatarUrl(user) ? (
              <img
                src={getAvatarUrl(user)}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <Initials name={getDisplayName(user)} />
            )}
            <div className="leading-5">
              <div className="text-sm font-bold">{getDisplayName(user)}</div>
              <div className="text-xs text-gray-500">
                Logged in • {user?.role || "User"}
              </div>
            </div>
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-gray-300 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50 text-lg font-semibold">
          Jadwal Proyek
        </div>
        <div className="p-5 space-y-5">
          {loading && (
            <div className="text-center text-gray-500 py-10">Memuat data…</div>
          )}
          {!loading && err && (
            <div className="text-center text-red-600 py-10">{err}</div>
          )}
          {!loading &&
            !err &&
            filtered.map((p, idx) => {
              const st = computeStatus(p.startProject, p.endProject, now);
              const badge = { text: st.label, cls: st.className };
              return (
                <div
                  key={p.idProject || idx}
                  className={`rounded-xl border p-4 ${
                    idx % 2 === 1 ? "border-blue-300" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-semibold">
                        {p.nmProject || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {p.corpCustomer || "-"}
                      </div>
                      {(() => {
                        const role = (user?.role || "").toLowerCase();
                        if (role === "expert" || role === "sales") {
                          return (
                            <div className="text-xs text-gray-500">
                              PM:{" "}
                              <span className="text-green-600 font-bold">
                                {p.nmPM || "-"}
                              </span>
                            </div>
                          );
                        }
                        if (role.includes("head") && role.includes("sales")) {
                          return (
                            <>
                              <div className="text-xs text-gray-500">
                                PM:{" "}
                                <span className="text-purple-600 font-bold">
                                  {p.nmPM || "-"}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Sales:{" "}
                                <span className="text-green-600 font-bold">
                                  {p.nmSales || "-"}
                                </span>
                              </div>
                            </>
                          );
                        }
                        return (
                          <>
                            <div className="text-xs text-gray-500">
                              Sales:{" "}
                              <span className="text-green-600 font-bold">
                                {p.nmSales || "-"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Expert:{" "}
                              <span className="text-purple-600 font-bold">
                                {p.nmExpert || "-"}
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${badge.cls}`}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <IconCalendar />
                      <span>
                        {fmtDate(p.startProject)} – {fmtDate(p.endProject)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock />
                      <span>
                        {st.key === "running"
                          ? `Sisa: ${formatRemaining(st.remaining)}`
                          : st.key === "pending"
                          ? "Belum mulai"
                          : "Selesai"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => openDetail(p.idProject)}
                    >
                      {["PM", "Expert"].includes(user.role)
                        ? "Menu"
                        : "Lihat Detail"}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                      onClick={() => openFeedbackModal(p)}
                      disabled={st.key !== "finished"}
                    >
                      {isPM ? "Beri/Edit Feedback" : "Lihat Feedback"}
                    </button>
                    {/* Tombol upload dokumen BAST khusus untuk PM saat project finished */}
                    {isPM && st.key === "finished" && (
                      <button
                        type="button"
                        className="px-4 py-2 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                        onClick={() => {
                          setDetail(p);
                          setOpenBast(true);
                        }}
                      >
                        Upload Dokumen BAST
                      </button>
                    )}
      {/* Modal Upload BAST */}
      {openBast && (
        <Modal
          open={openBast}
          onClose={() => setOpenBast(false)}
          title={detail?.nmProject || "Upload BAST"}
          badge={{ customer: detail?.corpCustomer || "" }}
        >
          <BastUploadForm
            projectId={detail?.idProject}
            onUploaded={() => setOpenBast(false)}
            onClose={() => setOpenBast(false)}
          />
        </Modal>
      )}
                  </div>
                </div>
              );
            })}
          {!loading && !err && filtered.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              Belum ada proyek.
            </div>
          )}
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={detail?.nmProject || "Proyek"}
        badge={
          detail
            ? (() => {
                const st = computeStatus(
                  detail.startProject,
                  detail.endProject
                );
                return {
                  text: st.label,
                  cls: st.className,
                  customer: detail.corpCustomer || "",
                };
              })()
            : null
        }
      >
        {detailLoading && (
          <div className="text-center text-gray-500 py-6">Memuat detail…</div>
        )}
        {!detailLoading && detailErr && (
          <div className="text-center text-red-600 py-6">{detailErr}</div>
        )}
        {!detailLoading &&
          !detailErr &&
          detail &&
          (() => {
            const isDelivered =
              computeStatus(detail.startProject, detail.endProject).key ===
              "finished";

            return (
              <div>
                {["PM", "Expert"].includes(user.role) && (
                  <div className="border-b border-gray-200 mb-4">
                    <div className="flex items-center gap-2 -mb-px">
                      <button
                        className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                          activeTab === "detail"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveTab("detail")}
                      >
                        Detail
                      </button>
                      {user.role === "PM" && (
                        <button
                          className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                            activeTab === "addExpert"
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          onClick={() => setActiveTab("addExpert")}
                          disabled={isDelivered}
                        >
                          Tambah Expert
                        </button>
                      )}
                      <button
                        className={`px-4 py-2 text-sm font-semibold border-b-2 ${
                          activeTab === "uploadDocument"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => setActiveTab("uploadDocument")}
                        disabled={isDelivered}
                      >
                        Upload Dokumen
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "detail" && <ProjectDetailTab project={detail} />}

                {activeTab === "addExpert" && user.role === "PM" && (
                  <AddExpertForm projectId={detail.idProject} />
                )}

                {/* --- PERUBAHAN DIMULAI: Tampilkan komponen upload dokumen --- */}
                {activeTab === "uploadDocument" && (
                  <DocumentUploadTab projectId={detail.idProject} />
                )}
                {/* --- AKHIR PERUBAHAN --- */}
              </div>
            );
          })()}
      </Modal>
      <FeedbackModal
        isOpen={openFeedback}
        onClose={() => setOpenFeedback(false)}
        targetData={feedbackTarget}
        canEdit={isPM}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default ProjectPage;
