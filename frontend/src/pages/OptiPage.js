// frontend/src/pages/OptiPage.js

import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import OptiForm from "../components/OptiForm";
import OptiTable from "../components/OptiTable";
import OptiDetail from "../components/OptiDetail";
import { pdf } from "@react-pdf/renderer";
import OptiListPdf from "../components/OptiListPdf";
import { FaSearch } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import Pagination from '../components/Pagination';
import NotificationBell from "../components/NotificationBell"; 

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// --- Helper Components (unchanged) ---
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
  return `${API_BASE}/uploads/avatars/${String(candidate).split(/[\\/]/).pop()}`;
};
const Initials = ({ name }) => {
  const ini = (name || "U").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
      {ini}
    </div>
  );
};

// --- Custom Hook for Debouncing ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const OptiPage = () => {
  const { user, loading } = useContext(AuthContext);
  
  // --- State Management ---
  const [optis, setOptis] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("corpCustomer");
  const [activeProgram, setActiveProgram] = useState("Semua Program");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Modal and detail states
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editingOpti, setEditingOpti] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { id: currentOptiId } = useParams();

  // --- Data Fetching ---
  const fetchOptis = useCallback(async () => {
    if (!user?.token) return;
    try {
      const params = {
        page: currentPage,
        limit: 10,
        program: activeProgram,
        status: statusFilter,
      };
      if (debouncedSearchTerm) {
        params[searchBy] = debouncedSearchTerm;
      }

      const response = await axios.get(`${API_BASE}/api/opti`, {
        params,
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setOptis(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching optis:", err.response ? err.response.data : err.message);
    }
  }, [user, currentPage, activeProgram, statusFilter, debouncedSearchTerm, searchBy]);

  // *** THE MAIN useEffect for DATA FETCHING ***
  useEffect(() => {
    // This effect is the single source of truth for fetching data.
    // It runs whenever any of its dependencies (the filters, page, or user) change.
    if (user) {
      fetchOptis();
    }
  }, [user, fetchOptis]); // `fetchOptis` is a dependency itself and is memoized with useCallback

  // --- Simplified Event Handlers ---
  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on new search
  };

  const handleSearchByChange = (newSearchBy) => {
    setSearchBy(newSearchBy);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleProgramChange = (newProgram) => {
    setActiveProgram(newProgram);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // --- Modal and Form Handlers ---
  const closeModal = () => {
    setFormModalOpen(false);
    setViewModalOpen(false);
    setEditingOpti(null);
    fetchOptis(); // Simply re-fetch the current view
  };

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
      setEditingOpti(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching opti detail:", err);
      alert(`Gagal mengambil data: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    const url = editingOpti ? `${API_BASE}/api/opti/${editingOpti.idOpti}` : `${API_BASE}/api/opti`;
    const method = editingOpti ? "put" : "post";
    try {
      await axios[method](url, formData, { headers: { Authorization: `Bearer ${user.token}` } });
      closeModal();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Gagal menyimpan data.";
      console.error("Error submitting form:", err?.response?.data || err);
      alert(`Gagal menyimpan: ${msg}`);
    }
  };

  const handlePaymentSubmit = (fileOrFormData) => {
    const id = editingOpti?.idOpti || currentOptiId;
    if (!id) return Promise.reject(new Error("ID opportunity tidak tersedia"));
    const fd = fileOrFormData instanceof FormData ? fileOrFormData : (() => {
      const f = new FormData();
      f.append("dokPendaftaran", fileOrFormData);
      return f;
    })();

    return axios.put(`${API_BASE}/api/opti/${id}/payment`, fd, { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => {
        console.log("Dokumen pendaftaran berhasil diunggah");
        fetchOptis(); // Re-fetch data
        return res;
      })
      .catch((err) => {
        console.error("Error uploading registration document:", err.response ? err.response.data : err);
        throw err;
      });
  };

  const handleDownloadPdf = async () => {
    const doc = <OptiListPdf optis={Array.isArray(optis) ? optis : []} />;
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

  // --- Render JSX ---
  return (
    <div className="flex-grow p-8 bg-gray-100">
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Opportunity Page</h1>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center">
          <Menu as="div" className="relative w-full md:w-80 mb-4 md:mb-0 md:mr-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari..."
                className="w-full h-10 pl-12 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={searchTerm}
                onChange={handleSearchTermChange}
                aria-label="Cari"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <div className="absolute inset-y-0 left-0 flex items-center">
                <Menu.Button className="inline-flex justify-center items-center w-10 h-full text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </Menu.Button>
              </div>
              <Menu.Items className="absolute left-0 right-0 top-full mt-1 w-full origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  {Object.entries({ corpCustomer: "Perusahaan", nmOpti: "Opti", nmSales: "Sales" }).map(([value, label]) => (
                    <Menu.Item key={value}>
                      {({ active }) => (
                        <button
                          onClick={() => handleSearchByChange(value)}
                          className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                        >
                          {label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </div>
          </Menu>
          <div className="flex items-center gap-3 pl-4 border-l">
            {getAvatarUrl(user) ? <img src={getAvatarUrl(user)} alt="avatar" className="w-9 h-9 rounded-full object-cover" /> : <Initials name={getDisplayName(user)} />}
            <div className="leading-5">
              <div className="text-sm font-bold">{getDisplayName(user)}</div>
              <div className="text-xs text-gray-500">Logged in • {user?.role || "User"}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0"> {/* Container untuk Lonceng + Chip */}
                        
                        {/* Lonceng Notifikasi */}
                        {user && <NotificationBell />} 
              </div>
        </div>
      </header>

      <main className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Opportunity</h1>
        <p className="text-gray-600 mb-6">Data Opportunity</p>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
            <button onClick={handleAddOpti} className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
              Tambah Opportunity
            </button>
            {optis.length > 0 && (
              <button onClick={handleDownloadPdf} className="w-full md:w-auto bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors duration-300">
                Export to PDF
              </button>
            )}
          </div>
          <div className="w-full md:w-auto flex items-center">
            <label htmlFor="statusFilter" className="text-gray-700 mr-2">Status:</label>
            <select id="statusFilter" className="w-full md:w-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="">Semua Status</option>
              <option value="opti entry">Opti Entry</option>
              <option value="opti on going">On Going</option>
              <option value="opti failed">Opti Failed</option>
              <option value="po received">PO Received</option>
            </select>
          </div>
        </div>

        <div className="mb-4 border-b border-gray-200">
          <div className="flex space-x-6">
            {["Semua Program", "Training", "Project", "Outsource"].map((program) => (
              <button
                key={program}
                onClick={() => handleProgramChange(program)}
                className={`pb-2 text-sm font-medium transition-colors duration-200 ${activeProgram === program ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                {program}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <OptiTable optis={optis} onViewOpti={handleViewOpti} onEditOpti={handleEditOpti} />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <Modal isOpen={isFormModalOpen} onClose={closeModal} title={editingOpti ? "Edit Opportunity" : "Tambah Opportunity Baru"}>
        <OptiForm initialData={editingOpti} onSubmit={handleFormSubmit} onPaymentSubmit={handlePaymentSubmit} onClose={closeModal} />
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={closeModal} title="Detail Opportunity">
        {isDetailLoading ? <div className="text-center p-8">Memuat data detail...</div> : <OptiDetail opti={editingOpti} />}
      </Modal>
    </div>
  );
};

export default OptiPage;