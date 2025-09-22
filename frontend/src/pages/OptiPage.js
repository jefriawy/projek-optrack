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
import { FaSearch } from "react-icons/fa";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const getDisplayName = (user) => {
  if (!user) return "User";
  return (
    user.name ||
    user.nmExpert ||
    user.fullName ||
    user.username ||
    (user.email ? user.email.split("@")[0] : "User")
  );
};
const getAvatarUrl = (user) => {
  if (!user) return null;
  const candidate =
    user.photoURL ||
    user.photoUrl ||
    user.photo ||
    user.avatar ||
    user.image ||
    user.photoUser ||
    null;
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return candidate;
  return `${API_BASE}/uploads/avatars/${String(candidate)
    .split(/[\\/]/)
    .pop()}`;
};
const Initials = ({ name }) => {
  const ini = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
      {ini}
    </div>
  );
};

const OptiPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [optis, setOptis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProgram, setActiveProgram] = useState("Semua Program");
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editingOpti, setEditingOpti] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchOptis = useCallback(
    async (companyName = "", page = 1, program = "Semua Program") => {
      if (!user?.token) return;
      try {
        const response = await axios.get(`${API_BASE}/api/opti`, {
          params: { companyName, page, limit: 10, program },
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOptis(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
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
      fetchOptis(searchTerm, 1, activeProgram);
    }, 500);
    setDebounceTimeout(newTimeout);

    return () => clearTimeout(newTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, activeProgram]);

  useEffect(() => {
    if (user) {
      fetchOptis(searchTerm, currentPage, activeProgram);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentPage, activeProgram]);

  const filteredOptis = useMemo(() => {
    let data = [...optis];
    if (searchTerm.trim() !== "") {
      data = data.filter((opti) =>
        (opti.corpCustomer || "")
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter((opti) => opti.statOpti === statusFilter);
    }
    return data;
  }, [optis, statusFilter, searchTerm]);

  const handleAddOpti = () => {
    setEditingOpti(null);
    setFormModalOpen(true);
  };

  const handleEditOpti = async (opti) => {
    try {
      const response = await axios.get(`${API_BASE}/api/opti/${opti.idOpti}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEditingOpti(response.data);
      setFormModalOpen(true);
    } catch (err) {
      console.error("Error fetching opti detail for edit:", err);
      alert("Gagal mengambil data detail OPTI untuk edit.");
    }
  };

  const handleViewOpti = async (opti) => {
    setViewModalOpen(true);
    setIsDetailLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/opti/${opti.idOpti}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEditingOpti(response.data);
    } catch (err) {
      console.error("Error fetching opti detail:", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setFormModalOpen(false);
    setViewModalOpen(false);
    setEditingOpti(null);
    fetchOptis(searchTerm, currentPage, activeProgram);
  };

  const handleFormSubmit = async (formData) => {
    const url = editingOpti
      ? `${API_BASE}/api/opti/${editingOpti.idOpti}`
      : `${API_BASE}/api/opti`;
    const method = editingOpti ? "put" : "post";
    try {
      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      closeModal();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menyimpan data.";
      console.error("Error submitting form:", err?.response?.data || err);
      alert(`Gagal menyimpan: ${msg}`);
    }
  };

  const handlePaymentSubmit = async (paymentFile) => {
    if (!editingOpti) return;
    const formData = new FormData();
    formData.append("buktiPembayaran", paymentFile);
    try {
      await axios.put(
        `${API_BASE}/api/opti/${editingOpti.idOpti}/payment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Bukti pembayaran berhasil diunggah.");
      closeModal();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Gagal mengunggah file.";
      console.error(
        "Error uploading payment proof:",
        err?.response?.data || err
      );
      alert(`Gagal mengunggah: ${msg}`);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
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

  const ProgramTabs = () => (
    <div className="mb-4 border-b border-gray-200">
      <div className="flex space-x-6">
        {["Semua Program", "Training", "Project", "Outsource"].map(
          (program) => (
            <button
              key={program}
              onClick={() => setActiveProgram(program)}
              className={`pb-2 text-sm font-medium transition-colors duration-200 ${
                activeProgram === program
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {program}
            </button>
          )
        )}
      </div>
    </div>
  );

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
              placeholder="Cari Nama Perusahaan..."
              className="w-full pl-3 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Cari Nama Perusahaan"
            />
            <FaSearch className="absolute right-3 text-gray-400" />
          </div>
          <div className="flex items-center gap-3 pl-4 border-l">
            {getAvatarUrl(user) ? (
              <img
                src={getAvatarUrl(user)}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <Initials name={getDisplayName(user)} />
            )}
            <div className="leading-5">
              <div className="text-sm font-bold">{getDisplayName(user)}</div>
              <div className="text-xs text-gray-500">
                Logged in • {user?.role || "User"}
              </div>
            </div>
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
              <option value="opti entry">Opti Entry</option>
              <option value="opti on going">On Going</option>
              <option value="opti failed">Opti Failed</option>
              <option value="po received">PO Received</option>
            </select>
          </div>
        </div>

        <ProgramTabs />

        <div className="overflow-x-auto">
          <OptiTable
            optis={filteredOptis}
            onViewOpti={handleViewOpti}
            onEditOpti={handleEditOpti}
          />
        </div>

        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
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
          onPaymentSubmit={handlePaymentSubmit}
          onClose={closeModal}
        />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={closeModal}
        title="Detail Opportunity"
      >
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