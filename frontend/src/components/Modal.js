// frontend/src/components/Modal.js
import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, title, children }) => {
  // Tutup modal dengan tombol ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose} // klik backdrop nutup
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] flex flex-col animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // biar klik dalam modal gak nutup
      >
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <FaTimes size={20} />
          </button>
        </header>

        {/* Body */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Modal;