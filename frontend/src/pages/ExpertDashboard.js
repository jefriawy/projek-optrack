import React, { useEffect, useState, useMemo, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Mendaftarkan semua elemen Chart.js yang akan kita gunakan
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
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
  const [viewType, setViewType] = useState('Training'); // State baru untuk dropdown

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

  const chartLabels = Object.keys(statusCounts);
  const chartDataValues = Object.values(statusCounts);
  const chartBackgroundColors = chartLabels.map(label => getStatusColor(label));

  const pieChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Jumlah Aktivitas',
      data: chartDataValues,
      backgroundColor: chartBackgroundColors,
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };
  
  const barChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Total Aktivitas per Status',
      data: chartDataValues,
      backgroundColor: chartBackgroundColors,
    }],
  };
  
  // Memo diupdate untuk memfilter berdasarkan viewType dari dropdown
  const onProgressActivities = useMemo(() => {
    return allActivities.filter(activity => 
      activity.type === viewType && activity.status === 'On-Progress'
    );
  }, [allActivities, viewType]); // Ditambahkan viewType sebagai dependency


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

      {/* Charts Visualization */}
      {allActivities.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold text-center mb-4">Distribusi Status Aktivitas</h2>
            <div className="h-64 md:h-80 w-full flex items-center justify-center">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }}/>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold text-center mb-4">Jumlah Aktivitas per Status</h2>
            <div className="h-64 md:h-80 w-full">
              <Bar data={barChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}/>
            </div>
          </div>
        </div>
      ) : (
        !error && (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
            <p>Belum ada aktivitas (Training/Project) yang ditugaskan kepada Anda.</p>
          </div>
        )
      )}

      {/* KOMPONEN BARU: Daftar Aktivitas On-Progress dengan Dropdown */}
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
              // Tentukan warna kartu berdasarkan tipe
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
    </div>
  );
};

export default ExpertDashboard;