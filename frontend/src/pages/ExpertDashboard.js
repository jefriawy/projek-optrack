import React, { useEffect, useState, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, Title, PointElement, LineElement, Filler
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import barGraphIcon from '../iconres/bar-graph.png';
import pieChartIcon from '../iconres/pie-chart.png';

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale, 
  BarElement, Title, ChartDataLabels, PointElement, LineElement, Filler
);

const getStatusColor = (status) => {
  // Fungsi ini digunakan untuk memberikan warna pada chart
  switch (status) {
    case "Follow Up": return "rgba(54, 162, 235, 0.8)"; // Blue
    case "On-Progress": return "rgba(255, 206, 86, 0.8)"; // Yellow
    case "Success": return "rgba(75, 192, 192, 0.8)"; // Green
    case "Failed": return "rgba(255, 99, 132, 0.8)"; // Red
    case "Just Get Info": return "rgba(255, 159, 64, 0.8)"; // Orange
    default: return "rgba(150, 150, 150, 0.8)"; // Gray
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

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ExpertDashboard = () => {
  const { user } = useContext(AuthContext);
  const [totals, setTotals] = useState({ training: 0, project: 0, outsource: 0 });
  const [allActivities, setAllActivities] = useState([]);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('Training');
  const [showPieChart, setShowPieChart] = useState(false);

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
      .filter(act => act.type === 'Training' && act.trainingType)
      .reduce((acc, act) => {
        acc[act.trainingType] = (acc[act.trainingType] || 0) + 1;
        return acc;
      }, {});
  }, [allActivities]);

  const activeCustomers = useMemo(() => {
    const counts = allActivities
      .filter(act => act.customerName)
      .reduce((acc, act) => {
        acc[act.customerName] = (acc[act.customerName] || 0) + 1;
        return acc;
      }, {});
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [allActivities]);

  const monthlyActivityData = useMemo(() => {
    const counts = {};
    allActivities.forEach(act => {
      if (act.startDate) {
        const month = new Date(act.startDate).toISOString().slice(0, 7); // Format "YYYY-MM"
        counts[month] = (counts[month] || 0) + 1;
      }
    });

    const labels = [];
    const data = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = d.toISOString().slice(0, 7);
      labels.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
      data.push(counts[monthKey] || 0);
    }
    
    return { labels, data };
  }, [allActivities]);

  const chartLabels = Object.keys(statusCounts);
  const chartDataValues = Object.values(statusCounts);
  const chartBackgroundColors = chartLabels.map(label => getStatusColor(label));

  const mainChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Total Aktivitas per Status',
      data: chartDataValues,
      backgroundColor: chartBackgroundColors,
    }],
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Total Aktivitas: ${allActivities.length}` },
    },
    scales: { y: { ticks: { stepSize: 1, beginAtZero: true } } }
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Total Aktivitas: ${allActivities.length}` },
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${percentage}%`;
        },
      },
    },
  };

  const trainingTypeData = {
    labels: Object.keys(trainingTypeDistribution),
    datasets: [{
      data: Object.values(trainingTypeDistribution),
      backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623', '#BD10E0', '#E01034', '#10E0BE'],
    }],
  };

  const activeCustomerData = {
    labels: activeCustomers.map(c => c[0]),
    datasets: [{
      label: 'Jumlah Aktivitas',
      data: activeCustomers.map(c => c[1]),
      backgroundColor: '#34D399',
    }],
  };
  
  const timeAnalysisData = {
    labels: monthlyActivityData.labels,
    datasets: [{
      label: 'Aktivitas Dimulai',
      data: monthlyActivityData.data,
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.3,
    }],
  };

  const timeAnalysisOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { stepSize: 1, beginAtZero: true } } }
  };

  const onProgressActivities = useMemo(() => {
    return allActivities.filter(activity => 
      activity.type === viewType && activity.status === 'On-Progress'
    );
  }, [allActivities, viewType]);

  return (
    <div className="space-y-6">
      {/* Header + Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-lg sm:text-xl font-bold">My Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full sm:w-auto">
          <div className="border p-4 rounded-lg text-center bg-white shadow">
            <p className="font-medium text-sm sm:text-base">Total Training</p>
            <p className="text-xl sm:text-2xl font-bold">{totals.training}</p>
          </div>
          <div className="border p-4 rounded-lg text-center bg-white shadow">
            <p className="font-medium text-sm sm:text-base">Total Project</p>
            <p className="text-xl sm:text-2xl font-bold">{totals.project}</p>
          </div>
          <div className="border p-4 rounded-lg text-center bg-white shadow">
            <p className="font-medium text-sm sm:text-base">Total Outsource</p>
            <p className="text-xl sm:text-2xl font-bold">{totals.outsource}</p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</p>}

      {/* Chart Interaktif */}
      <div className="bg-white p-6 rounded-lg shadow-md relative h-[450px]">
        <div
          className="absolute top-4 right-4 flex items-center w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out z-10"
          onClick={() => setShowPieChart(!showPieChart)}
          style={{ backgroundColor: '#E5E7EB' }}
        >
          <div
            className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out bg-white ${showPieChart ? 'transform translate-x-10' : ''}`}
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
              <h2 className="text-lg font-semibold mb-2">Distribusi Status (Pie Chart)</h2>
              <div className="flex-grow"><Pie data={mainChartData} options={pieChartOptions} /></div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-2">Jumlah per Status (Bar Chart)</h2>
              <div className="flex-grow"><Bar data={mainChartData} options={barChartOptions} /></div>
            </>
          )}
        </div>
      </div>
      
      {/* Daftar Aktivitas On-Progress dengan Dropdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">Aktivitas Berlangsung (On-Progress)</h2>
          <select 
            value={viewType} 
            onChange={e => setViewType(e.target.value)}
            className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Training">Training</option>
            <option value="Project">Project</option>
            <option value="Outsource">Outsource</option>
          </select>
        </div>
        {viewType === 'Outsource' ? (
          <p className="text-center text-gray-500 py-4">Tampilan untuk Outsource belum tersedia.</p>
        ) : onProgressActivities.length > 0 ? (
          <div className="space-y-4">
            {onProgressActivities.map((activity) => {
              const cardColor = activity.type === 'Training' 
                ? "border-yellow-200 bg-yellow-50" 
                : "border-blue-200 bg-blue-50";
              const textColor = activity.type === 'Training' 
                ? "text-yellow-800"
                : "text-blue-800";
              return (
                <div key={activity.id} className={`border ${cardColor} p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center`}>
                  <div>
                    <p className="font-bold text-gray-800">{activity.name}</p>
                    <p className="text-sm text-gray-600">Customer: <span className="font-medium">{activity.customerName || 'N/A'}</span></p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-left sm:text-right">
                    <p className={`text-sm font-semibold ${textColor}`}>Deadline</p>
                    <p className="text-sm text-gray-700">{getDeadlineCountdown(activity.endDate)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Tidak ada {viewType} yang sedang berlangsung saat ini.</p>
        )}
      </div>

      {/* Analisis Kategori & Distribusi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Distribusi Tipe Training Anda</h2>
          {Object.keys(trainingTypeDistribution).length > 0 ? (
            <div className="h-80 flex items-center justify-center">
              <Pie data={trainingTypeData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }} />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Tidak ada data tipe training.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Customer Paling Aktif Anda (Top 5)</h2>
          {activeCustomers.length > 0 ? (
            <div className="h-80">
              <Bar 
                data={activeCustomerData} 
                options={{ 
                  indexAxis: 'y',
                  maintainAspectRatio: false, 
                  plugins: { legend: { display: false } },
                  scales: { x: { ticks: { stepSize: 1, beginAtZero: true } } }
                }} 
              />
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Tidak ada data customer.</p>
          )}
        </div>
      </div>

      {/* Analisis Berbasis Waktu */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Tren Aktivitas Anda (12 Bulan Terakhir)</h2>
        <div className="h-80">
          <Line data={timeAnalysisData} options={timeAnalysisOptions} />
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;