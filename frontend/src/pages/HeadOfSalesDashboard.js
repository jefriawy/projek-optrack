// frontend/src/pages/HeadOfSalesDashboard.js
import React, { useEffect, useState, useContext, useCallback } from "react";
import SalesRepCustomerChart from "../components/SalesRepCustomerChart";
import SalesPipelineChart from "../components/SalesPipelineChart";
import OpportunityTypePie from "../components/OpportunityTypePie";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import TopDealsTable from "../components/TopDealsTable";
import KpiMini from "../components/KpiMini";
import { AuthContext } from "../context/AuthContext";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.__API_BASE__) ||
  "http://localhost:3000";

/** Kartu chart dengan header & tombol expand */
const ChartCard = ({ title, children, onExpand }) => (
  <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md">
    <div className="flex items-center justify-between px-5 pt-4">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      <button
        onClick={onExpand}
        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        title="Expand"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
          <path
            d="M4 9V4h5M20 15v5h-5M15 4h5v5M4 15v5h5"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Expand
      </button>
    </div>
    <div className="px-5 pb-5">{children}</div>
  </div>
);

/** Overlay untuk tampilan fokus chart */
const ExpandOverlay = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-200 animate-[fadeIn_180ms_ease-out]">
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          title="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Close
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

  // state untuk expand chart
  const [expanded, setExpanded] = useState(null); // "customers" | "pipeline" | "types" | "performance" | "deals" | null

  const fetchData = useCallback(async (signal) => {
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
  }, [user?.token]);

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
    // tidak perlu abort manual karena request singkat, tapi bisa ditambahkan jika mau
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="h-8 w-72 bg-gradient-to-r from-gray-100 to-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-3 gap-4 mb-6 max-w-3xl">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid xl:grid-cols-12 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-80 bg-gray-100 rounded-2xl animate-pulse ${i < 3 ? "xl:col-span-6" : "xl:col-span-6"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (err) return <div className="p-6 text-red-600">Gagal memuat: {err}</div>;
  if (!dashboardData) return <div className="p-6 text-gray-600">Data tidak ditemukan.</div>;

  const {
    kpis = {},
    salesRepCustomers = [],
    pipelineStats = [],
    opportunityTypes = [],
    performanceOverTime = [],
    topOpenDeals = [],
  } = dashboardData || {};

  const noData =
    !salesRepCustomers.length &&
    !pipelineStats.length &&
    !opportunityTypes.length &&
    !performanceOverTime.length &&
    !topOpenDeals.length;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
      {/* Header + Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Head of Sales Dashboard
            </span>
          </h1>
          <div className="text-xs text-gray-500 mt-1">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleString("id-ID")}` : "—"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 active:scale-[.98] transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M3 12a9 9 0 0 1 15.36-6.36L21 8M21 12a9 9 0 0 1-15.36 6.36L3 16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI 3 kotak */}
      <KpiMini
        totalSales={kpis.totalSales}
        totalCustomers={kpis.totalCustomers}
        totalOpti={kpis.totalOpti}
      />

      {noData ? (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 text-gray-600 shadow-sm">
          Belum ada data untuk ditampilkan.
        </div>
      ) : (
        <div className="grid xl:grid-cols-12 gap-6">
          {/* Kolom kiri (8/12) */}
          <div className="xl:col-span-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Customer per Sales" onExpand={() => setExpanded("customers")}>
              <div className="bg-white rounded-xl">
                <SalesRepCustomerChart data={salesRepCustomers} />
              </div>
            </ChartCard>

            <ChartCard title="Pipeline by Status" onExpand={() => setExpanded("pipeline")}>
              <SalesPipelineChart data={pipelineStats} />
            </ChartCard>

            <ChartCard title="Opportunity Type" onExpand={() => setExpanded("types")}>
              <OpportunityTypePie data={opportunityTypes} />
            </ChartCard>

            <ChartCard title="Monthly Performance" onExpand={() => setExpanded("performance")}>
              <MonthlyPerformanceChart data={performanceOverTime} />
            </ChartCard>
          </div>

          {/* Kolom kanan (4/12) */}
          <div className="xl:col-span-4">
            <ChartCard title="Top 5 Open Deals" onExpand={() => setExpanded("deals")}>
              <TopDealsTable data={topOpenDeals} />
            </ChartCard>
          </div>
        </div>
      )}

      {/* Overlay expand */}
      {expanded && (
        <ExpandOverlay title={
          expanded === "customers" ? "Customer per Sales" :
          expanded === "pipeline" ? "Pipeline by Status" :
          expanded === "types" ? "Opportunity Type" :
          expanded === "performance" ? "Monthly Performance" :
          "Top 5 Open Deals"
        } onClose={() => setExpanded(null)}>
          {expanded === "customers" && <SalesRepCustomerChart data={salesRepCustomers} />}
          {expanded === "pipeline" && <SalesPipelineChart data={pipelineStats} />}
          {expanded === "types" && <OpportunityTypePie data={opportunityTypes} />}
          {expanded === "performance" && <MonthlyPerformanceChart data={performanceOverTime} />}
          {expanded === "deals" && <TopDealsTable data={topOpenDeals} />}
        </ExpandOverlay>
      )}
    </div>
  );
};

export default HeadOfSalesDashboard;
