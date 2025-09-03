import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

import HeadOfSalesDashboard from "./HeadOfSalesDashboard";
import SalesPipelineChart from "../components/SalesPipelineChart";
import MonthlyPerformanceChart from "../components/MonthlyPerformanceChart";
import OpportunityTypePie from "../components/OpportunityTypePie";
import TopDealsTable from "../components/TopDealsTable";
import { FaExpand, FaCompressAlt } from "react-icons/fa";

const SalesDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [isMonthlyPerformanceExpanded, setIsMonthlyPerformanceExpanded] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // BACKEND kamu mount opti dashboard di /api/opti/dashboard (port 5000)
        const response = await axios.get(
          "http://localhost:5000/api/opti/dashboard",
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      }
    };
    if (user?.token) fetchData();
  }, [user]);

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
              isMonthlyPerformanceExpanded
                ? "hidden"
                : "w-full lg:w-1/2 opacity-100"
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

const HomePage = () => {
  const { user } = useContext(AuthContext);

  // FIX: role yang benar adalah "Head Sales" (bukan "Head of Sales")
  if (user?.role === "Head Sales") {
    return <HeadOfSalesDashboard />;
  }

  if (user?.role === "Sales") {
    return <SalesDashboard />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Welcome to the Home Page!
      </h1>
      <p className="text-gray-600 mt-4 text-base sm:text-lg">
        This is a blank home page. You can add your content here.
      </p>
    </div>
  );
};

export default HomePage;
