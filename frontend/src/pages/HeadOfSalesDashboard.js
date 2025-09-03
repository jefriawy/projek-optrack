// frontend/src/pages/HeadOfSalesDashboard.js
import React, { useEffect, useState, useContext } from "react";
import SalesRepCustomerChart from "../components/SalesRepCustomerChart";
import SalesPipelineChart from "../components/SalesPipelineChart";
import OpportunityTypePie from "../components/OpportunityTypePie";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import TopDealsTable from "../components/TopDealsTable";
import { AuthContext } from "../context/AuthContext";

// Pakai ENV agar gampang pindah port/host
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  (typeof window !== "undefined" && window.__API_BASE__) ||
  "http://localhost:3000";

const HeadOfSalesDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // Kalau user belum siap atau belum ada token, jangan fetch dulu
    if (!user?.token) {
      setLoading(false);
      setErr("Tidak ada token autentikasi.");
      return;
    }

    const ac = new AbortController();

    const run = async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_BASE}/api/dashboard/head-of-sales`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          signal: ac.signal,
        });

        // Tangani error HTTP dengan pesan yang jelas
        if (!res.ok) {
          let detail = "";
          try {
            const j = await res.json();
            detail = j?.error || j?.message || "";
          } catch {
            // ignore json parse
          }
          throw new Error(
            `${res.status} ${res.statusText}${detail ? ` — ${detail}` : ""}`
          );
        }

        const data = await res.json();
        setDashboardData(data);
      } catch (e) {
        if (e.name !== "AbortError") {
          setErr(e.message || "Network error");
        }
      } finally {
        setLoading(false);
      }
    };

    run();

    return () => ac.abort();
  }, [user?.token]);

  if (loading) return <div className="p-6 text-gray-600">Loading dashboard…</div>;
  if (err) return <div className="p-6 text-red-600">Gagal memuat: {err}</div>;
  if (!dashboardData)
    return <div className="p-6 text-gray-600">Data tidak ditemukan.</div>;

  const {
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
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        Head of Sales Dashboard
      </h1>

      {noData ? (
        <div className="p-6 bg-white rounded-lg shadow text-gray-600">
          Belum ada data untuk ditampilkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="font-semibold mb-2">Customer per Sales</h2>
              <div className="bg-white p-4 rounded-lg shadow">
                <SalesRepCustomerChart data={salesRepCustomers} />
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Pipeline by Status</h2>
              <SalesPipelineChart data={pipelineStats} />
            </div>

            <div>
              <h2 className="font-semibold mb-2">Opportunity Type</h2>
              <OpportunityTypePie data={opportunityTypes} />
            </div>

            <div>
              <h2 className="font-semibold mb-2">Monthly Performance</h2>
              <MonthlyPerformanceChart data={performanceOverTime} />
            </div>
          </div>

          <div className="xl:col-span-1">
            <TopDealsTable data={topOpenDeals} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadOfSalesDashboard;
