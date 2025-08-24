// frontend/src/components/OptiDetail.js
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OptiDetailPdf from './OptiDetailPdf';
import { FaDownload, FaUser, FaInfoCircle, FaFileAlt } from 'react-icons/fa';

const OptiDetail = ({ opti }) => {
  if (!opti) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Follow Up':
        return { text: 'Follow Up', color: 'bg-blue-400 text-white' };
      case 'On-Progress':
        return { text: 'On-Progress', color: 'bg-yellow-400 text-white' };
      case 'Success':
        return { text: 'Success', color: 'bg-green-500 text-white' };
      case 'Failed':
        return { text: 'Failed', color: 'bg-red-500 text-white' };
      case 'Just Get Info':
        return { text: 'Just Get Info', color: 'bg-gray-400 text-white' };
      default:
        return { text: '-', color: 'bg-gray-400 text-white' };
    }
  };

  const statusInfo = getStatusInfo(opti.statOpti);

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-1">DETAIL OPPORTUNITY</h1>
      <p className="text-gray-600 mb-6">Laporan Informasi Opportunity</p>

      {/* Informasi Opportunity */}
      <div className="mb-6">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaUser className="mr-2" /> Informasi Opportunity
        </h2>
        <div className="space-y-1">
          <p><strong>Nama Opportunity</strong> : {opti.nmOpti}</p>
          <p><strong>Kontak PIC</strong> : {opti.contactOpti || "-"}</p>
          <p><strong>No. Handphone</strong> : {opti.mobileOpti || "-"}</p>
          <p><strong>Email</strong> : {opti.emailOpti || "-"}</p>
        </div>
      </div>

      {/* Informasi Bisnis */}
      <div className="mb-6">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaInfoCircle className="mr-2" /> Informasi Bisnis
        </h2>
        <div className="space-y-1">
          <p><strong>Perusahaan</strong> : {opti.corpCustomer || "-"}</p>
          <p><strong>Tanggal</strong> : {formatDate(opti.datePropOpti)}</p>
          <p><strong>Sumber</strong> : {opti.nmSumber || "-"}</p>
          <p className="flex items-center">
            <strong>Status</strong> :
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </p>
        </div>
      </div>

      {/* Kebutuhan */}
      <div className="mb-8">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaFileAlt className="mr-2" /> Kebutuhan
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {opti.kebutuhan || "Tidak ada kebutuhan."}
        </p>
      </div>

      {/* Tombol Export */}
      <PDFDownloadLink
        document={<OptiDetailPdf opti={opti} />}
        fileName={`Detail_Opportunity_${opti.nmOpti}.pdf`}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition duration-300 flex items-center justify-center"
      >
        {({ loading }) =>
          loading ? 'Membuat PDF...' : <><FaDownload className="mr-2" /> Export To PDF</>
        }
      </PDFDownloadLink>
    </div>
  );
};

export default OptiDetail;