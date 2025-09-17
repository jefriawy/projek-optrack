// frontend/src/components/FeedbackModal.js
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const FeedbackModal = ({ isOpen, onClose, targetData, canEdit, onSubmit }) => {
  const feedbackText = targetData?.fbTraining || targetData?.fbProject || "";
  // Pastikan fbAttachments adalah array, meskipun dari database berbentuk string JSON
  const attachments = Array.isArray(targetData?.fbAttachments) ? targetData.fbAttachments : [];
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState([]); // State untuk file
  const [isSubmitting, setIsSubmitting] = useState(false); // State untuk loading saat submit

  useEffect(() => {
    if (isOpen) {
      setFeedback(feedbackText);
      setFiles([]); // Reset file saat modal dibuka
    }
  }, [isOpen, feedbackText]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Membuat FormData untuk mengirim file dan teks
    const formData = new FormData();
    formData.append("feedback", feedback);
    files.forEach((file) => {
      formData.append("attachments", file);
    });
    
    await onSubmit(targetData, formData);
    setIsSubmitting(false);
  };
  
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return <FaFilePdf className="text-red-500" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return <FaFileImage className="text-blue-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Feedback - ${targetData?.nmTraining || targetData?.nmProject}`}
    >
      <form onSubmit={handleSubmit} className="p-4">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={
            canEdit
              ? "Tulis feedback Anda di sini..."
              : "Belum ada feedback."
          }
          className="w-full p-2 border rounded-md min-h-[120px]"
          disabled={!canEdit || isSubmitting}
        />
        {/* Tambahkan bagian ini untuk menampilkan lampiran yang sudah ada */}
        {attachments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Lampiran</h4>
            <ul className="space-y-2">
              {attachments.map((fileName, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  {getFileIcon(fileName)}
                  <a href={`${API_BASE}/uploads/feedback/${fileName}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {canEdit && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Lampiran File (Opsional)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gray-50 file:text-gray-700
                hover:file:bg-gray-100"
              disabled={isSubmitting}
            />
            {files.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {files.length} file dipilih.
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-200 transition"
            disabled={isSubmitting}
          >
            Tutup
          </button>
          {canEdit && (
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Feedback"}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;