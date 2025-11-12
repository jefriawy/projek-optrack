// frontend/src/components/CreateUserButton.js (KODE DIPERBAIKI)
import React, { useState, useEffect, useRef } from "react";

const roles = [
  { name: "Admin", type: "Admin" },
  { name: "Sales", type: "Sales" },
  { name: "Expert/Trainer", type: "Expert" },
  { name: "Akademik", type: "Akademik" },
  { name: "Project Manager", type: "PM" },
  { name: "Human Resource", type: "HR" },
  { name: "Outsourcer", type: "Outsourcer" },
];

const CreateUserButton = ({ onRoleSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleRoleSelect = (type) => {
    // 1. Panggil fungsi dari parent untuk membuka modal
    onRoleSelect(type);
    // 2. Tutup dropdown
    setIsOpen(false);
  };

  // Handler untuk menutup dropdown saat klik di luar area tombol/dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left z-20" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out text-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen ? "true" : "false"}
        aria-haspopup="true"
      >
        + User
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {roles.map((role) => (
              <button
                key={role.type}
                // Perbaikan utama: memastikan klik memanggil handleRoleSelect
                onClick={() => handleRoleSelect(role.type)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hapus overlay fixed inset-0 karena sudah digantikan oleh useEffect untuk menutup saat klik di luar */}
    </div>
  );
};

export default CreateUserButton;
