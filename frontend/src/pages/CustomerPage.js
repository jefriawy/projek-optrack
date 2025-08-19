import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CustomerDetail from "../components/CustomerDetail";
import CustomerForm from "../components/CustomerForm";
import Modal from "../components/Modal";
import CustomerListPdf from "../components/CustomerListPdf";
import { AuthContext } from "../context/AuthContext";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import CustomerTable from "../components/CustomerTable"; 
import HeadSalesCustomerTable from "../components/HeadSalesCustomerTable";

const CustomerPage = () => {
    const { user, loading } = useContext(AuthContext);
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("name_az");

    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    // State untuk modal Update Status
    const [isUpdateStatusModalOpen, setUpdateStatusModalOpen] = useState(false);
    const [customerToUpdateStatus, setCustomerToUpdateStatus] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");

    // Debounce untuk search
    useEffect(() => {
        const handler = setTimeout(() => {
            setCompanyFilter(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Fetch data pelanggan
    const fetchCustomers = useCallback(async () => {
        if (user && user.token) {
            try {
                const response = await axios.get(`http://localhost:3000/api/customer`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setCustomers(response.data);
            } catch (err) {
                setError(err.response?.data?.error || "Gagal mengambil data pelanggan.");
            }
        }
    }, [user]);

    // Fetch opsi status
    const fetchStatusOptions = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/customer/status`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setStatusOptions(response.data);
        } catch (error) {
            console.error("Error fetching status options:", error);
            setError("Gagal mengambil opsi status.");
        }
    }, [user]);

    // Panggil semua fungsi fetch saat komponen dimuat
    useEffect(() => {
        fetchCustomers();
        if (user && (user.role === "Head Sales" || user.role === "Admin")) {
            fetchStatusOptions();
        }
    }, [fetchCustomers, fetchStatusOptions, user]);

    // Handler modal
    const handleViewCustomer = (customer) => {
        setEditingCustomer(customer);
        setViewModalOpen(true);
    };

    const handleAddCustomer = () => {
        setEditingCustomer(null);
        setFormModalOpen(true);
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setFormModalOpen(true);
    };

    const handleCloseModal = () => {
        setViewModalOpen(false);
        setFormModalOpen(false);
        setEditingCustomer(null);
    };

    // Handler modal update status
    const openUpdateStatusModal = (customer) => {
        setCustomerToUpdateStatus(customer);
        setUpdateStatusModalOpen(true);
        setSelectedStatus(customer.idStatCustomer || "");
    };

    const closeUpdateStatusModal = () => {
        setUpdateStatusModalOpen(false);
        setCustomerToUpdateStatus(null);
        setSelectedStatus("");
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleUpdateStatusSubmit = async () => {
  if (customerToUpdateStatus && selectedStatus) {
    try {
      // Buat objek data baru dengan semua properti dari customerToUpdateStatus
      // dan timpa hanya properti idStatCustomer dengan nilai yang baru
      const updatedData = {
        ...customerToUpdateStatus,
        idStatCustomer: selectedStatus,
      };

      await axios.put(
        `http://localhost:3000/api/customer/${customerToUpdateStatus.idCustomer}`,
        updatedData, // Kirim seluruh objek yang sudah diperbarui
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      fetchCustomers();
      closeUpdateStatusModal();
    } catch (error) {
      console.error("Error updating customer status:", error);
      setError("Gagal memperbarui status pelanggan.");
    }
  }
};

    const handleFormSubmit = async (formData) => {
        try {
            const method = editingCustomer ? "put" : "post";
            const url = editingCustomer
                ? `http://localhost:3000/api/customer/${editingCustomer.idCustomer}`
                : `http://localhost:3000/api/customer`;

            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            await fetchCustomers();
            handleCloseModal();
        } catch (err) {
            console.error("Failed to submit form:", err);
            setError(err.response?.data?.error || "Failed to save customer.");
        }
    };

    const filteredAndSortedCustomers = useMemo(() => {
        let filtered = customers.filter(c =>
            (c.corpCustomer || '').toLowerCase().includes(companyFilter.toLowerCase()) ||
            (c.nmCustomer || '').toLowerCase().includes(companyFilter.toLowerCase()) ||
            (c.nmSales || '').toLowerCase().includes(companyFilter.toLowerCase())
        );

        return filtered.sort((a, b) => {
            switch (sortOrder) {
                case 'name_az':
                    return (a.nmCustomer || '').localeCompare(b.nmCustomer || '');
                case 'company_az':
                    return (a.corpCustomer || '').localeCompare(b.corpCustomer || '');
                default:
                    return 0;
            }
        });
    }, [customers, companyFilter, sortOrder]);

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!user || !["Sales", "Admin", "Head Sales"].includes(user.role)) return <Navigate to="/login" />;

    return (
        <div className="flex-grow p-8 bg-gray-100">
            {/* Header Konten Utama */}
            <header className="flex justify-between items-center py-4 px-6 bg-white shadow-sm rounded-lg mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Customer Page</h1>
                </div>
                <div className="flex items-center">
                    <div className="relative flex items-center w-64 mr-4">
                        <input
                            type="text"
                            placeholder="Search Perusahaan"
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

            {user.role === "Sales" ? (
                // Tampilan untuk peran Sales (tanpa tabel sales tambahan)
                <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Customer</h1>
                    <p className="text-gray-600 mb-6">Data Customers</p>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddCustomer}
                                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300"
                            >
                                Tambah Customer
                            </button>
                            {customers.length > 0 && (
                                <PDFDownloadLink
                                    key={`${companyFilter}-${sortOrder}`}
                                    document={<CustomerListPdf customers={filteredAndSortedCustomers} />}
                                    fileName={`customer_report_${new Date().toISOString().split('T')[0]}.pdf`}
                                    className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors duration-300"
                                >
                                    {({ loading }) => loading ? 'Preparing PDF...' : 'Export to PDF'}
                                </PDFDownloadLink>
                            )}
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="sortOrder" className="text-gray-700 mr-2">Urutkan:</label>
                            <select
                                id="sortOrder"
                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="name_az">Nama</option>
                                <option value="company_az">Perusahaan</option>
                            </select>
                        </div>
                    </div>
                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
                    {/* Menggunakan CustomerTable biasa untuk peran Sales */}
                    <CustomerTable
                        customers={filteredAndSortedCustomers}
                        onViewCustomer={handleViewCustomer}
                        onEditCustomer={handleEditCustomer}
                    />
                </>
            ) : (
                // Tampilan untuk peran Admin dan Head Sales (dengan tabel sales tambahan)
                <>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Customers</h1>
                    <p className="text-gray-600 mb-6">Laporan Data Customers</p>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                            <button
                                onClick={handleAddCustomer}
                                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300"
                            >
                                Tambah Customer
                            </button>
                            {customers.length > 0 && (
                                <PDFDownloadLink
                                    key={`${companyFilter}-${sortOrder}`}
                                    document={<CustomerListPdf customers={filteredAndSortedCustomers} />}
                                    fileName={`customer_report_${new Date().toISOString().split('T')[0]}.pdf`}
                                    className="bg-red-700 text-white px-6 py-2 rounded-md hover:bg-red-800 transition-colors duration-300"
                                >
                                    {({ loading }) => loading ? 'Preparing PDF...' : 'Export to PDF'}
                                </PDFDownloadLink>
                            )}
                             <Link to="/sales" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                                View Sales Data
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="sortOrder" className="text-gray-700 mr-2">Urutkan:</label>
                            <select
                                id="sortOrder"
                                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="name_az">Nama</option>
                                <option value="company_az">Perusahaan</option>
                            </select>
                        </div>
                    </div>
                    {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
                    {/* Menggunakan HeadSalesCustomerTable untuk Admin dan Head Sales */}
                    <HeadSalesCustomerTable
                        customers={filteredAndSortedCustomers}
                        onViewCustomer={handleViewCustomer}
                        openUpdateStatusModal={openUpdateStatusModal} // Corrected prop name
                    />
                </>
            )}

            {/* Modal untuk View, Add, dan Edit */}
            {isViewModalOpen && (
                <Modal isOpen={isViewModalOpen} onClose={handleCloseModal} title="Customer Detail">
                    <CustomerDetail customer={editingCustomer} />
                </Modal>
            )}
            {isFormModalOpen && (
                <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={editingCustomer ? "Edit Customer" : "Add New Customer"}>
                    <CustomerForm
                        initialData={editingCustomer}
                        onSubmit={handleFormSubmit}
                        onClose={handleCloseModal}
                    />
                </Modal>
            )}

            {/* Modal Update Status Baru */}
            {isUpdateStatusModalOpen && customerToUpdateStatus && (
                <Modal
                    isOpen={isUpdateStatusModalOpen}
                    onClose={closeUpdateStatusModal}
                    title="UPDATE STATUS CUSTOMERS"
                >
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-semibold text-gray-700">Nama Customer</p>
                                <p className="text-gray-500">{customerToUpdateStatus.nmCustomer}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Nomor Telepon</p>
                                <p className="text-gray-500">{customerToUpdateStatus.mobileCustomer || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">PIC Sales</p>
                                <p className="text-gray-500">{customerToUpdateStatus.nmSales || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Email Kontak</p>
                                <p className="text-gray-500">{customerToUpdateStatus.emailCustomer || "-"}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Perusahaan</p>
                                <p className="text-gray-500">{customerToUpdateStatus.corpCustomer || "-"}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                                Status Customer
                            </label>
                            <select
                                id="status"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                            >
                                <option value="">Pilih Status</option>
                                {statusOptions.map((option) => (
                                    <option key={option.idStatCustomer} value={option.idStatCustomer}>
                                        {option.nmStatCustomer}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={closeUpdateStatusModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={handleUpdateStatusSubmit}
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CustomerPage;
