import React from "react";

const SalesDetail = ({ sales, onClose }) => {
  if (!sales) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Detail Akun</h2>
        <div className="mb-2">
          <span className="font-semibold">Nama:</span> {sales.nmSales}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Nomor:</span> {sales.mobileSales || "-"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email:</span> {sales.emailSales || "-"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Total Customer:</span> {sales.totalCustomer || 0}
        </div>
        {/* Tambahkan detail lain jika ada */}
      </div>
    </div>
  );
};

export default SalesDetail;
