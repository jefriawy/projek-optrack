// src/pages/ProjectPage.js
import React, { useEffect, useMemo, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import pdfIcon from "../iconres/pdf.png";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

/* ===== Helpers ===== */
const countdown = (end) => {
  if (!end) return "-";
  const t = new Date(end).getTime();
  if (isNaN(t)) return "-";
  const diff = t - Date.now();
  if (diff <= 0) return "Selesai";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${d} Hari (Sisa Waktu)`;
};
const fmtDateTime = (v) =>
  v
    ? new Date(v).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })
    : "-";
const fmtDate = (v) =>
  v
    ? new Date(v).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
    : "-";
const diffDays = (start, end) => {
  if (!start || !end) return null;
  const ms = new Date(end) - new Date(start);
  if (isNaN(ms)) return null;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

/* ===== Icons ===== */
const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
  </svg>
);
const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);
const IconUsers = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconMap = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
              <p className="text-xs text-gray-500">Detail informasi proyek</p>
            </div>
            <div className="flex items-center gap-4">
              {badge ? (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>
                  {badge.text}
                </span>
              ) : null}
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">
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
  // feedback modal
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/api/project/mine`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
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
    })();
    return () => controller.abort();
  }, [user?.token]);

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
      if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
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

  if (!user?.token) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Project Page</h1>
        <p className="text-gray-600">
          Silakan login sebagai <b>Expert</b> atau <b>Sales</b> untuk melihat daftar proyek Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Project Page</h1>
        <div className="relative w-64">
          <input
            className="w-full border rounded-full pl-4 pr-10 py-2"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</span>
        </div>
      </div>

      <button
        type="button"
        className="mb-4 inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black"
        onClick={() => alert("Tambah Proyek (manual)")}
      >
        Tambah Proyek
      </button>

      <div className="rounded-2xl border border-gray-300 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50 text-lg font-semibold">
          Jadwal Proyek
        </div>

        <div className="p-5 space-y-5">
          {loading && <div className="text-center text-gray-500 py-10">Memuat data…</div>}
          {!loading && err && <div className="text-center text-red-600 py-10">{err}</div>}

          {!loading &&
            !err &&
            filtered.map((p, idx) => {
              const badge = { text: "Aktif", cls: "bg-emerald-600 text-white" };
              return (
                <div
                  key={p.idProject || idx}
                  className={`rounded-xl border p-4 ${idx % 2 === 1 ? "border-blue-300" : "border-gray-300"}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xl font-semibold">{p.nmProject || "-"}</div>
                      <div className="text-xs text-gray-500">{p.corpCustomer || "-"}</div>
                      <div className="text-xs text-gray-500">
                        Sales: <span className="text-green-600 font-bold">{p.nmSales || "-"}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Expert: <span className="text-purple-600 font-bold">{p.nmExpert || "-"}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${badge.cls}`}>{badge.text}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                      <IconCalendar />
                      <span>
                        {fmtDate(p.endProject)} <span className="text-gray-500">(deadline)</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconClock />
                      <span>{countdown(p.endProject)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconUsers />
                      <span>{p.participants ?? 5} Orang (Tim Proyek)</span>
                    </div>
                  </div>

                  {/* tombol kanan kecil */}
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      className="border rounded-md px-3 py-1.5 text-xs hover:bg-gray-50"
                      onClick={() => openDetail(p.idProject)}
                    >
                      Lihat Detail
                    </button>
                    <button
                      type="button"
                      className="border rounded-md px-3 py-1.5 text-xs hover:bg-gray-50"
                      onClick={() => openFeedbackModal(p)}
                    >
                      Lihat Feedback
                    </button>
                  </div>
                </div>
              );
            })}

          {!loading && !err && filtered.length === 0 && (
            <div className="text-center text-gray-500 py-10">Belum ada proyek.</div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      <Modal open={open} onClose={() => setOpen(false)} title={detail?.nmProject || "Proyek"}
        badge={{ text: "Aktif", cls: "bg-emerald-600 text-white" }}>
        {detailLoading && <div className="text-center text-gray-500 py-6">Memuat detail…</div>}
        {!detailLoading && detailErr && <div className="text-center text-red-600 py-6">{detailErr}</div>}
        {!detailLoading && !detailErr && detail && (
          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-gray-500 mb-2">Jadwal & Lokasi</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Mulai</span>
                  <b>{fmtDateTime(detail.startProject)}</b>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Selesai</span>
                  <b>{fmtDateTime(detail.endProject)}</b>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Durasi</span>
                  <b>{diffDays(detail.startProject, detail.endProject) ?? "-"} hari</b>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-gray-500">
                    <IconMap /> Tempat
                  </span>
                  <b className="text-right">{detail.placeProject || "-"}</b>
                </div>
              </div>
            </div>

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
                    href={`${API_BASE}/uploads/proposals/${detail.proposalOpti.split(/[\\/]/).pop()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-black hover:underline flex items-center gap-2"
                  >
                    <img src={pdfIcon} alt="PDF Icon" className="w-5 h-5" />
                    <span>{detail.proposalOpti.split(/[\\/]/).pop()}</span>
                  </a>
                ) : (
                  <div className="text-sm text-gray-700">Belum ada dokumen.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Feedback */}
      <Modal
        open={openFeedback}
        onClose={() => setOpenFeedback(false)}
        title={`Feedback - ${feedbackTarget?.nmProject || "Proyek"}`}
        badge={{ text: "Aktif", cls: "bg-emerald-600 text-white" }}
      >
        {/* TODO: gantikan ini dengan isi feedback sebenarnya */}
        <div className="text-sm text-gray-700">
          Belum ada feedback. (Hook-kan ke endpoint feedback jika sudah siap.)
        </div>
      </Modal>
    </div>
  );
};

export default ProjectPage;
