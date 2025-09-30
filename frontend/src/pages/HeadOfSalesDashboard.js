// frontend/src/pages/HeadOfSalesDashboard.js
import React, { useEffect, useState, useContext, useCallback } from "react";
import SalesRepCustomerChart from "../components/SalesRepCustomerChart";
import SalesPipelineChart from "../components/SalesPipelineChart";
import OpportunityTypePie from "../components/OpportunityTypePie";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import TopDealsTable from "../components/TopDealsTable";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "../components/NotificationBell";
import HeadOfSalesDetailModal from "../components/HeadOfSalesDetailModal";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.__API_BASE__) ||
  "http://localhost:3000";

/* ===== Icons (tanpa Refresh) ===== */
const Icon = {
  Expand: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path
        d="M4 9V4h5M20 15v5h-5M15 4h5v5M4 15v5h5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
  Close: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
  Bar: () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path
        d="M4 20V10M10 20V4M16 20v-6M2 20h20"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  ),
  Pie: () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path
        d="M11 3a9 9 0 1 0 9 9h-9V3z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M21 12A9 9 0 0 0 12 3v9h9z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path
        d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11zM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zM16 13c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
        fill="currentColor"
      />
    </svg>
  ),
};

/* ===== User chip helpers (nama & avatar) ===== */
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
  return `${API_BASE}/uploads/avatars/${String(candidate).split(/[\\/]/).pop()}`;
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

/* ===== Overlay expand ===== */
const ExpandOverlay = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-200 animate-[fadeIn_.16s_ease]">
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        >
          <Icon.Close /> Close
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const HeadOfSalesDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Tabs minimal
  const [tab, setTab] = useState("status"); // customers | status | performance
  // Switch di tab Status: bar (pipeline) vs pie (opportunity type)
  const [statusVis, setStatusVis] = useState("bar");
  const [expanded, setExpanded] = useState(null);

  // State for the new sales detail modal
  const [isSalesDetailModalOpen, setIsSalesDetailModalOpen] = useState(false);
  const [selectedSales, setSelectedSales] = useState(null);
  const [salesDetailData, setSalesDetailData] = useState(null);
  const [isSalesDetailLoading, setIsSalesDetailLoading] = useState(false);

  const fetchData = useCallback(
    async (signal) => {
      setErr(null);
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/head-of-sales`, {
          headers: { Authorization: `Bearer ${user?.token || ""}` },
          signal,
        });
        if (!res.ok) {
          let detail = "";
          try {
            const j = await res.json();
            detail = j?.error || j?.message || "";
          } catch {}
          throw new Error(
            `${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`
          );
        }
        const data = await res.json();
        setDashboardData(data);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Network error");
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      setErr("Tidak ada token autentikasi.");
      return;
    }
    const ac = new AbortController();
    fetchData(ac.signal);
    return () => ac.abort();
  }, [user?.token, fetchData]);

  // New useEffect to fetch sales detail data when a sales is selected
  useEffect(() => {
    if (!selectedSales || !user?.token) return;

    const fetchSalesDetail = async () => {
      setIsSalesDetailLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/head-of-sales-detail/${selectedSales.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch sales details');
        }
        const data = await res.json();
        console.log('[Frontend] Received sales detail data from API:', data);
        setSalesDetailData(data);
      } catch (error) {
        console.error("Error fetching sales detail:", error);
        setSalesDetailData(null); // Clear data on error
      } finally {
        setIsSalesDetailLoading(false);
      }
    };

    fetchSalesDetail();
  }, [selectedSales, user?.token]);

  const handleSalesRepClick = (sales) => {
    console.log('[Frontend] Bar clicked. Sales object:', sales);
    setSelectedSales(sales);
    setIsSalesDetailModalOpen(true);
  };

  const handleCloseSalesDetailModal = () => {
    setIsSalesDetailModalOpen(false);
    setSelectedSales(null);
    setSalesDetailData(null);
  };

  if (loading) return <div className="p-6 text-gray-600">Memuat dashboard...</div>;
  if (err) return <div className="p-6 text-red-600">Gagal memuat: {err}</div>;
  if (!dashboardData) return <div className="p-6 text-gray-600">Data tidak ditemukan.</div>;

  const {
    salesRepCustomers = [],
    pipelineStats = [],
    opportunityTypes = [],
    performanceOverTime = [],
    topWonDeals = [],
  } = dashboardData || {};

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-full">
      {/* ===== Header (judul + notifikasi + user chip) ===== */}
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Head of Sales Dashboard</h1>


          {/* User chip */}
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
      </header>

      {/* ===== Panel chart utama (tabs dipindah masuk card) ===== */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 h-[480px] relative">
        {/* Segmented Tabs di dalam card */}
        <div className="absolute top-4 left-4">
          <div className="inline-flex bg-gray-100 rounded-xl border border-gray-200 overflow-hidden">
            {[{"key": "customers", "label": "Customers"}, {"key": "status", "label": "Project"}, // label "Project"
              {"key": "performance", "label": "Performance"},
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium transition ${ 
                  tab === t.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Switch khusus tab "status" (kanan-atas) */}
        {tab === "status" && (
          <div
            className="absolute top-4 right-4 w-[92px] h-10 bg-gray-200 rounded-full p-1 cursor-pointer select-none"
            onClick={() => setStatusVis((v) => (v === "bar" ? "pie" : "bar"))}
            title={statusVis === "bar" ? "Switch to Pie" : "Switch to Bar"}
          >
            <div
              className={`w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transform transition-transform duration-300 ${ 
                statusVis === "pie" ? "translate-x-12" : ""
              }`}
            >
              {statusVis === "pie" ? <Icon.Pie /> : <Icon.Bar />}
            </div>
          </div>
        )}

        {/* Area grafik */}
        <div
          key={`${tab}-${statusVis}`}
          className="w-full h-full pt-10" /* padding top agar tidak ketutup segmented tabs */
        >
          {tab === "customers" && <SalesRepCustomerChart data={salesRepCustomers} onBarClick={handleSalesRepClick} />}
          {tab === "status" &&
            (statusVis === "bar" ? (
              <SalesPipelineChart data={pipelineStats} />
            ) : (
              <OpportunityTypePie data={opportunityTypes} />
            ))}
          {tab === "performance" && (
            <MonthlyPerformanceChart data={performanceOverTime} />
          )}
        </div>

        {/* Expand */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setExpanded(tab)}
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition"
          >
            <Icon.Expand /> Expand
          </button>
        </div>
      </div>

      {/* ===== Top 5 Deals (bawah, full width) ===== */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 mt-6">
        <h2 className="font-semibold text-gray-800 mb-3">Top 5 Open Deals</h2>
        <TopDealsTable data={topWonDeals} />
      </div>

      {/* ===== Overlay expand ===== */}
      {expanded && (
        <ExpandOverlay
          title={
            expanded === "customers"
              ? "Customer per Sales"
              : expanded === "status"
              ? statusVis === "bar"
                ? "Pipeline by Status (Bar)"
                : "Opportunity Types (Pie)"
              : "Monthly Performance"
          }
          onClose={() => setExpanded(null)}
        >
          {expanded === "customers" && <SalesRepCustomerChart data={salesRepCustomers} onBarClick={handleSalesRepClick} />}
          {expanded === "status" &&
            (statusVis === "bar" ? (
              <SalesPipelineChart data={pipelineStats} />
            ) : (
              <OpportunityTypePie data={opportunityTypes} />
            ))}
          {expanded === "performance" && (
            <MonthlyPerformanceChart data={performanceOverTime} />
          )}
        </ExpandOverlay>
      )}

      <HeadOfSalesDetailModal
        isOpen={isSalesDetailModalOpen}
        onClose={handleCloseSalesDetailModal}
        salesData={salesDetailData}
        selectedSales={selectedSales}
        isLoading={isSalesDetailLoading}
      />

      <style>{`
        @keyframes fadeIn { from {opacity:.001} to {opacity:1} }
        .animate-[fadeIn_.16s_ease]{ animation: fadeIn .16s ease both; }
      `}</style>
    </div>
  );
};

export default HeadOfSalesDashboard;
