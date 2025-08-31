import React, { useEffect, useState, useContext } from "react";
import Modal from "../components/Modal";
import { AuthContext } from "../context/AuthContext"; // pastikan path benar

const getStatusColor = (status) => {
  switch (status) {
    case "Follow Up":
      return "bg-blue-100 text-blue-800";
    case "On-Progress":
      return "bg-yellow-100 text-yellow-800";
    case "Success":
      return "bg-green-100 text-green-800";
    case "Failed":
      return "bg-red-100 text-red-800";
    case "Just Get Info":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDeadlineCountdown = (endDate) => {
  if (!endDate) return "-";
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days > 0 ? `${days} Hari` : ""} ${hours} Jam`.trim();
};

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const ExpertDashboard = () => {
  const { user } = useContext(AuthContext); // <-- ambil token/role
  const [totals, setTotals] = useState({ training: 0, project: 0, outsource: 0 });
  const [history, setHistory] = useState([]);
  const [type, setType] = useState("training");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, user]);

  const safeFetchJson = async (path) => {
    const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
    const headers = { "Accept": "application/json" };
    if (user?.token) headers["Authorization"] = `Bearer ${user.token}`;
    const res = await fetch(url, { headers });
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${text.slice(0, 300)}`);
    }
    if (contentType.includes("application/json")) return res.json();
    const text = await res.text();
    throw new Error(`Expected JSON but got: ${text.slice(0, 300)}`);
  };

  const fetchData = async () => {
    try {
      const [trainingRes, projectRes, outsourceRes] = await Promise.all([
        safeFetchJson("/api/training"),
        safeFetchJson("/api/project"),
        safeFetchJson("/api/outsource"),
      ]);

      setTotals({
        training: trainingRes.length,
        project: projectRes.length,
        outsource: outsourceRes.length,
      });

      let data = [];
      if (type === "training") {
        data = trainingRes.map((t) => ({
          id: t.idTraining,
          name: t.nmTraining,
          start: t.startTraining,
          end: t.endTraining,
          expert: t.nmExpert,
          status: t.statOpti || "Follow Up",
          type: "Training",
        }));
      } else {
        data = projectRes.map((p) => ({
          id: p.idProject,
          name: p.nmProject,
          start: p.startProject,
          end: p.endProject,
          expert: p.nmExpert,
          status: p.statOpti || "Follow Up",
          type: "Project",
        }));
      }
      setHistory(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-lg sm:text-xl font-bold">Dashboard Expert</h1>
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

      {/* Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="font-semibold text-sm sm:text-base">
            History {type === "training" ? "Training" : "Project"}
          </h2>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="training">Training</option>
            <option value="project">Project</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Nama</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Status</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b">
                    <td className="p-2">{h.name}</td>
                    <td className="p-2">{h.end ? new Date(h.end).toLocaleString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs sm:text-sm ${getStatusColor(
                        h.status
                      )}`}
                    >
                      {h.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                      onClick={() => setSelected(h)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`${selected?.type} Details`}
      >
        {selected && (
          <div className="space-y-3 text-sm sm:text-base">
            <div>
              <p className="font-semibold">{selected.type} Name</p>
              <p>{selected.name}</p>
            </div>
            <div>
              <p className="font-semibold">Tanggal Deadline</p>
              <p>{getDeadlineCountdown(selected.end)}</p>
            </div>
            <div>
              <p className="font-semibold">Nama Expert</p>
              <p>{selected.expert || "-"}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <span
                className={`px-2 py-1 rounded text-xs sm:text-sm ${getStatusColor(
                  selected.status
                )}`}
              >
                {selected.status}
              </span>
            </div>
            <div className="pt-4">
              <button className="bg-gray-700 text-white px-3 sm:px-4 py-2 rounded text-xs sm:text-sm">
                Export to PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExpertDashboard;
