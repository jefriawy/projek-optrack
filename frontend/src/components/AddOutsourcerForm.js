import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const AddOutsourcerForm = ({ outsourceId }) => {
  const { user } = useContext(AuthContext);
  const [availableOutsourcers, setAvailableOutsourcers] = useState([]);
  const [selectedOutsourcer, setSelectedOutsourcer] = useState(null);
  const [assignedOutsourcers, setAssignedOutsourcers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    const fetchOutsourcers = async () => {
      try {
        // Ambil semua outsourcer yang tersedia
        const response = await axios.get(`${API_BASE}/api/outsourcer`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAvailableOutsourcers(response.data || []);

        // Ambil outsourcer yang sudah ditugaskan ke outsource ini
        const detailResponse = await axios.get(
          `${API_BASE}/api/outsource/${outsourceId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const arr =
          detailResponse.data.outsourcers ||
          detailResponse.data.assignedOutsourcers ||
          detailResponse.data.outsourcerList ||
          [];
        const assigned = (Array.isArray(arr) ? arr : []).map((o) => {
          const id = o.idOutsourcer || o.id || o._id;
          const label = o.nmOutsourcer || o.name || o.fullName || o.username || (typeof o === "string" ? o : "");
          return { value: id || label, label: label || "Outsourcer" };
        });
        setAssignedOutsourcers(assigned);
      } catch (err) {
        setError("Gagal memuat data outsourcer.");
        console.error(err);
      }
    };
    if (user?.token) {
      fetchOutsourcers();
    }
  }, [outsourceId, user?.token]);

  const handleAddOutsourcer = () => {
    if (
      selectedOutsourcer &&
      !assignedOutsourcers.find((e) => e.value === selectedOutsourcer.value)
    ) {
      setAssignedOutsourcers([...assignedOutsourcers, selectedOutsourcer]);
      setSelectedOutsourcer(null);
    }
  };

  const handleRemoveOutsourcer = (outsourcerToRemove) => {
    setAssignedOutsourcers(
      assignedOutsourcers.filter((o) => o.value !== outsourcerToRemove.value)
    );
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError("");
    setSaveStatus("");
    try {
      const outsourcerIds = assignedOutsourcers.map((o) => o.value);
      await axios.put(
        `${API_BASE}/api/outsource/${outsourceId}/outsourcers`,
        { outsourcerIds },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSaveStatus("Perubahan berhasil disimpan!");
    } catch (err) {
      setError("Gagal menyimpan perubahan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const outsourcerOptions = Array.isArray(availableOutsourcers)
    ? availableOutsourcers.map((o) => ({
        value: o.idOutsourcer || o.id || o._id,
        label:
          o.nmOutsourcer ||
          o.name ||
          o.fullName ||
          o.username ||
          (o.email ? o.email.split("@")[0] : "Outsourcer"),
      }))
    : [];

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Tambah Outsourcer</h4>
      <div className="flex items-center mb-4">
        <Select
          options={outsourcerOptions}
          value={selectedOutsourcer}
          onChange={setSelectedOutsourcer}
          placeholder="Pilih atau cari outsourcer..."
          className="flex-grow"
          isClearable
        />
        <button
          onClick={handleAddOutsourcer}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={!selectedOutsourcer}
        >
          Tambah
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div>
        <h5 className="text-md font-semibold mb-2">Outsourcer yang Ditugaskan</h5>
        {assignedOutsourcers.length > 0 ? (
          <ul className="space-y-2">
            {assignedOutsourcers.map((o) => (
              <li
                key={o.value}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
              >
                <span>{o.label}</span>
                <button
                  onClick={() => handleRemoveOutsourcer(o)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Belum ada outsourcer yang ditugaskan.</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end">
        {saveStatus && <p className="text-green-600 mr-4">{saveStatus}</p>}
        <button
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
};

export default AddOutsourcerForm;
