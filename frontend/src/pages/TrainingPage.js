// src/pages/TrainingPage.js
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
import { FaSearch } from "react-icons/fa";
import FeedbackModal from "../components/FeedbackModal";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

/* ===== Helpers tanggal & status ===== */
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
      key: "received",
      label: "Po Received", // Ganti label
      className: "bg-amber-500 text-white",
    };
  }
  if (s && (!e || now <= e) && now >= s) {
    const remaining = e ? e - now : 0;
    return {
      key: "onprogress",
      label: e
        ? `Training On Progress · ${formatRemaining(remaining)}`
        : "Training On Progress", // Ganti label
      className: "bg-blue-600 text-white",
      remaining,
    };
  }
  if (e && now > e) {
    return {
      key: "delivered",
      label: "Training Delivered", // Ganti label
      className: "bg-green-500 text-white",
    };
  }
  return {
    key: "received",
    label: "Po Received", // Ganti label default
    className: "bg-amber-500 text-white",
  };
};

/* ===== Icons ===== */
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

/* ===== Simple Modal ===== */
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
              <p className="text-xs text-gray-500">{badge && badge.customer ? badge.customer : "Detail informasi training"}</p>
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

/* ====== User chip helpers (nama & avatar) ====== */
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

/* ===== Page ===== */
const TrainingPage = () => {
  const { user } = useContext(AuthContext);
  const [list, setList] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErr, setDetailErr] = useState("");
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  const [, forceTick] = useState(0);
  const tickRef = useRef(null);
  useEffect(() => {
    tickRef.current = setInterval(() => forceTick((n) => n + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  const fetchTrainings = useCallback(
    async (signal) => {
      const endpoint =
        user?.role === "Admin" || user?.role === "Akademik" ? "" : "/mine";

      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/api/training${endpoint}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          signal,
        });
        if (!res.ok)
          throw new Error(await res.text().catch(() => res.statusText));
        const data = await res.json();
        setList(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
          setErr("Gagal memuat data training.");
        }
      } finally {
        setLoading(false);
      }
    },
    [user?.token, user?.role] // Tambahkan user.role sebagai dependency
  );

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    fetchTrainings(controller.signal);
    return () => controller.abort();
  }, [user?.token, fetchTrainings]);

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase();
    return list.filter((t) => {
      const name = (t.nmTraining || "").toLowerCase();
      const cust = (t.corpCustomer || "").toLowerCase();
      const place = (t.placeTraining || "").toLowerCase();
      return name.includes(q) || cust.includes(q) || place.includes(q);
    });
  }, [list, query]);

  const openDetail = async (id) => {
    if (!user?.token) return;
    setOpen(true);
    setDetail(null);
    setDetailErr("");
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/training/${id}`, {
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
      setDetailErr("Gagal memuat detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  const openFeedbackModal = async (t) => {
    if (!user?.token) return;

    setOpenFeedback(true);
    setFeedbackTarget(null); // Reset data di modal saat loading

    try {
      const res = await axios.get(`${API_BASE}/api/training/${t.idTraining}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const detailedData = res.data;

      // Parsing JSON jika fbAttachments adalah string
      if (
        detailedData.fbAttachments &&
        typeof detailedData.fbAttachments === "string"
      ) {
        try {
          detailedData.fbAttachments = JSON.parse(detailedData.fbAttachments);
        } catch (e) {
          console.error("Failed to parse fbAttachments:", e);
          detailedData.fbAttachments = [];
        }
      }

      setFeedbackTarget(detailedData); // Set target data dengan data yang lebih detail
    } catch (error) {
      console.error("Failed to fetch feedback details:", error);
      alert("Gagal memuat detail feedback.");
      setOpenFeedback(false);
    }
  };

  const handleFeedbackSubmit = async (target, formData) => {
    if (!target) return;
    try {
      await axios.put(
        `${API_BASE}/api/training/${target.idTraining}/feedback`,
        formData, // Mengirim FormData
        {
          headers: {
            "Content-Type": "multipart/form-data", // Penting untuk mengirim file
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setOpenFeedback(false);
      const controller = new AbortController();
      fetchTrainings(controller.signal);
    } catch (error) {
      console.error("Failed to submit feedback", error);
      alert("Gagal menyimpan feedback.");
    }
  };

  if (!user?.token) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Training Page</h1>
        <p className="text-gray-600">
          Silakan login untuk melihat jadwal training Anda.
        </p>
      </div>
    );
  }

  const now = Date.now();

  const canGiveFeedback = user?.role === "Admin" || user?.role === "Akademik";

  return (
    <div className="p-6">
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Training Page
          </h1>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center">
          <div className="relative flex items-center w-full md:w-64 mb-4 md:mb-0 md:mr-4">
            <input
              type="text"
              placeholder="Search..."
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
            <div className="flex items-center gap-4 mt-4 md:mt-0"> {/* Container untuk Lonceng + Chip */}
                        
                        {/* Lonceng Notifikasi */}
                        {user && <NotificationBell />}
             </div> 
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-gray-300 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50 text-lg font-semibold">
          Jadwal Training
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
            filtered.map((t, idx) => {
              const st = computeStatus(t.startTraining, t.endTraining, now);
              const badge = { text: st.label, cls: st.className };
              return (
                <div
                  key={t.idTraining || idx}
                  className={`rounded-xl border p-4 ${
                    idx % 2 === 1 ? "border-blue-300" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-semibold">
                        {t.nmTraining || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.corpCustomer || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Sales:{" "}
                        <span className="text-green-600 font-bold">
                          {t.nmSales || "-"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Trainer:{" "}
                        <span className="text-purple-600 font-bold">
                          {t.nmExpert || "-"}
                        </span>
                      </div>
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
                        {fmtDate(t.startTraining)} – {fmtDate(t.endTraining)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock />
                      <span>
                        {st.key === "onprogress"
                          ? `Sisa: ${formatRemaining(st.remaining)}`
                          : st.key === "received"
                          ? "Belum mulai"
                          : "Selesai"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => openDetail(t.idTraining)}
                    >
                      Lihat Detail
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                      onClick={() => openFeedbackModal(t)}
                      disabled={st.key !== "delivered"}
                    >
                      {canGiveFeedback
                        ? "Beri/Edit Feedback"
                        : "Lihat Feedback"}
                    </button>
                  </div>
                </div>
              );
            })}
          {!loading && !err && filtered.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              Belum ada training.
            </div>
          )}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={detail?.nmTraining || "Training"}
        badge={
          detail
            ? (() => {
                const st = computeStatus(
                  detail.startTraining,
                  detail.endTraining
                );
                return {
                  text: st.label,
                  cls: st.className,
                  customer: detail.corpCustomer || ""
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
        {!detailLoading && !detailErr && detail && (
          <div className="space-y-6">
            {/* Jadwal & Lokasi */}
            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500 mb-2">Jadwal & Lokasi</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Mulai</span>
                    <b>{fmtDateTime(detail.startTraining)}</b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Selesai</span>
                    <b>{fmtDateTime(detail.endTraining)}</b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Durasi</span>
                    <b>
                      {diffDays(detail.startTraining, detail.endTraining) ?? "-"} hari
                    </b>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-gray-500">
                      <IconMap /> Tempat
                    </span>
                    <b className="text-right">{detail.placeTraining || "-"}</b>
                  </div>
                </div>
              </div>
            </div>
            {/* Sales & Trainer Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border p-4 flex flex-col justify-center items-start">
                <div className="text-sm text-gray-500 mb-2">Sales</div>
                <div className="text-sm font-normal text-gray-800">{detail.nmSales || "-"}</div>
              </div>
              <div className="rounded-lg border p-4 flex flex-col justify-center items-start">
                <div className="text-sm text-gray-500 mb-2">Trainer</div>
                <div className="text-sm font-normal text-gray-800">{detail.nmExpert || "-"}</div>
              </div>
            </div>
            {/* Deskripsi & Dokumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500 mb-2">Deskripsi</div>
                <div className="text-sm text-gray-700 leading-6">
                  {detail.kebutuhan || "Belum ada deskripsi."}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500 mb-2">Dokumen</div>
                {detail.proposalOpti ? (
                  <a
                    href={`${API_BASE}/uploads/proposals/${detail.proposalOpti
                      .split(/[\\/]/)
                      .pop()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-black hover:underline flex items-center gap-2"
                  >
                    <img src={pdfIcon} alt="PDF Icon" className="w-5 h-5" />
                    <span>{detail.proposalOpti.split(/[\\/]/).pop()}</span>
                  </a>
                ) : (
                  <div className="text-sm text-gray-700">
                    Belum ada dokumen.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <FeedbackModal
        isOpen={openFeedback}
        onClose={() => setOpenFeedback(false)}
        targetData={feedbackTarget}
        canEdit={canGiveFeedback}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};

export default TrainingPage;
