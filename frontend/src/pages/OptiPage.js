// frontend/src/pages/OptiPage.js
import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Modal from "../components/Modal";
import OptiForm from "../components/OptiForm";
import OptiTable from "../components/OptiTable";
import OptiDetail from "../components/OptiDetail";
import OptiListPdf from "../components/OptiListPdf";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";

const OptiPage = () => {
    const { user, loading } = useContext(AuthContext);
    const [optis, setOptis] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("name_asc");
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [editingOpti, setEditingOpti] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const fetchOptis = useCallback(async (searchQuery = "", page = 1) => {
        if (!user?.token) return;
        try {
            const response = await axios.get("http://localhost:3000/api/opti", {
                params: { search: searchQuery, page, limit: 10 },
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setOptis(response.data.data);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error("Error fetching optis:", err.response ? err.response.data : err.message);
        }
    }, [user]);

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
    
    // Initial fetch on component mount
    useEffect(() => {
        fetchOptis();
    }, [fetchOptis]);

    const sortedOptis = useMemo(() => {
        const arr = [...optis];
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
    }, [optis, sortOrder]);

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
            console.error("Error submitting form:", err.response ? err.response.data : err.message);
            alert("Gagal menyimpan data. Periksa konsol untuk detail.");
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        fetchOptis(searchTerm, pageNumber);
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    
    const pdfDocument = sortedOptis.length > 0 ? (
        <OptiListPdf optis={sortedOptis} />
    ) : (
        <Document>
            <Page>
                <Text>No data available</Text>
            </Page>
        </Document>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white rounded-xl shadow p-6 mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Opportunity Page</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search Perusahaan..."
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

            <h2 className="text-2xl font-bold text-gray-800 mb-1">Opportunity</h2>
            <p className="text-gray-600 mb-4">Data Opportunity</p>

            <div className="flex flex-wrap gap-4 mb-4">
                <button
                    onClick={handleAddOpti}
                    className="bg-black text-white px-5 py-2 rounded font-semibold hover:bg-gray-800 transition"
                >
                    Tambah Opportunity
                </button>
                <PDFDownloadLink
                    document={pdfDocument}
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

            <OptiTable
                optis={sortedOptis}
                onViewOpti={handleViewOpti}
                onEditOpti={handleEditOpti}
            />

            <div className="flex justify-center mt-6 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                            page === currentPage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

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
                <OptiDetail opti={editingOpti} />
            </Modal>
        </div>
    );
};

export default OptiPage;