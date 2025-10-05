import React, { useState, useRef, useCallback, useEffect, useContext } from "react";
import axios from "axios";
import { FaUpload, FaFilePdf, FaFileImage, FaFileAlt, FaTrashAlt } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const BastUploadForm = ({ projectId, onUploaded, onClose }) => {
  const { user } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch dokumen BAST yang sudah diupload
  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.get(
        `${API_BASE}/api/project/${projectId}/bast`,
        {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
        }
      );
      setExistingDocuments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("No token provided / Unauthorized");
      } else {
        setError("Gagal memuat daftar dokumen BAST.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [projectId, user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) setSelectedFile(files[0]);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("bast", selectedFile);
    try {
      setError("");
      await axios.post(`${API_BASE}/api/project/${projectId}/bast`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      setSelectedFile(null);
      setUploadProgress(0);
      fetchDocuments();
      if (onUploaded) onUploaded();
      // Jangan tutup otomatis agar user bisa lihat hasilnya
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengunggah BAST.");
      setUploadProgress(0);
    }
  };

  const handleDelete = async (idDocument) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus dokumen BAST ini?")) return;
    try {
      setError("");
      await axios.delete(`${API_BASE}/api/project/bast/${idDocument}`, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menghapus dokumen BAST.");
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(extension)) return <FaFilePdf className="text-red-500 text-xl" />;
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return <FaFileImage className="text-blue-500 text-xl" />;
    return <FaFileAlt className="text-gray-500 text-xl" />;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Upload Dokumen BAST</h3>
      <div
        className={`rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging ? "bg-gray-50 border-blue-400" : "bg-white border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current && inputRef.current.click()}
        role="button"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="min-h-[120px] flex flex-col items-center justify-center text-center">
          {!selectedFile ? (
            <>
              <div className="text-gray-400 text-sm">
                <div className="text-lg font-medium mb-2">Drag & drop file BAST di sini</div>
                <div className="mb-2">atau klik untuk memilih file</div>
                <div className="text-xs text-gray-500">PDF, JPG, PNG. Klik area untuk membuka dialog file.</div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-green-600 font-medium mb-1">File terpilih:</div>
              <div className="max-h-20 overflow-auto text-sm text-green-700">
                {selectedFile.name}
              </div>
              <div className="text-xs text-gray-500 mt-2">Klik area untuk mengubah pilihan file.</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end items-center gap-3">
        <button
          onClick={() => {
            setSelectedFile(null);
            if (inputRef.current) inputRef.current.value = null;
          }}
          className="px-4 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-100"
        >
          Batalkan Pilihan
        </button>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploadProgress > 0}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <FaUpload />
          {uploadProgress > 0 ? `Mengunggah... ${uploadProgress}%` : "Upload BAST"}
        </button>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <h4 className="text-lg font-semibold mb-2">Dokumen BAST Tersimpan</h4>
        {isLoading ? (
          <p>Memuat...</p>
        ) : (
          <div className="space-y-3">
            {existingDocuments.length > 0 ? (
              existingDocuments.map((doc) => (
                <div
                  key={doc.idDocument}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.fileNameOriginal)}
                    <div>
                      <a
                        href={`${API_BASE}/uploads/bast/${doc.fileNameStored}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {doc.fileNameOriginal}
                      </a>
                      <p className="text-xs text-gray-500">
                        diunggah oleh {doc.uploadedByName || "User"} pada {new Date(doc.uploadTimestamp).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.idDocument)}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-full"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Belum ada dokumen BAST yang diunggah.</p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-100"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default BastUploadForm;
