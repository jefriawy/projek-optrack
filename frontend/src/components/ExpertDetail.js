// frontend/src/components/ExpertDetail.js
import React from "react";

const ExpertDetail = ({ expert, onClose }) => {
  if (!expert) return null;

  // Function to render skills list (assuming expert.skills is now comma-separated string)
  const renderSkills = (skillsString) => {
    if (!skillsString) {
      return <span>-</span>;
    }
    const skillsArray = skillsString.split(", ");
    return (
      <div className="flex flex-wrap gap-1">
        {skillsArray.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

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
          <span className="font-semibold">Nama:</span> {expert.nmExpert}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Role:</span> {expert.role || "Expert"}{" "}
          {/* Display Role */}
        </div>
        {/* Display Skills */}
        <div className="mb-2">
          <span className="font-semibold block mb-1">Skills:</span>
          {renderSkills(expert.skills)}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Nomor:</span>{" "}
          {expert.mobileExpert || "-"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email:</span>{" "}
          {expert.emailExpert || "-"}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Total Project:</span>{" "}
          {expert.totalProjects || 0}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Status:</span>{" "}
          {expert.statExpert || "-"}
        </div>
        {/* Add Notes (Row) if available */}
        {expert.Row && (
          <div className="mb-2 mt-3 pt-3 border-t">
            <span className="font-semibold block mb-1">Notes:</span>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
              {expert.Row}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDetail;
