import React, { useContext, useState, useEffect } from "react";
import { FaSearch, FaCalendar, FaClock } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";
import OutsourceDetailTab from "../components/OutsourceDetailTab";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

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

const OutsourcePage = () => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const getStatus = (item) => {
    const now = new Date();
    const start = item.startOutsource ? new Date(item.startOutsource) : null;
    const end = item.endOutsource ? new Date(item.endOutsource) : null;
    if (start && now < start) return "PO Received";
    if (start && end && now >= start && now <= end) return "Outsource On Going";
    if (end && now > end) return "Outsource Delivered";
    return "-";
  };

  const fmtDate = (v) =>
    v
      ? new Date(v).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "-";

  const remainingLabel = (item) => {
    const now = Date.now();
    const end = item.endOutsource ? new Date(item.endOutsource).getTime() : null;
    if (!end) return "-";
    if (now > end) return "Selesai";
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return `${days} hari`;
  };

  // computeStatus returns label and tailwind className similar to ProjectPage/TrainingPage
  const computeStatus = (item) => {
    const now = Date.now();
    const start = item.startOutsource ? new Date(item.startOutsource).getTime() : null;
    const end = item.endOutsource ? new Date(item.endOutsource).getTime() : null;

    if (start && now < start) {
      return { label: "Po Received", className: "bg-amber-500 text-white" };
    }

    if (start && end && now >= start && now <= end) {
      return { label: "Outsource On Going", className: "bg-blue-600 text-white" };
    }

    if (end && now > end) {
      return { label: "Outsource Delivered", className: "bg-green-500 text-white" };
    }

    return { label: "Po Received", className: "bg-amber-500 text-white" };
  };

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    setErr("");
    axios
      .get(`${API_BASE}/api/outsource`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((e) => {
        setErr("Gagal memuat data outsource.");
      })
      .finally(() => setLoading(false));
  }, [user?.token]);

  const filtered = list.filter((item) => {
    const name = (item.nmOutsource || "").toLowerCase();
    const desc = (item.descriptionOutsource || "").toLowerCase();
    return name.includes(query.toLowerCase()) || desc.includes(query.toLowerCase());
  });

  const handleDetailClick = (item) => {
    setDetailData(item);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
    setDetailData(null);
  };

  return (
    <div className="p-6">
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Outsource Page
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
            <span className="absolute right-3 text-gray-400">
              <FaSearch />
            </span>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l">
            {user ? (
              <>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
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
              </>
            ) : null}
          </div>
        </div>
      </header>
      <div className="rounded-2xl border border-gray-300 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b bg-gray-50 text-lg font-semibold">
          Jadwal Outsource
        </div>
        <div className="p-5 space-y-5">
          {loading && (
            <div className="text-center text-gray-500 py-10">Memuat data…</div>
          )}
          {!loading && err && (
            <div className="text-center text-red-600 py-10">{err}</div>
          )}
          {!loading && !err && filtered.map((item, idx) => (
            <div
              key={item.idOutsource || idx}
              className={`rounded-xl border p-4 ${idx % 2 === 1 ? "border-blue-300" : "border-gray-300"}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xl font-semibold">{item.nmOpti || item.nmOutsource || '-'}</div>
                  <div className="text-xs text-gray-500">{item.corpCustomer || '-'}</div>
                  <div className="text-xs text-gray-500">
                    Sales: <span className="text-green-600 font-bold">{item.nmSales || '-'}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Human Resource: <span className="text-purple-600 font-bold">{item.nmHR || '-'}</span>
                  </div>
                </div>
                  {(() => {
                    const s = computeStatus(item);
                    return (
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${s.className}`}>{s.label}</span>
                    );
                  })()}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaCalendar className="text-gray-500" />
                  <span>{fmtDate(item.startOutsource)} – {fmtDate(item.endOutsource)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-gray-500" />
                  <span>{remainingLabel(item)}</span>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm" onClick={() => handleDetailClick(item)}>
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Modal Detail Outsource */}
      {openDetail && (
        <div className="fixed inset-0 z-[999]">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseDetail} />
          <div className="absolute inset-0 flex items-start md:items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_.15s_ease]">
              <div className="px-6 py-4 border-b flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{detailData?.nmOpti || detailData?.nmOutsource || '-'}</h3>
                  <p className="text-xs text-gray-500">{detailData?.corpCustomer || '-'}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">{getStatus(detailData)}</span>
                  <button
                    onClick={handleCloseDetail}
                    className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <OutsourceDetailTab outsource={detailData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutsourcePage;