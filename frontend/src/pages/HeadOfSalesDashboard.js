// frontend/src/pages/HeadOfSalesDashboard.js
import React, { useEffect, useState, useContext, useCallback } from "react";
import SalesRepCustomerChart from "../components/SalesRepCustomerChart";
import SalesPipelineChart from "../components/SalesPipelineChart";
import OpportunityTypePie from "../components/OpportunityTypePie";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import TopDealsTable from "../components/TopDealsTable";
import { AuthContext } from "../context/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.__API_BASE__) ||
  "http://localhost:3000";

/* Icons (inline, boleh diganti asset PNG/SVG kamu) */
const Icon = {
  Refresh: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8M21 12a9 9 0 0 1-15.36 6.36L3 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  Expand: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path d="M4 9V4h5M20 15v5h-5M15 4h5v5M4 15v5h5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  Close: (props) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  Bar: () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path d="M4 20V10M10 20V4M16 20v-6M2 20h20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
  Pie: () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path d="M11 3a9 9 0 1 0 9 9h-9V3z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M21 12A9 9 0 0 0 12 3v9h9z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
};

/* Overlay expand */
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
  const [lastUpdated, setLastUpdated] = useState(null);

  // Tabs minimal
  const [tab, setTab] = useState("status"); // customers | status | performance
  // Switch di tab Status: bar (pipeline) vs pie (opportunity type)
  const [statusVis, setStatusVis] = useState("bar");
  const [expanded, setExpanded] = useState(null);

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
          throw new Error(`${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`);
        }
        const data = await res.json();
        setDashboardData(data);
        setLastUpdated(new Date());
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

  const handleRefresh = () => {
    const ac = new AbortController();
    fetchData(ac.signal);
  };

  if (loading) return <div className="p-6 text-gray-600">Memuat dashboard...</div>;
  if (err) return <div className="p-6 text-red-600">Gagal memuat: {err}</div>;
  if (!dashboardData) return <div className="p-6 text-gray-600">Data tidak ditemukan.</div>;

  const {
    salesRepCustomers = [],
    pipelineStats = [],
    opportunityTypes = [],
    performanceOverTime = [],
    topOpenDeals = [],
  } = dashboardData || {};

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Head of Sales Dashboard
          </h1>
          <div className="text-xs text-gray-500 mt-1">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString("id-ID")}` : "—"}
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 active:scale-[.98] transition"
        >
          <Icon.Refresh /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {[
            { key: "customers", label: "Customers" },
            { key: "status", label: "Project" },
            { key: "performance", label: "Performance" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === t.key ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel chart utama */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 h-[440px] relative">
        {/* Switch ala knob khusus tab "Status" */}
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

        <div key={`${tab}-${statusVis}`} className="w-full h-full animate-[fadeSlide_.25s_ease]">
          {tab === "customers" && <SalesRepCustomerChart data={salesRepCustomers} />}
          {tab === "status" &&
            (statusVis === "bar" ? (
              <SalesPipelineChart data={pipelineStats} />
            ) : (
              <OpportunityTypePie data={opportunityTypes} />
            ))}
          {tab === "performance" && <MonthlyPerformanceChart data={performanceOverTime} />}
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

      {/* Top 5 Deals (bawah, full width) */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-5 mt-6">
        <h2 className="font-semibold text-gray-800 mb-3">Top 5 Open Deals</h2>
        <TopDealsTable data={topOpenDeals} />
      </div>

      {/* Overlay expand */}
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
          {expanded === "customers" && <SalesRepCustomerChart data={salesRepCustomers} />}
          {expanded === "status" &&
            (statusVis === "bar" ? (
              <SalesPipelineChart data={pipelineStats} />
            ) : (
              <OpportunityTypePie data={opportunityTypes} />
            ))}
          {expanded === "performance" && <MonthlyPerformanceChart data={performanceOverTime} />}
        </ExpandOverlay>
      )}

      {/* Animasi CSS */}
      <style>{`
        @keyframes fadeIn { from {opacity:.001} to {opacity:1} }
        .animate-[fadeIn_.16s_ease]{ animation: fadeIn .16s ease both; }
        @keyframes fadeSlide { 0% { opacity:.001; transform: translateY(8px) } 100% { opacity:1; transform: translateY(0) } }
        .animate-[fadeSlide_.25s_ease]{ animation: fadeSlide .25s ease both; }
      `}</style>
    </div>
  );
};

export default HeadOfSalesDashboard;
