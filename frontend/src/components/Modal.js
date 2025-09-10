// src/components/Modal.js
import React, { useEffect, useCallback } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = false,
  closeOnEsc = false,
  maxWidthClass = "sm:max-w-md md:max-w-lg lg:max-w-2xl",
}) => {
  // ESC to close (opsional saja)
  const handleEsc = useCallback(
    (e) => {
      if (!closeOnEsc) return;
      if (e.key === "Escape") onClose?.();
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleEsc);
    // Kunci scroll saat modal terbuka
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = original;
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  // Klik backdrop hanya menutup jika diizinkan
  const handleBackdropClick = () => {
    if (closeOnBackdrop) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-[1px] p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidthClass} max-h-[90vh] flex flex-col animate-fadeIn`}
        onClick={(e) => e.stopPropagation()} // klik dalam modal tidak tembus ke backdrop
      >
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <FaTimes size={20} />
          </button>
        </header>

        {/* Body */}
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:.001 } to { opacity:1 } }
        .animate-fadeIn { animation: fadeIn .16s ease both; }
      `}</style>
    </div>
  );
};

export default Modal;
