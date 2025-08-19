import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Modal from "../components/Modal";
import OptiForm from "../components/OptiForm";
import OptiTable from "../components/OptiTable";
import OptiDetail from "../components/OptiDetail";
import OptiListPdf from "../components/OptiListPdf";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";

const OptiPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [optis, setOptis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name_asc");
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editingOpti, setEditingOpti] = useState(null);

  const fetchOptis = useCallback(async () => {
    if (user?.token) {
      try {
        const response = await axios.get("http://localhost:3000/api/opti", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOptis(response.data);
      } catch (err) {
        // handle error
      }
    }
  }, [user]);

  useEffect(() => {
    fetchOptis();
  }, [fetchOptis]);

  // --- SEARCH & SORT LOGIC ---
  const filteredOptis = React.useMemo(() => {
    if (!searchTerm) return optis;
    return optis.filter(
      (opti) =>
        (opti.nmOpti || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opti.nmCustomer || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [optis, searchTerm]);

  const sortedOptis = React.useMemo(() => {
    const arr = [...filteredOptis];
    switch (sortOrder) {
      case "date_desc":
        return arr.sort((a, b) => new Date(b.datePropOpti) - new Date(a.datePropOpti));
      case "name_asc":
        return arr.sort((a, b) => (a.nmOpti || "").localeCompare(b.nmOpti || ""));
      case "customer_asc":
        return arr.sort((a, b) => (a.nmCustomer || "").localeCompare(b.nmCustomer || ""));
      default:
        return arr;
    }
  }, [filteredOptis, sortOrder]);

  // --- HANDLERS ---
  const handleAddOpti = () => {
    setEditingOpti(null);
    setFormModalOpen(true);
  };
  const handleEditOpti = (opti) => {
    setEditingOpti(opti);
    setFormModalOpen(true);
  };
  const handleViewOpti = (opti) => {
    setEditingOpti(opti);
    setViewModalOpen(true);
  };
  const closeModal = () => {
    setFormModalOpen(false);
    setViewModalOpen(false);
    setEditingOpti(null);
  };

  const handleFormSubmit = async (formData) => {
    const url = editingOpti
      ? `http://localhost:3000/api/opti/${editingOpti.idOpti}`
      : "http://localhost:3000/api/opti";
    const method = editingOpti ? "put" : "post";
    try {
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      closeModal();
      fetchOptis();
    } catch (err) {
      console.error("Error submitting form:", err.response ? err.response.data : err.message);
      alert("Gagal menyimpan data. Periksa konsol untuk detail.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Opportunity Page</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Opportunity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-gray-500 text-2xl" />
            <span className="font-semibold text-gray-700">{user.name}</span>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Opportunity</h2>
      <p className="text-gray-600 mb-4">Data Opportunity</p>

      {/* Action Buttons & Sort */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={handleAddOpti}
          className="bg-black text-white px-5 py-2 rounded font-semibold hover:bg-gray-800 transition"
        >
          Tambah Opportunity
        </button>
        <PDFDownloadLink
          key={searchTerm + '-' + sortOrder + '-' + sortedOptis.length}
          document={<OptiListPdf optis={sortedOptis} />}
          fileName="laporan_opti.pdf"
          className="bg-red-600 text-white px-5 py-2 rounded font-semibold hover:bg-red-700 transition"
        >
          {({ loading }) => (loading ? "Membuat PDF..." : "Export to PDF")}
        </PDFDownloadLink>
      </div>
      <div className="flex justify-end items-center gap-2 mb-2">
        <label
          htmlFor="sortOrder"
          className="text-sm font-medium text-gray-700"
        >
          Urutkan:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="name_asc">Nama Opti</option>
          <option value="customer_asc">Customer</option>
          <option value="date_desc">Tanggal</option>
        </select>
      </div>

      {/* Table */}
      <OptiTable
        optis={sortedOptis}
        onViewOpti={handleViewOpti}
        onEditOpti={handleEditOpti}
      />

      {/* Modal Form */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        title={editingOpti ? "Edit Opportunity" : "Tambah Opportunity Baru"}
      >
        <OptiForm
          key={editingOpti ? editingOpti.idOpti : 'new'}
          initialData={editingOpti}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
        />
      </Modal>

      {/* Modal Detail */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Detail Opportunity"
      >
        <OptiDetail opti={editingOpti} />
      </Modal>
    </div>
  );
};

export default OptiPage;
