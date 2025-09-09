// frontend/src/components/FeedbackModal.js
import React, { useState, useEffect } from "react";
import Modal from "./Modal";

const FeedbackModal = ({ isOpen, onClose, targetData, userRole, onSubmit }) => {
  const isHeadOfExpert = userRole === "Head of Expert";
  const feedbackText = targetData?.fbTraining || targetData?.fbProject || "";
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFeedback(feedbackText);
    }
  }, [isOpen, feedbackText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(targetData, feedback);
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
            isHeadOfExpert
              ? "Tulis feedback Anda di sini..."
              : "Belum ada feedback."
          }
          className="w-full p-2 border rounded-md min-h-[120px]"
          disabled={!isHeadOfExpert}
        />
        <div className="flex justify-end space-x-2 pt-4">
          {/* Tombol Tutup sudah dihapus dari sini */}
          {isHeadOfExpert && (
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Simpan Feedback
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;
