// src/pages/CustomerPage.js
import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CustomerDetail from "../components/CustomerDetail";
import CustomerForm from "../components/CustomerForm";
import Modal from "../components/Modal";
import CustomerListPdf from "../components/CustomerListPdf";
import { AuthContext } from "../context/AuthContext";
import { FaSearch } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import CustomerTable from "../components/CustomerTable";
import HeadSalesCustomerTable from "../components/HeadSalesCustomerTable";
import Pagination from "../components/Pagination";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Helper functions (unchanged)
const getDisplayName = (user) => {
  if (!user) return "User";
  return user.name || user.nmExpert || user.fullName || user.username || (user.email ? user.email.split("@")[0] : "User");
};

const getAvatarUrl = (user) => {
  if (!user) return null;
  const candidate = user.photoURL || user.photoUrl || user.photo || user.avatar || user.image || user.photoUser || null;
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

// --- Component Rewrite ---
const CustomerPage = () => {
  const { user, loading } = useContext(AuthContext);
  
  // State Management
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("corpCustomer");
  const [sortOrder, setSortOrder] = useState("name_az");
  const [error, setError] = useState("");

  // Modal States
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isUpdateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
  const [customerToUpdateStatus, setCustomerToUpdateStatus] = useState(null);

  // PDF Export
  const handleDownloadPdf = async () => {
    // Dynamically import pdf from @react-pdf/renderer
    const { pdf } = await import("@react-pdf/renderer");
    const doc = <CustomerListPdf customers={Array.isArray(sortedCustomers) ? sortedCustomers : []} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `customer_report_${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Requirement 2: `fetchCustomers` function using `useCallback`
  const fetchCustomers = useCallback(async () => {
    if (!user || !user.token) return;
    
    try {
      setError(""); // Clear previous errors
      const params = {
        page: currentPage,
        limit: 10,
        [searchBy]: searchTerm,
      };

      const response = await axios.get(`${API_BASE}/api/customer`, {
        params,
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setCustomers(Array.isArray(response.data.data) ? response.data.data : []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Gagal mengambil data pelanggan.";
      setError(errorMessage);
      console.error("Fetch error:", err);
    }
  }, [user, currentPage, searchTerm, searchBy]); // Dependencies for the fetch logic

  // Requirement 3: Main `useEffect` for data fetching
  useEffect(() => {
    // Using a debounce mechanism to prevent excessive API calls while typing
    const handler = setTimeout(() => {
      fetchCustomers();
    }, 300);

    // Cleanup function to cancel the timeout if dependencies change
    return () => {
      clearTimeout(handler);
    };
  }, [fetchCustomers]); // The effect re-runs only when the memoized fetchCustomers function changes

  // Effect for resetting page number when search filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchBy]);

  // --- Other Functions (Callbacks & Handlers) ---

  const fetchStatusOptions = useCallback(async () => {
    if (!user || !user.token) return;
    try {
      const response = await axios.get(`${API_BASE}/api/customer/status`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStatusOptions(response.data);
    } catch (error) {
      console.error("Error fetching status options:", error);
      setError("Gagal mengambil opsi status.");
    }
  }, [user]);

  useEffect(() => {
    if (user && (user.role === "Head Sales" || user.role === "Admin")) {
      fetchStatusOptions();
    }
  }, [user, fetchStatusOptions]);

  // Requirement 1: `handlePageChange` only sets the current page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const method = editingCustomer ? "put" : "post";
      const url = editingCustomer
        ? `${API_BASE}/api/customer/${editingCustomer.idCustomer}`
        : `${API_BASE}/api/customer`;
      
      await axios[method](url, formData, { headers: { Authorization: `Bearer ${user.token}` } });
      
      // Refetch data for the current page after submission
      fetchCustomers();
      handleCloseModal();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menyimpan data pelanggan.");
    }
  };
  
  const handleUpdateStatusSubmit = async () => {
    if (!customerToUpdateStatus || !selectedStatus) return;
    try {
      const updatedData = { ...customerToUpdateStatus, idStatCustomer: selectedStatus };
      await axios.put(
        `${API_BASE}/api/customer/${customerToUpdateStatus.idCustomer}`,
        updatedData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Refetch data for the current page
      fetchCustomers();
      closeUpdateStatusModal();
    } catch (error) {
      setError("Gagal memperbarui status pelanggan.");
    }
  };

  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      if (sortOrder === "name_az") return (a.nmCustomer || "").localeCompare(b.nmCustomer || "");
      if (sortOrder === "company_az") return (a.corpCustomer || "").localeCompare(b.corpCustomer || "");
      return 0;
    });
  }, [customers, sortOrder]);

  // Modal handlers
  const handleViewCustomer = (customer) => { setEditingCustomer(customer); setViewModalOpen(true); };
  const handleAddCustomer = () => { setEditingCustomer(null); setFormModalOpen(true); };
  const handleEditCustomer = (customer) => { setEditingCustomer(customer); setFormModalOpen(true); };
  const handleCloseModal = () => { setViewModalOpen(false); setFormModalOpen(false); setEditingCustomer(null); };
  const openUpdateStatusModal = (customer) => { setCustomerToUpdateStatus(customer); setUpdateStatusModalOpen(true); setSelectedStatus(customer.idStatCustomer || ""); };
  const closeUpdateStatusModal = () => { setUpdateStatusModalOpen(false); setCustomerToUpdateStatus(null); setSelectedStatus(""); };
  const handleStatusChange = (e) => setSelectedStatus(e.target.value);

  // --- Render Logic ---
  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!user || !["Sales", "Admin", "Head Sales"].includes(user.role)) return <Navigate to="/login" />;

  const placeholderText = { corpCustomer: "Cari Nama Perusahaan...", nmSales: "Cari Nama Sales..." };

  return (
    <div className="flex-grow p-8 bg-gray-100">
      <header className="flex flex-col md:flex-row justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg mb-6">
        <div className="w-full md:w-auto mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customer Page</h1>
        </div>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center">
          <Menu as="div" className="relative w-full md:w-80 mb-4 md:mb-0 md:mr-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={placeholderText[searchBy] || "Cari..."}
                className="w-full h-10 pl-12 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  {Object.entries({ corpCustomer: "Nama Perusahaan", nmSales: "Nama Sales" }).map(([value, label]) => (
                    <Menu.Item key={value}>
                      {({ active }) => (
                        <button
                          onClick={() => setSearchBy(value)}
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
            {getAvatarUrl(user) ? (
              <img src={getAvatarUrl(user)} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <Initials name={getDisplayName(user)} />
            )}
            <div className="leading-5">
              <div className="text-sm font-bold">{getDisplayName(user)}</div>
              <div className="text-xs text-gray-500">Logged in • {user?.role || "User"}</div>
            </div>
          </div>
        </div>
      </header>

      {user.role === "Sales" ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer</h1>
          <p className="text-gray-600 mb-6">Data Customers</p>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <button onClick={handleAddCustomer} className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
                Tambah Customer
              </button>
              {customers.length > 0 && (
                <button
                  onClick={handleDownloadPdf}
                  className="w-full md:w-auto bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors duration-300 text-center"
                >
                  Export to PDF
                </button>
              )}
            </div>
            <div className="w-full md:w-auto flex items-center">
              <label htmlFor="sortOrder" className="text-gray-700 mr-2">Urutkan:</label>
              <select id="sortOrder" className="w-full md:w-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="name_az">Nama</option>
                <option value="company_az">Perusahaan</option>
              </select>
            </div>
          </div>
          {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
          <CustomerTable customers={sortedCustomers} onViewCustomer={handleViewCustomer} onEditCustomer={handleEditCustomer} />
          {/* Requirement 4: Pagination component receives the correct handler */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Customers</h1>
          <p className="text-gray-600 mb-6">Laporan Data Customers</p>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
              <button onClick={handleAddCustomer} className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300">
                Tambah Customer
              </button>
              {customers.length > 0 && (
                <button
                  onClick={handleDownloadPdf}
                  className="w-full md:w-auto bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors duration-300 text-center"
                >
                  Export to PDF
                </button>
              )}
              <Link to="/sales" className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 text-center">
                View Sales Data
              </Link>
            </div>
            <div className="w-full md:w-auto flex items-center">
              <label htmlFor="sortOrder" className="text-gray-700 mr-2">Urutkan:</label>
              <select id="sortOrder" className="w-full md:w-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="name_az">Nama</option>
                <option value="company_az">Perusahaan</option>
              </select>
            </div>
          </div>
          {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
          <HeadSalesCustomerTable customers={sortedCustomers} onViewCustomer={handleViewCustomer} openUpdateStatusModal={openUpdateStatusModal} />
          {/* Requirement 4: Pagination component receives the correct handler */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      {/* --- Modals --- */}
      {isViewModalOpen && (
        <Modal isOpen={isViewModalOpen} onClose={handleCloseModal} title="Customer Detail">
          <CustomerDetail customer={editingCustomer} />
        </Modal>
      )}
      {isFormModalOpen && (
        <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={editingCustomer ? "Edit Customer" : "Add New Customer"}>
          <CustomerForm initialData={editingCustomer} onSubmit={handleFormSubmit} onClose={handleCloseModal} />
        </Modal>
      )}
      {isUpdateStatusModalOpen && customerToUpdateStatus && (
        <Modal isOpen={isUpdateStatusModalOpen} onClose={closeUpdateStatusModal} title="UPDATE STATUS CUSTOMERS">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="font-semibold text-gray-700">Nama Customer</p><p className="text-gray-500">{customerToUpdateStatus.nmCustomer}</p></div>
              <div><p className="font-semibold text-gray-700">Nomor Telepon</p><p className="text-gray-500">{customerToUpdateStatus.mobileCustomer || "-"}</p></div>
              <div><p className="font-semibold text-gray-700">PIC Sales</p><p className="text-gray-500">{customerToUpdateStatus.nmSales || "-"}</p></div>
              <div><p className="font-semibold text-gray-700">Email Kontak</p><p className="text-gray-500">{customerToUpdateStatus.emailCustomer || "-"}</p></div>
              <div><p className="font-semibold text-gray-700">Perusahaan</p><p className="text-gray-500">{customerToUpdateStatus.corpCustomer || "-"}</p></div>
            </div>
            <div className="mt-6">
              <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status Customer</label>
              <select id="status" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={selectedStatus} onChange={handleStatusChange}>
                <option value="">Pilih Status</option>
                {statusOptions.map((option) => (
                  <option key={option.idStatCustomer} value={option.idStatCustomer}>{option.nmStatCustomer}</option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={closeUpdateStatusModal}>Cancel</button>
              <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleUpdateStatusSubmit}>Update Status</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerPage;