// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import barGraphIcon from '../iconres/bar-graph.png';
import pieChartIcon from '../iconres/pie-chart.png';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels // Register the datalabels plugin
);

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [userCounts, setUserCounts] = useState({
    Sales: 0,
    'Head Sales': 0,
    Admin: 0,
    Expert: 0,
    Semua: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPieChart, setShowPieChart] = useState(false); // New state for chart toggle

  useEffect(() => {
    const fetchUserCounts = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/user/all", { // <-- URL diperbaiki
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const users = response.data;
        const counts = {
          Sales: 0,
          'Head Sales': 0,
          Admin: 0,
          Expert: 0,
          Semua: users.length,
        };
        
        users.forEach((u) => {
          if (counts.hasOwnProperty(u.role)) {
            counts[u.role]++;
          }
        });
        
        setUserCounts(counts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUserCounts();
  }, [user]);

  if (loading) {
    return <div className="text-center mt-20">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  const roleCards = [
    { name: "Sales", count: userCounts.Sales, link: "/sales" },
    { name: "Head Sales", count: userCounts['Head Sales'], link: "/sales" },
    { name: "Admin", count: userCounts.Admin, link: "/users" },
    { name: "Expert", count: userCounts.Expert, link: "/expert" },
    { name: "Semua", count: userCounts.Semua, link: "/users" },
  ];

  const chartData = {
    labels: ['Sales', 'Head Sales', 'Admin', 'Expert'],
    datasets: [
      {
        label: 'Jumlah Pengguna',
        data: [userCounts.Sales, userCounts['Head Sales'], userCounts.Admin, userCounts.Expert],
        backgroundColor: [
          'rgba(40, 205, 100, 0.6)',
          'rgba(65, 140, 255, 0.6)',
          'rgba(240, 185, 15, 0.6)',
          'rgba(175, 95, 255, 0.6)',
        ],
        borderColor: [
          'rgba(40, 205, 100, 1)',
          'rgba(65, 140, 255, 1)',
          'rgba(240, 185, 15, 1)',
          'rgba(175, 95, 255, 1)',
        ],
        borderWidth: 1,
        datalabels: { display: false },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Jumlah Pengguna: ${userCounts.Semua}`,
      },
    },
    scales: {
      x: { // Add x-axis configuration
        barPercentage: 0.8, // Adjust bar width
        categoryPercentage: 0.8, // Adjust bar width
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Function to generate pie chart data for all users
  const generateOverallPieChartData = () => {
    const labels = Object.keys(userCounts).filter(role => role !== 'Semua');
    const data = labels.map(role => userCounts[role]);
    const backgroundColors = [
          'rgba(40, 205, 100, 0.6)',
          'rgba(65, 140, 255, 0.6)',
          'rgba(240, 185, 15, 0.6)',
          'rgba(175, 95, 255, 0.6)',
        ];
    const borderColors = [
          'rgba(40, 205, 100, 1)',
          'rgba(65, 140, 255, 1)',
          'rgba(240, 185, 15, 1)',
          'rgba(175, 95, 255, 1)',
        ];
    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const overallPieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Jumlah Pengguna: ${userCounts.Semua}`,
      },
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

  return (
    <div className="flex-grow bg-gray-100 w-full max-w-full overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center py-4 bg-white shadow-md rounded-xl mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">📊 Dashboard Admin</h1>
        </header>

        {/* Chart Container */}
        <div className="mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md relative h-[400px] md:h-[500px] lg:h-[600px]">
          <div
            className="absolute top-4 right-4 flex items-center w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out"
            onClick={() => setShowPieChart(!showPieChart)}
            style={{ backgroundColor: showPieChart ? '#9CA3AF' : '#E5E7EB' }} // Dynamic background for the track
          >
            {/* Sliding thumb */}
            <div
              className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ease-in-out ${showPieChart ? 'transform translate-x-10 bg-white' : 'bg-white'}`}
            >
              {showPieChart ? (
                <img src={pieChartIcon} alt="Pie Chart" className="w-6 h-6" /> // Pie chart icon
              ) : (
                <img src={barGraphIcon} alt="Bar Chart" className="w-6 h-6" /> // Bar chart icon
              )}
            </div>
          </div>
          <div className="w-full h-full flex flex-col">
            {showPieChart ? (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Pie Chart</h2>
                <p className="text-gray-600 text-sm mb-4">
                </p>
                <div className="flex-grow">
                  <Pie data={generateOverallPieChartData()} options={overallPieChartOptions} height="100%" width="100%" />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Bar Chart</h2>
                <p className="text-gray-600 text-sm mb-4">
                </p>
                <div className="flex-grow">
                  <Bar data={chartData} options={chartOptions} height="100%" width="100%" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;