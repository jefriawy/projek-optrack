// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
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
    { name: "Head of Sales", count: userCounts['Head Sales'], link: "/sales" }, // Perbaikan: link mengarah ke /sales
    { name: "Trainer", count: userCounts.Trainer, link: "/training" },
    { name: "Expert", count: userCounts.Expert, link: "/expert" },
    { name: "Project", count: userCounts.Project, link: "/project" },
    { name: "Outsource", count: userCounts.Outsource, link: "/outsource" },
    { name: "Semua", count: userCounts.Semua, link: "/users" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roleCards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-2">{card.name}</h2>
            <p className="text-4xl font-bold text-gray-800 mb-4">{card.count}</p>
            <Link to={card.link} className="text-blue-600 hover:underline">
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
