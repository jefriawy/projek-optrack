// frontend/src/components/OptiTable.js
import pdfIcon from "../iconres/pdf.png";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const OptiTable = ({ optis, onViewOpti, onEditOpti }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // --- TAMBAHAN: Fungsi untuk format Rupiah ---
  const formatRupiah = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "opti entry":
        return "bg-purple-100 text-purple-800";
      case "opti failed":
        return "bg-red-100 text-red-800";
      case "opti on going":
        return "bg-green-100 text-green-800";
      case "po received":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    if (status === "Reject") return "opti failed";
    return status || "-";
  };

  return (
    <div>
      {/* Table for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                NAMA OPTI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                NAMA PERUSAHAAN
              </th>
              {/* --- HAPUS: Kolom Nama Customer ---
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                NAMA CUSTOMER
              </th>
              */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                NAMA SALES
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                NAMA EXPERT
              </th>
              {/* --- TAMBAHAN: Kolom Value --- */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                VALUE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                STATUS OPTI
              </th>
              {/* --- HAPUS: Kolom Dokumen ---
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                DOKUMEN
              </th>
              */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                AKSI
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {optis.length > 0 ? (
              optis.map((opti) => (
                <tr key={opti.idOpti}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {opti.nmOpti}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.corpCustomer || "-"}
                  </td>
                  {/* --- HAPUS: Data Nama Customer ---
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.nmCustomer || "-"}
                  </td>
                  */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.nmSales || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.nmExpert || "-"}
                  </td>
                  {/* --- TAMBAHAN: Data Value --- */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                    {formatRupiah(opti.valOpti)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        opti.statOpti
                      )}`}
                    >
                      {opti.statOpti === "Reject"
                        ? "Failed"
                        : opti.statOpti || "-"}
                    </span>
                  </td>
                  {/* --- HAPUS: Data Dokumen ---
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opti.proposalPath ? (
                      <a
                        href={`${API_BASE}/${opti.proposalPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <img src={pdfIcon} alt="PDF Icon" className="w-6 h-6" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  */}
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => onViewOpti(opti)}
                      className="text-blue-600 hover:text-blue-900 mr-2 px-3 py-1 rounded-md bg-blue-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEditOpti(opti)}
                      className="text-green-600 hover:text-green-900 px-3 py-1 rounded-md bg-green-100"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* --- UPDATE: Colspan disesuaikan menjadi 7 --- */}
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No opportunities match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for small screens */}
      <div className="md:hidden">
        {optis.length > 0 ? (
          optis.map((opti) => (
            <div
              key={opti.idOpti}
              className="bg-white rounded-lg shadow-md mb-4 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {opti.nmOpti}
                  </p>
                  <p className="text-sm text-gray-500">
                    {opti.corpCustomer || "-"}
                  </p>
                </div>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    opti.statOpti
                  )}`}
                >
                  {getStatusText(opti.statOpti)}
                </span>
              </div>
              <div className="mt-4">
                {/* --- HAPUS: Nama Customer ---
                <p className="text-sm text-gray-500">
                  <strong>Customer:</strong> {opti.nmCustomer || "-"}
                </p>
                */}
                <p className="text-sm text-gray-500">
                  <strong>Sales:</strong> {opti.nmSales || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Expert:</strong> {opti.nmExpert || "-"}
                </p>
                {/* --- TAMBAHAN: Value --- */}
                <p className="text-sm text-gray-500 font-semibold">
                  <strong>Value:</strong> {formatRupiah(opti.valOpti)}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Tanggal:</strong> {formatDate(opti.datePropOpti)}
                </p>
                {/* --- HAPUS: Dokumen ---
                <p className="text-sm text-gray-500">
                  <strong>Dokumen:</strong>
                  {opti.proposalPath ? (
                    <a
                      href={`${API_BASE}/${opti.proposalPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      <img src={pdfIcon} alt="PDF Icon" className="w-6 h-6" />
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
                */}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onViewOpti(opti)}
                  className="px-4 py-1 rounded bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 transition"
                >
                  View
                </button>
                <button
                  onClick={() => onEditOpti(opti)}
                  className="px-4 py-1 rounded bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Belum ada data opportunity. Klik "Tambah Opti" untuk memulai.
          </div>
        )}
      </div>
    </div>
  );
};

export default OptiTable;
