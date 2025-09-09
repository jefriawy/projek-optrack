// frontend/src/pages/ExpertDashboard.js
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
import { Pie, Bar, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import barGraphIcon from "../iconres/bar-graph.png";
import pieChartIcon from "../iconres/pie-chart.png";

/* ===== Chart.js register ===== */
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

/* ===== Base URL (data & avatar) ===== */
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

/* ===== Helpers (status color, countdown) ===== */
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "rgba(255, 159, 64, 0.8)";
    case "On Progress":
      return "rgba(255, 206, 86, 0.8)";
    case "Finished":
      return "rgba(75, 192, 192, 0.8)";
    case "Follow Up":
      return "rgba(54, 162, 235, 0.8)";
    case "Success":
      return "rgba(75, 192, 192, 0.8)";
    case "Failed":
      return "rgba(255, 99, 132, 0.8)";
    case "Just Get Info":
      return "rgba(255, 159, 64, 0.8)";
    default:
      return "rgba(150, 150, 150, 0.8)";
  }
};

const getDeadlineCountdown = (endDate) => {
  if (!endDate) return "Tidak ada deadline";
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return "Telah berakhir";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days} hari lagi`;
  if (hours > 0) return `${hours} jam lagi`;
  return "Kurang dari 1 jam";
};

/* ===== User chip helpers ===== */
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

const ExpertDashboard = () => {
  const { user } = useContext(AuthContext);

  const [totals, setTotals] = useState({
    training: 0,
    project: 0,
    outsource: 0,
  });
  const [allActivities, setAllActivities] = useState([]);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("Training");
  const [showPieChart, setShowPieChart] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) return;
      try {
        setError(null);
        const response = await axios.get(`${API_BASE}/api/expert/my-dashboard`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTotals(response.data.totals);
        setAllActivities(response.data.activities);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Gagal memuat data dashboard.");
      }
    };
    fetchData();
  }, [user]);

  const hasTrainings = useMemo(
    () => allActivities.some((act) => act.type === "Training"),
    [allActivities]
  );
  const hasProjects = useMemo(
    () => allActivities.some((act) => act.type === "Project"),
    [allActivities]
  );

  const statusCounts = useMemo(() => {
    if (!allActivities || allActivities.length === 0) return {};
    return allActivities.reduce((acc, activity) => {
      const status = activity.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [allActivities]);

  const trainingTypeDistribution = useMemo(() => {
    return allActivities
      .filter((act) => act.type === "Training" && act.activitySubType)
      .reduce((acc, act) => {
        acc[act.activitySubType] = (acc[act.activitySubType] || 0) + 1;
        return acc;
      }, {});
  }, [allActivities]);

  const projectTypeDistribution = useMemo(() => {
    return allActivities
      .filter((act) => act.type === "Project" && act.activitySubType)
      .reduce((acc, act) => {
        acc[act.activitySubType] = (acc[act.activitySubType] || 0) + 1;
        return acc;
      }, {});
  }, [allActivities]);

  const activeCustomers = useMemo(() => {
    const counts = allActivities
      .filter((act) => act.customerName)
      .reduce((acc, act) => {
        acc[act.customerName] = (acc[act.customerName] || 0) + 1;
        return acc;
      }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [allActivities]);

  const monthlyActivityData = useMemo(() => {
    const filteredActivities = allActivities.filter((act) => {
      if (!act.startDate) return false;
      return new Date(act.startDate).getFullYear() === selectedYear;
    });
    const counts = filteredActivities.reduce((acc, act) => {
      const monthIndex = new Date(act.startDate).getMonth();
      acc[monthIndex] = (acc[monthIndex] || 0) + 1;
      return acc;
    }, {});
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const data = labels.map((_, index) => counts[index] || 0);
    return { labels, data };
  }, [allActivities, selectedYear]);

  const gridColumnsClass = useMemo(() => {
    const hasTrainingData =
      hasTrainings && Object.keys(trainingTypeDistribution).length > 0;
    const hasProjectData =
      hasProjects && Object.keys(projectTypeDistribution).length > 0;

    if (hasTrainingData && hasProjectData) return "lg:grid-cols-3";
    if (hasTrainingData || hasProjectData) return "lg:grid-cols-2";
    return "lg:grid-cols-1";
  }, [hasTrainings, hasProjects, trainingTypeDistribution, projectTypeDistribution]);

  const availableYears = [
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
  ];

  /* ===== Charts data/options ===== */
  const chartLabels = Object.keys(statusCounts);
  const chartDataValues = Object.values(statusCounts);
  const chartBackgroundColors = chartLabels.map((label) => getStatusColor(label));

  const mainChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Aktivitas per Status",
        data: chartDataValues,
        backgroundColor: chartBackgroundColors,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Total Aktivitas: ${allActivities.length}` },
    },
    scales: { y: { ticks: { stepSize: 1, beginAtZero: true } } },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `Total Aktivitas: ${allActivities.length}` },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${pct}%`;
        },
      },
    },
  };

  const trainingTypeData = {
    labels: Object.keys(trainingTypeDistribution),
    datasets: [
      {
        data: Object.values(trainingTypeDistribution),
        backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623", "#BD10E0"],
      },
    ],
  };

  const projectTypeData = {
    labels: Object.keys(projectTypeDistribution),
    datasets: [
      {
        data: Object.values(projectTypeDistribution),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const activeCustomerData = {
    labels: activeCustomers.map((c) => c[0]),
    datasets: [
      {
        label: "Jumlah Aktivitas",
        data: activeCustomers.map((c) => c[1]),
        backgroundColor: "#34D399",
      },
    ],
  };

  const timeAnalysisData = {
    labels: monthlyActivityData.labels,
    datasets: [
      {
        label: "Aktivitas Dimulai",
        data: monthlyActivityData.data,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
      },
    ],
  };

  const timeAnalysisOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  const ongoingActivities = useMemo(() => {
    return allActivities.filter(
      (activity) =>
        activity.type === viewType &&
        ["Pending", "On Progress"].includes(activity.status)
    );
  }, [allActivities, viewType]);

  return (
    <div className="p-6 bg-gray-100 min-h-full space-y-6">
      {/* ===== Header: samakan gaya dengan halaman lain ===== */}
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Expert Dashboard
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
          <div className="leading-5">
            <div className="text-sm font-bold">{getDisplayName(user)}</div>
            <div className="text-xs text-gray-500">
              Logged in • {user?.role || "User"}
            </div>
          </div>
        </div>
      </header>

      
      {error && (
        <p className="text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>
      )}

      {/* ===== Switch Bar/Pie ===== */}
      <div className="bg-white p-6 rounded-lg shadow-md relative h-[450px]">
        <div
          className="absolute top-4 right-4 flex items-center w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out z-10"
          onClick={() => setShowPieChart(!showPieChart)}
          style={{ backgroundColor: "#E5E7EB" }}
          title={showPieChart ? "Tampilkan Bar" : "Tampilkan Pie"}
        >
          <div
            className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out bg-white ${
              showPieChart ? "transform translate-x-10" : ""
            }`}
          >
            {showPieChart ? (
              <img src={pieChartIcon} alt="Pie Chart" className="w-5 h-5" />
            ) : (
              <img src={barGraphIcon} alt="Bar Chart" className="w-5 h-5" />
            )}
          </div>
        </div>

        <div className="w-full h-full flex flex-col">
          {showPieChart ? (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Distribusi Status (Pie Chart)
              </h2>
              <div className="flex-grow">
                <Pie data={mainChartData} options={pieChartOptions} />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Jumlah per Status (Bar Chart)
              </h2>
              <div className="flex-grow">
                <Bar data={mainChartData} options={barChartOptions} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===== Ongoing ===== */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">
            Aktivitas Berlangsung (Pending & On-Progress)
          </h2>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Training">Training</option>
            <option value="Project">Project</option>
            <option value="Outsource">Outsource</option>
          </select>
        </div>

        {viewType === "Outsource" ? (
          <p className="text-center text-gray-500 py-4">
            Tampilan untuk Outsource belum tersedia.
          </p>
        ) : ongoingActivities.length > 0 ? (
          <div className="space-y-4">
            {ongoingActivities.map((activity) => {
              const cardColor =
                activity.status === "Pending"
                  ? "border-orange-200 bg-orange-50"
                  : "border-yellow-200 bg-yellow-50";
              const textColor =
                activity.status === "Pending"
                  ? "text-orange-800"
                  : "text-yellow-800";
              return (
                <div
                  key={activity.id}
                  className={`border ${cardColor} p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center`}
                >
                  <div>
                    <p className="font-bold text-gray-800">{activity.name}</p>
                    <p className="text-sm text-gray-600">
                      Customer:{" "}
                      <span className="font-medium">
                        {activity.customerName || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-left sm:text-right">
                    <p className={`text-sm font-semibold ${textColor}`}>
                      {activity.status}
                    </p>
                    <p className="text-sm text-gray-700">
                      {getDeadlineCountdown(activity.endDate)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Tidak ada {viewType} yang berstatus Pending atau On Progress.
          </p>
        )}
      </div>

      {/* ===== 3 kartu ringkas ===== */}
      <div className={`grid grid-cols-1 ${gridColumnsClass} gap-6`}>
        {hasTrainings && Object.keys(trainingTypeDistribution).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Distribusi Tipe Training
            </h2>
            <div className="h-80 flex items-center justify-center">
              <Pie
                data={trainingTypeData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>
        )}
        {hasProjects && Object.keys(projectTypeDistribution).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Distribusi Tipe Project
            </h2>
            <div className="h-80 flex items-center justify-center">
              <Pie
                data={projectTypeData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "top" } },
                }}
              />
            </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Customer Paling Aktif</h2>
          {activeCustomers.length > 0 ? (
            <div className="h-80">
              <Bar
                data={activeCustomerData}
                options={{
                  indexAxis: "y",
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { x: { ticks: { stepSize: 1, beginAtZero: true } } },
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Tidak ada data customer.
            </p>
          )}
        </div>
      </div>

      {/* ===== Tren waktu ===== */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tren Aktivitas Anda</h2>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="h-80">
          <Line data={timeAnalysisData} options={timeAnalysisOptions} />
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
