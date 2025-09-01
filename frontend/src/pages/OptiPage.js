// frontend/src/pages/OptiPage.js

import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Modal from "../components/Modal";
import OptiForm from "../components/OptiForm";
import OptiTable from "../components/OptiTable";
import OptiDetail from "../components/OptiDetail";
import { pdf } from "@react-pdf/renderer";
import OptiListPdf from "../components/OptiListPdf";
import { FaSearch, FaUserCircle } from "react-icons/fa";

const OptiPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [optis, setOptis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("date_desc");
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editingOpti, setEditingOpti] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // State baru untuk loading detail
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchOptis = useCallback(
    async (searchQuery = "", page = 1) => {
      if (!user?.token) return;
      try {
        const response = await axios.get("http://localhost:3000/api/opti", {
          params: { search: searchQuery, page, limit: 10 },
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOptis(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error(
          "Error fetching optis:",
          err.response ? err.response.data : err.message
        );
      }
    },
    [user]
  );

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const newTimeout = setTimeout(() => {
      setCurrentPage(1);
      fetchOptis(searchTerm, 1);
    }, 500);
    setDebounceTimeout(newTimeout);

    return () => clearTimeout(newTimeout);
  }, [searchTerm, fetchOptis]);

  useEffect(() => {
    fetchOptis();
  }, [fetchOptis]);

  const filteredOptis = useMemo(() => {
    let data = [...optis];
    if (statusFilter) {
      data = data.filter((opti) => opti.statOpti === statusFilter);
    }
    data.sort((a, b) => new Date(b.datePropOpti) - new Date(a.datePropOpti));
    return data;
  }, [optis, statusFilter]);

  const handleAddOpti = () => {
    setEditingOpti(null);
    setFormModalOpen(true);
  };

  const handleEditOpti = (opti) => {
    setEditingOpti(opti);
    setFormModalOpen(true);
  };

  // ===== FUNGSI INI DIUBAH TOTAL =====
  const handleViewOpti = async (opti) => {
    setViewModalOpen(true);
    setIsDetailLoading(true);
    try {
      // Panggil API untuk mendapatkan data detail yang lengkap
      const response = await axios.get(
        `http://localhost:3000/api/opti/${opti.idOpti}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      // Set state dengan data lengkap dari API
      setEditingOpti(response.data);
    } catch (err) {
      console.error("Error fetching opti detail:", err);
      // Handle error, mungkin tutup modal dan tampilkan notifikasi
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setFormModalOpen(false);
    setViewModalOpen(false);
    setEditingOpti(null);
    fetchOptis(searchTerm, currentPage);
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
    } catch (err) {
      console.error(
        "Error submitting form:",
        err.response ? err.response.data : err.message
      );
      alert("Gagal menyimpan data. Periksa konsol untuk detail.");
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    fetchOptis(searchTerm, pageNumber);
  };

  const handleDownloadPdf = async () => {
    const doc = (
      <OptiListPdf optis={Array.isArray(filteredOptis) ? filteredOptis : []} />
    );
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan_opti.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Opportunity Page
          </h1>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center">
          <div className="relative flex items-center w-full md:w-64 mb-4 md:mb-0 md:mr-4">
            <input
              type="text"
              placeholder="Search Perusahaan..."
              className="w-full pl-3 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 text-gray-400" />
          </div>
          <div className="flex items-center">
            <FaUserCircle className="text-gray-500 text-2xl mr-2" />
            <span className="font-medium text-gray-700">
              {user.name || "User"}
            </span>
          </div>
        </div>
      </header>

      <main className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Opportunity</h1>
        <p className="text-gray-600 mb-6">Data Opportunity</p>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
            <button
              onClick={handleAddOpti}
              className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300"
            >
              Tambah Opportunity
            </button>
            {optis.length > 0 && (
              <button
                onClick={handleDownloadPdf}
                className="w-full md:w-auto bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors duration-300"
              >
                Export to PDF
              </button>
            )}
          </div>
          <div className="w-full md:w-auto flex items-center">
            <label htmlFor="statusFilter" className="text-gray-700 mr-2">
              Status:
            </label>
            <select
              id="statusFilter"
              className="w-full md:w-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="Follow Up">Follow Up</option>
              <option value="On-Progress">On-Progress</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Just Get Info">Just Get Info</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <OptiTable
            optis={filteredOptis}
            onViewOpti={handleViewOpti}
            onEditOpti={handleEditOpti}
          />
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {/* Pagination buttons... */}
        </div>
      </main>

      <Modal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        title={editingOpti ? "Edit Opportunity" : "Tambah Opportunity Baru"}
      >
        <OptiForm
          initialData={editingOpti}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
        />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Detail Opportunity"
      >
        {/* Tampilkan loading spinner saat data detail diambil */}
        {isDetailLoading ? (
          <div className="text-center p-8">Memuat data detail...</div>
        ) : (
          <OptiDetail opti={editingOpti} />
        )}
      </Modal>
    </div>
  );
};

export default OptiPage;
