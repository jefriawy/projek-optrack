// src/pages/AkademikDashboard.js
import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaUser,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaCommentDots,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import TrainingTable from "../components/TrainingTable";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const AkademikDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State baru untuk aktivitas terbaru
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState("");

  // Fungsi untuk mengambil semua data training
  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/training`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTrainingData(response.data);
    } catch (err) {
      console.error("Failed to fetch training data:", err);
      setError("Gagal mengambil data training.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengambil aktivitas terbaru dari API
  const fetchRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      const res = await axios.get(`${API_BASE}/api/activity/recent`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRecentActivities(res.data);
    } catch (e) {
      console.error("Failed to fetch recent activities:", e);
      setActivitiesError("Gagal memuat aktivitas terbaru.");
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchTrainingData();
      fetchRecentActivities(); // Memanggil fungsi untuk mengambil data real
    }
  }, [user]);

  // Hitung statistik ringkasan
  const summaryStats = useMemo(() => {
    const total = trainingData.length;
    const delivered = trainingData.filter(
      (t) => t.statusTraining === "Training Delivered"
    ).length;
    const onProgress = trainingData.filter(
      (t) => t.statusTraining === "Training On Progress"
    ).length;
    const received = trainingData.filter(
      (t) => t.statusTraining === "Po Received"
    ).length;

    return { total, delivered, onProgress, received };
  }, [trainingData]);

  // Hapus data simulasi karena kita akan menggunakan data real

  if (authLoading || (loading && activitiesLoading)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Akademik Dashboard
      </h1>

      {/* Ringkasan Data Training */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Training</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {summaryStats.total}
            </p>
          </div>
          <IoIosPeople className="text-5xl text-blue-500" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Training Selesai
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {summaryStats.delivered}
            </p>
          </div>
          <FaCheckCircle className="text-5xl text-green-500" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Training Berjalan
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {summaryStats.onProgress}
            </p>
          </div>
          <FaSpinner className="text-5xl text-yellow-500" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Training Mendatang
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {summaryStats.received}
            </p>
          </div>
          <FaClock className="text-5xl text-red-500" />
        </div>
      </div>

      {/* Tabel Data Training */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Daftar Semua Training
        </h2>
        <TrainingTable data={trainingData} />
      </div>

      {/* Aktivitas Terbaru */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Aktivitas Terbaru
        </h2>
        {activitiesLoading ? (
          <div className="text-center text-gray-500">Memuat aktivitas...</div>
        ) : activitiesError ? (
          <div className="text-center text-red-500">{activitiesError}</div>
        ) : recentActivities.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="py-4 flex items-center">
                <span className="mr-4 text-2xl">
                  {activity.type === "feedback" && "💬"}
                  {activity.type === "new_training" && "✨"}
                  {activity.type === "status_update" && "🔄"}
                </span>
                <div>
                  <p className="text-gray-800 font-medium">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Pada {new Date(activity.timestamp).toLocaleString("id-ID")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Tidak ada aktivitas terbaru.</p>
        )}
      </div>
    </div>
  );
};

export default AkademikDashboard;
