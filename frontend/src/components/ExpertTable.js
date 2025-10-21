// frontend/src/components/ExpertTable.js
import React, { useState } from "react";
// Removed FaDownload, FaCommentDots for simplicity, keep FaEye if Detail modal is used
import { FaEye } from "react-icons/fa";
import ExpertDetail from "./ExpertDetail"; // Keep if detail modal is needed
// PDF functionality removed for brevity, can be added back if needed

const ExpertTable = ({ experts }) => {
  const [selectedExpert, setSelectedExpert] = useState(null);

  // Helper to display skills (assuming 'skills' is comma-separated string from backend)
  const displaySkills = (skillsString) => {
    if (!skillsString) return "-";
    // Optional: Limit the number of skills shown directly in the table
    const skillsArray = skillsString.split(", ");
    if (skillsArray.length > 2) {
      return `${skillsArray.slice(0, 2).join(", ")}, ...`;
    }
    return skillsString;
  };

  return (
    <div>
      {/* Table for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Role
              </th>{" "}
              {/* Added Role */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Skills
              </th>{" "}
              {/* Changed from Skill */}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Nomor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Total Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {experts.length > 0 ? (
              experts.map((item) => (
                <tr key={item.idExpert}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {item.nmExpert}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.role || "Expert"}
                  </td>{" "}
                  {/* Display Role */}
                  {/* Display multiple skills */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-xs">
                    {displaySkills(item.skills)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.mobileExpert || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.emailExpert || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-center">
                    {item.totalProjects || "0"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {item.statExpert || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    {/* View Button - can show full skills in detail */}
                    <button
                      onClick={() => setSelectedExpert(item)}
                      className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                      title="Lihat Detail"
                    >
                      <FaEye />
                    </button>
                    {/* Chat Button */}
                    <button
                      onClick={() =>
                        window.open(
                          `https://wa.me/${item.mobileExpert}`,
                          "_blank"
                        )
                      }
                      className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                      title="Chat via WhatsApp"
                      disabled={!item.mobileExpert} // Disable if no number
                    >
                      CHAT
                    </button>
                    {/* PDF Download removed for simplicity */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {" "}
                  {/* Adjusted colspan */}
                  Tidak ada data expert/trainer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden">
        {experts.length > 0 ? (
          experts.map((item) => (
            <div
              key={item.idExpert}
              className="bg-white rounded-lg shadow-md mb-4 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {item.nmExpert}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {item.role || "Expert"}
                  </p>{" "}
                  {/* Show Role */}
                  <p className="text-sm text-gray-500">
                    {item.mobileExpert || "-"}
                  </p>
                </div>
                <span className="text-xs text-gray-600">
                  Projects: {item.totalProjects || 0}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  <strong>Email:</strong> {item.emailExpert || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {item.statExpert || "-"}
                </p>
                {/* Display Skills */}
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Skills:</strong> {displaySkills(item.skills)}
                </p>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedExpert(item)}
                  className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition text-xs"
                  title="Lihat Detail"
                >
                  <FaEye className="inline mr-1" /> View
                </button>
                <button
                  onClick={() =>
                    window.open(`https://wa.me/${item.mobileExpert}`, "_blank")
                  }
                  className="px-3 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition text-xs"
                  title="Chat via WhatsApp"
                  disabled={!item.mobileExpert}
                >
                  CHAT
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Tidak ada data expert/trainer.
          </div>
        )}
      </div>

      {/* Modal Detail Expert (can be enhanced to show full skill list) */}
      {selectedExpert && (
        <ExpertDetail
          expert={selectedExpert}
          onClose={() => setSelectedExpert(null)}
        />
      )}
    </div>
  );
};

export default ExpertTable;
