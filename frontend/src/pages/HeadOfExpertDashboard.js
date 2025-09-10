// frontend/src/pages/HeadOfExpertDashboard.js
import React, { useEffect, useState, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Chart.js Registration
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartDataLabels,
  PointElement,
  LineElement,
  Filler
);

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Helper Functions
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

const HeadOfExpertDashboard = () => {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activityFilter, setActivityFilter] = useState('Semua'); // State for the filter

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      try {
        setError(null);
        const response = await axios.get(`${API_BASE}/api/expert/head-dashboard`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Gagal memuat data dashboard.");
      }
    };
    fetchData();
  }, [user]);

  // Memoized Data Processing
  const monthlyActivityTrend = useMemo(() => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const data = new Array(12).fill(0);
    if (dashboardData?.monthlyActivityTrend) {
      dashboardData.monthlyActivityTrend.forEach(item => {
        const monthIndex = parseInt(item.month.split('-')[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          data[monthIndex] = item.count;
        }
      });
    }
    return { labels, data };
  }, [dashboardData]);

  const skillDistribution = useMemo(() => {
    if (!dashboardData?.skillDistribution) return null;
    const labels = dashboardData.skillDistribution.map(d => d.skill);
    const data = dashboardData.skillDistribution.map(d => d.count);
    return { labels, data };
  }, [dashboardData]);

  const topPerformingExperts = useMemo(() => {
    if (!dashboardData?.topExperts) return null;
    const labels = dashboardData.topExperts.map(e => e.expertName);
    const data = dashboardData.topExperts.map(e => e.finishedCount);
    return { labels, data };
  }, [dashboardData]);

  const activityBreakdownData = useMemo(() => {
    const activities = dashboardData?.activities;
    if (!activities || activities.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Determine the data source based on the filter
    const sourceActivities = activityFilter === 'Semua'
      ? activities
      : activities.filter(act => act.type === activityFilter);

    const statuses = ['Finished', 'On Progress', 'Pending'];
    const statusColors = {
      Finished: 'rgba(75, 192, 192, 0.6)',
      'On Progress': 'rgba(255, 206, 86, 0.6)',
      Pending: 'rgba(255, 159, 64, 0.6)',
    };

    // Aggregate counts by status from the source data
    const countsByStatus = { Finished: 0, 'On Progress': 0, Pending: 0 };
    for (const activity of sourceActivities) {
      if (statuses.includes(activity.status)) {
        countsByStatus[activity.status]++;
      }
    }

    return {
      labels: statuses,
      datasets: [{
        label: `Aktivitas (${activityFilter})`,
        data: statuses.map(status => countsByStatus[status]),
        backgroundColor: statuses.map(status => statusColors[status]),
      }]
    };

  }, [dashboardData, activityFilter]);


  // Chart Data and Options
  const monthlyTrendData = {
    labels: monthlyActivityTrend.labels,
    datasets: [
      {
        label: "Aktivitas Bulanan",
        data: monthlyActivityTrend.data,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
      },
    ],
  };

  const monthlyTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  const skillDistributionData = {
    labels: skillDistribution?.labels || [],
    datasets: [
      {
        data: skillDistribution?.data || [],
        backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623", "#BD10E0", "#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#4A90E2", "#50E3C2", "#F5A623", "#BD10E0", "#FF6384", "#36A2EB"],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${pct}%`;
        },
      },
    },
  };

  const topExpertsData = {
    labels: topPerformingExperts?.labels || [],
    datasets: [
      {
        label: "Aktivitas Selesai",
        data: topPerformingExperts?.data || [],
        backgroundColor: "#34D399",
      },
    ],
  };

  const horizontalBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { ticks: { stepSize: 1, beginAtZero: true } } },
  };

  const activityBreakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };
  
  const availableYears = [
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
  ];

  const filterButtons = ['Semua', 'Project', 'Training', 'Outsource'];

  if (error) {
    return <div className="p-6 text-red-600 bg-red-100 rounded-lg">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className="p-6 text-gray-600">Memuat data dashboard...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-full space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Head of Expert Dashboard
        </h1>
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
          <div>
            <div className="text-sm font-bold">{getDisplayName(user)}</div>
            <div className="text-xs text-gray-500">Logged in • {user?.role || "User"}</div>
          </div>
        </div>
      </header>

      {/* Section 1: Full-Width Card for Monthly Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Monthly Activity Trend</h2>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled // Disabling until backend supports year filtering
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="h-80">
          <Line data={monthlyTrendData} options={monthlyTrendOptions} />
        </div>
      </div>

      {/* Section 2: Multi-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill Distribution */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Skill Distribution</h2>
          <div className="h-80">
            {skillDistribution ? (
              <Doughnut data={skillDistributionData} options={doughnutOptions} />
            ) : (
              <p className="text-center text-gray-500">No skill data</p>
            )}
          </div>
        </div>
            
        {/* Top Performing Experts */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Top Performing Experts</h2>
          <div className="h-80">
            {topPerformingExperts ? (
              <Bar data={topExpertsData} options={horizontalBarOptions} />
            ) : (
              <p className="text-center text-gray-500">No expert data</p>
            )}
          </div>
        </div>
        
        {/* Total Activities Breakdown (Standard Bar Chart) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-lg font-semibold mb-2 sm:mb-0">Total Activities Breakdown</h2>
              <div className="flex items-center bg-gray-200 rounded-full p-1">
                {filterButtons.map(filter => (
                  <button 
                    key={filter}
                    onClick={() => setActivityFilter(filter)}
                    className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${activityFilter === filter ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'}`}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-80">
                {activityBreakdownData.datasets.length > 0 && activityBreakdownData.datasets[0].data.some(d => d > 0) ? (
                    <Bar 
                      data={activityBreakdownData} 
                      options={activityBreakdownOptions} 
                    />
                ) : (
                    <p className="text-center text-gray-500 py-4">
                        No activity breakdown data available for this filter.
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HeadOfExpertDashboard;
