// frontend/src/pages/SalesDashboard.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import SalesPipelineChart from "../components/SalesPipelineChart";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import OpportunityTypePie from "../components/OpportunityTypePie";
import TopDealsTable from "../components/TopDealsTable";
import { FaExpand, FaCompressAlt } from "react-icons/fa";

// Base URL dari .env agar fleksibel (fallback ke 3000)
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.__API_BASE__) ||
  "http://localhost:3000";

const SalesDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [isMonthlyPerformanceExpanded, setIsMonthlyPerformanceExpanded] =
    useState(false);

  useEffect(() => {
    if (!user?.token) return;

    const ac = new AbortController();

    const fetchData = async () => {
      try {
        setError("");
        const res = await fetch(`${API_BASE}/api/opti/dashboard`, {
          headers: { Authorization: `Bearer ${user.token}` },
          signal: ac.signal,
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
      } catch (err) {
        if (err.name !== "AbortError")
          setError(err.message || "Failed to fetch dashboard data.");
      }
    };

    fetchData();
    return () => ac.abort();
  }, [user?.token]);

  const handleExpandToggle = () =>
    setIsMonthlyPerformanceExpanded((prev) => !prev);

  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!dashboardData) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Sales Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <SalesPipelineChart data={dashboardData.pipelineStats} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:col-span-2">
          <div
            className={`relative transition-all duration-1000 ease-in-out ${
              isMonthlyPerformanceExpanded ? "w-full" : "w-full lg:w-1/2"
            }`}
          >
            <MonthlyPerformanceChart data={dashboardData.performanceOverTime} />
            <button
              onClick={handleExpandToggle}
              className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition-colors duration-200"
              title={
                isMonthlyPerformanceExpanded ? "Shrink Chart" : "Expand Chart"
              }
            >
              {isMonthlyPerformanceExpanded ? <FaCompressAlt /> : <FaExpand />}
            </button>
          </div>

          <div
            className={`relative transition-all duration-1000 ease-in-out ${
              isMonthlyPerformanceExpanded ? "hidden" : "w-full lg:w-1/2 opacity-100"
            }`}
          >
            <OpportunityTypePie data={dashboardData.opportunityTypes} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <TopDealsTable data={dashboardData.topOpenDeals} />
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
