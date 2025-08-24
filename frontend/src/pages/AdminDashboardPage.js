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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [userCounts, setUserCounts] = useState({
    Sales: 0,
    'Head Sales': 0,
    Trainer: 0,
    Expert: 0,
    Project: 0, 
    Outsource: 0,
    Semua: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null); // New state for hover

  useEffect(() => {
    const fetchUserCounts = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("http://localhost:3000/api/user", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const users = response.data;
        const counts = {
          Sales: 0,
          'Head Sales': 0,
          Trainer: 0,
          Expert: 0,
          Project: 0,
          Outsource: 0,
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
    { name: "Head Sales", count: userCounts['Head Sales'], link: "/sales" }, // Changed name to match key
    { name: "Expert", count: userCounts.Expert, link: "/expert" },
    { name: "Project", count: userCounts.Project, link: "/project" },
    { name: "Outsource", count: userCounts.Outsource, link: "/outsource" },
    { name: "Semua", count: userCounts.Semua, link: "/users" },
  ];

  const chartData = {
    labels: Object.keys(userCounts).filter(role => role !== 'Semua'),
    datasets: [
      {
        label: 'Jumlah Pengguna',
        data: Object.values(userCounts).filter((_, index) => Object.keys(userCounts)[index] !== 'Semua'),
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Jumlah Pengguna Berdasarkan Peran',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const roleColors = {
    'Sales': {
      background: 'rgba(255, 99, 132, 0.6)',
      border: 'rgba(255, 99, 132, 1)',
    },
    'Head Sales': {
      background: 'rgba(54, 162, 235, 0.6)',
      border: 'rgba(54, 162, 235, 1)',
    },
    'Trainer': {
      background: 'rgba(255, 206, 86, 0.6)',
      border: 'rgba(255, 206, 86, 1)',
    },
    'Expert': {
      background: 'rgba(75, 192, 192, 0.6)',
      border: 'rgba(75, 192, 192, 1)',
    },
    'Project': {
      background: 'rgba(153, 102, 255, 0.6)',
      border: 'rgba(153, 102, 255, 1)',
    },
    'Outsource': {
      background: 'rgba(255, 159, 64, 0.6)',
      border: 'rgba(255, 159, 64, 1)',
    },
  };

  // Function to generate pie chart data for a specific role
  const generatePieChartData = (roleName, roleCount) => {
    if (roleName === 'Semua') {
      const labels = Object.keys(userCounts).filter(role => role !== 'Semua');
      const data = labels.map(role => userCounts[role]);

      const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ];
      const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
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
    } else {
      const totalUsers = userCounts.Semua;
      const otherRolesCount = totalUsers - roleCount;
      const roleColor = roleColors[roleName] || { background: 'rgba(200, 200, 200, 0.6)', border: 'rgba(200, 200, 200, 1)' };

      return {
        labels: [roleName, 'Peran Lain'],
        datasets: [
          {
            data: [roleCount, otherRolesCount],
            backgroundColor: [
              roleColor.background,
              'rgba(200, 200, 200, 0.6)',
            ],
            borderColor: [
              roleColor.border,
              'rgba(200, 200, 200, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to be smaller than its container
    plugins: {
      legend: {
        display: false, // Hide legend for small pie charts
      },
      title: {
        display: false, // Hide title for small pie charts
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed;
            }
            return label;
          }
        }
      }
    },
    animation: {
      animateRotate: true, // Enable rotation animation
      animateScale: true,  // Enable scaling animation
    },
  };

  return (
    <div className="flex-grow p-8 bg-gray-100 w-full max-w-full overflow-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-md rounded-xl mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">📊 Dashboard Admin</h1>
      </header>

      {/* Bar Chart */}
      <div className="mb-8 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Statistik Pengguna</h2>
        <div className="h-80 sm:h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {roleCards.map((card) => (
          <Link
            key={card.name}
            to={card.link}
            className="block" // Make the Link a block element to contain the card
          >
            <div
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden h-32 sm:h-40"
              onMouseEnter={() => setHoveredCard(card.name)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Text content */}
              <div className={`transition-opacity duration-300 ${hoveredCard === card.name ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                <h2 className="text-lg sm:text-xl font-semibold mb-2">{card.name}</h2>
                <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">{card.count}</p>
              </div>

              {/* Pie chart overlay */}
              <div
                className={`absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-300 ${hoveredCard === card.name ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                <div className="w-24 h-24 sm:w-32 sm:h-32">
                  <Pie data={generatePieChartData(card.name, card.count)} options={pieChartOptions} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;