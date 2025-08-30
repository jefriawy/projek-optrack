// src/pages/TrainingPage.js
import React, { useEffect, useMemo, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

/* ===== Helpers (date-based fallback) ===== */
const getBadge = (start, end) => {
  if (!end) return { text: "Open", cls: "bg-emerald-500 text-white" };
  const now = new Date();
  const endD = new Date(end);
  if (isNaN(endD)) return { text: "Open", cls: "bg-emerald-500 text-white" };
  if (endD <= now) return { text: "Closed", cls: "bg-gray-900 text-white" };
  const diffDays = Math.ceil((endD - now) / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return { text: "Almost Full", cls: "bg-yellow-500 text-black" };
  return { text: "Open", cls: "bg-emerald-500 text-white" };
};
const countdown = (end) => {
  if (!end) return "-";
  const t = new Date(end).getTime();
  if (isNaN(t)) return "-";
  const diff = t - Date.now();
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${d} Hari (Sisa Waktu)`;
};
const fmtDateTime = (v) =>
  v ? new Date(v).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" }) : "-";
const fmtDate = (v) =>
  v ? new Date(v).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-";
const diffDays = (start, end) => {
  if (!start || !end) return null;
  const ms = new Date(end) - new Date(start);
  if (isNaN(ms)) return null;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

/* ===== Map status OPTI -> badge ===== */
const getOptiStatusBadge = (stat) => {
  switch (stat) {
    case "Follow Up":
      return { text: "Follow Up", cls: "bg-blue-500 text-white" };
    case "On-Progress":
      return { text: "On-Progress", cls: "bg-yellow-500 text-black" };
    case "Success":
      return { text: "Success", cls: "bg-emerald-600 text-white" };
    case "Failed":
      return { text: "Failed", cls: "bg-red-600 text-white" };
    case "Just Get Info":
      return { text: "Just Get Info", cls: "bg-gray-400 text-white" };
    default:
      return null;
  }
};

/* ===== Inline Icons (ringan) ===== */
const IconCalendar = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>
  </svg>
);
const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
  </svg>
);
const IconUsers = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconMap = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M9 18l6-3 6 3V6l-6-3-6 3-6-3v12l6 3zM9 18V6M15 15V3"/>
  </svg>
);

/* ===== Simple Modal ===== */
const Modal = ({ open, onClose, title, badge, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-start md:items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_.15s_ease]">
          <div className="px-6 py-4 border-b flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-xs text-gray-500">Detail jadwal training</p>
            </div>
            {badge ? (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}`}>{badge.text}</span>
            ) : null}
          </div>
          <div className="p-6">{children}</div>
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end gap-3">
            {footer}
            <button onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-gray-100">
              Tutup
            </button>
          </div>
        </div>
      </div>
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

  // detail modal state
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErr, setDetailErr] = useState("");

  // Fetch list (now includes statOpti)
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
        const res = await fetch(`${API_BASE}/api/training/mine`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${user.token}` },
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
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
    })();
    return () => controller.abort();
  }, [user?.token]);

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
        headers: { Accept: "application/json", Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
      const data = await res.json();
      setDetail(data);
    } catch (e) {
      console.error(e);
      setDetailErr("Gagal memuat detail.");
    } finally {
      setDetailLoading(false);
    }
  };

  if (!user?.token) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Training Page</h1>
        <p className="text-gray-600">Silakan login sebagai <b>Expert</b> untuk melihat jadwal training Anda.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Topbar: Title + Search */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Training Page</h1>
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

      {/* Action button */}
      <button
        type="button"
        className="mb-4 inline-flex items-center rounded-md bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black"
        onClick={() => alert("Tambah Training (manual)")}
      >
        Tambah Training
      </button>

      {/* List */}
      <div className="rounded-2xl border border-gray-300 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50 text-lg font-semibold">
          Jadwal Training
        </div>

        <div className="p-5 space-y-5">
          {loading && <div className="text-center text-gray-500 py-10">Memuat data…</div>}
          {!loading && err && <div className="text-center text-red-600 py-10">{err}</div>}

          {!loading && !err && filtered.map((t, idx) => {
            // <- status mengikuti OPTI jika ada; kalau tidak, fallback ke date-based
            const badge = getOptiStatusBadge(t.statOpti) || getBadge(t.startTraining, t.endTraining);
            return (
              <div
                key={t.idTraining || idx}
                className={`rounded-xl border p-4 ${idx % 2 === 1 ? "border-blue-300" : "border-gray-300"}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xl font-semibold">{t.nmTraining || "-"}</div>
                    <div className="text-xs text-gray-500">{t.corpCustomer || "by sales kayaknya"}</div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold ${badge.cls}`}>
                    {badge.text}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <IconCalendar />
                    <span>{fmtDate(t.endTraining)} <span className="text-gray-500">(deadline)</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconClock />
                    <span>{countdown(t.endTraining)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconUsers />
                    <span>{t.registered ?? 25} Orang (Peserta Training)</span>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    className="w-full border rounded-md py-2 text-sm hover:bg-gray-50"
                    onClick={() => openDetail(t.idTraining)}
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            );
          })}

          {!loading && !err && filtered.length === 0 && (
            <div className="text-center text-gray-500 py-10">Belum ada training.</div>
          )}
        </div>
      </div>

      {/* ===== Modal Detail ===== */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={detail?.nmTraining || "Training"}
        badge={getOptiStatusBadge(detail?.statOpti) || getBadge(detail?.startTraining, detail?.endTraining)}
        footer={
          <>
            <button className="px-4 py-2 rounded-md border hover:bg-gray-100" onClick={() => alert("Mulai Training")}>
              Mulai Training
            </button>
            <button className="px-4 py-2 rounded-md border hover:bg-gray-100" onClick={() => alert("Tutup Pendaftaran")}>
              Tutup Pendaftaran
            </button>
            <button className="px-4 py-2 rounded-md border hover:bg-gray-100" onClick={() => window.print()}>
              Export PDF
            </button>
          </>
        }
      >
        {detailLoading && <div className="text-center text-gray-500 py-6">Memuat detail…</div>}
        {!detailLoading && detailErr && <div className="text-center text-red-600 py-6">{detailErr}</div>}

        {!detailLoading && !detailErr && detail && (
          <div className="space-y-6">
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
                    <b>{diffDays(detail.startTraining, detail.endTraining) ?? "-"} hari</b>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500 mb-2">Catatan</div>
                <div className="text-sm text-gray-700 leading-6">
                  {detail.descTraining || "Belum ada catatan."}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500 mb-2">Dokumen</div>
                {detail.proposalOpti ? (
                  <a
                    href={`${API_BASE}/uploads/proposals/${detail.proposalOpti.split(/[\/]/).pop()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lihat Proposal / Dokumen
                  </a>
                ) : (
                  <div className="text-sm text-gray-700">Belum ada dokumen.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainingPage;
