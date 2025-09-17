import React from "react";

const AkademikDetail = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Detail Akun Akademik</h2>
        <div className="mb-2">
          <span className="font-semibold">Nama:</span> {user.nmAkademik || user.name}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Nomor:</span> {user.mobileAkademik || "-"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email:</span> {user.emailAkademik || user.email || "-"}
        </div>
      </div>
    </div>
  );
};

export default AkademikDetail;