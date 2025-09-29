// frontend/src/pages/SalesDashboard.js
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import SalesPipelineChart from "../components/SalesPipelineChart";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import OpportunityTypePie from "../components/OpportunityTypePie";
import TopDealsTable from "../components/TopDealsTable";
import { FaExpand, FaCompressAlt } from "react-icons/fa";
import NotificationBell from "../components/NotificationBell";
// Base URL dari .env agar fleksibel (fallback ke 3000)
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.__API_BASE__) ||
  "http://localhost:3000";

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
       <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-full">
      {/* ===== Header (judul + notifikasi + user chip) ===== */}
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>

        <div className="flex items-center gap-4 mt-4 md:mt-0"> {/* Container untuk Lonceng + Chip */}
          
          {/* Lonceng Notifikasi */}
          {user && <NotificationBell />}

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
          </div>
        </div>
      </header>

      <main className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <SalesPipelineChart data={dashboardData.pipelineStats} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:col-span-2">
            <div
              className={`relative transition-all duration-1000 ease-in-out ${ isMonthlyPerformanceExpanded ? "w-full" : "w-full lg:w-1/2"}`}
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
              className={`relative transition-all duration-1000 ease-in-out ${ isMonthlyPerformanceExpanded ? "hidden" : "w-full lg:w-1/2 opacity-100"}`}
            >
              <OpportunityTypePie data={dashboardData.opportunityTypes} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <TopDealsTable data={dashboardData.topWonDeals} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesDashboard;