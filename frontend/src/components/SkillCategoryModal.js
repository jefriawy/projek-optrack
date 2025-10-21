// frontend/src/components/SkillCategoryModal.js (MODIFIED: REMOVED STATUS COLUMN)
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const SkillCategoryModal = ({ onClose }) => {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDesc, setNewCategoryDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const token = user?.token;

    const fetchCategories = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError("");
        try {
            // Kita ambil data kategori (endpoint ini sudah mengambil statSkillCtg juga, tapi kita tidak akan merendernya)
            const response = await axios.get(`${API_BASE}/api/skill-categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(response.data); 
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch skill categories:", err);
            setError("Gagal memuat daftar kategori skill.");
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            setError("Nama Kategori tidak boleh kosong.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                nmSkillCtg: newCategoryName.trim(),
                descSkillCtg: newCategoryDesc.trim() || null,
                statSkillCtg: "Active",
            };

            await axios.post(`${API_BASE}/api/skill-categories`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess(`✅ Kategori "${newCategoryName.trim()}" berhasil ditambahkan.`);
            setNewCategoryName("");
            setNewCategoryDesc("");
            fetchCategories(); 
            setTimeout(() => setSuccess(""), 4000);

        } catch (err) {
            console.error("Failed to create skill category:", err.response?.data || err.message);
            const msg = err.response?.data?.error || "Gagal menambahkan kategori. Coba lagi.";
            setError(`❌ ${msg}`);
            setTimeout(() => setError(""), 6000);
        } finally {
            setLoading(false);
        }
    };
    
    const handleDeleteCategory = async (id, name) => {
        if (!window.confirm(`Yakin ingin menghapus kategori: ${name}?`)) return;

        // Note: Fungsionalitas Hapus (DELETE) belum diimplementasikan di backend.
        setError("Fungsionalitas Hapus belum diimplementasikan di Backend.");
        setTimeout(() => setError(""), 5000);
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Tambah Kategori Skill Baru</h3>
            
            <form onSubmit={handleCreateCategory} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Kategori *</label>
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Contoh: Cloud Computing (AWS)"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
                    <textarea
                        value={newCategoryDesc}
                        onChange={(e) => setNewCategoryDesc(e.target.value)}
                        rows="2"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Deskripsi singkat mengenai kategori ini"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    disabled={loading || !newCategoryName.trim()}
                >
                    <FaPlus className="mr-2 h-4 w-4" />
                    {loading ? "Menambahkan..." : "Tambah Kategori"}
                </button>
                {(error || success) && (
                    <p className={`text-sm mt-2 p-2 rounded-md ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {error || success}
                    </p>
                )}
            </form>

            <h3 className="text-xl font-bold text-gray-800 pt-4">Daftar Kategori Skill ({categories.length})</h3>
            
            {loading ? (
                <p className="text-center text-gray-500">Memuat kategori...</p>
            ) : categories.length === 0 ? (
                <p className="text-center text-gray-500 p-4 border rounded-md">Belum ada kategori skill yang terdaftar.</p>
            ) : (
                <div className="overflow-y-auto max-h-80 border rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kategori</th>
                                {/* KOLOM STATUS DIHILANGKAN */}
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((cat) => (
                                <tr key={cat.idSkillCtg}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.nmSkillCtg}</td>
                                    {/* Kolom status dan isinya DIHILANGKAN */}
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                        <button 
                                            onClick={() => handleDeleteCategory(cat.idSkillCtg, cat.nmSkillCtg)}
                                            className="text-red-600 hover:text-red-900 ml-3 disabled:opacity-50"
                                            title="Hapus Kategori"
                                            disabled={loading}
                                        >
                                            <FaTrashAlt className="inline h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="flex justify-end pt-4 border-t">
                <button
                    onClick={onClose}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default SkillCategoryModal;