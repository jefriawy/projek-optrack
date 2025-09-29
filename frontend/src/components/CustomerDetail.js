// frontend/src/componenets/CustomerDetail.js
import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfTemplate from './pdfTemplate';
import { FaDownload, FaUser, FaInfoCircle, FaFileAlt } from 'react-icons/fa';

const CustomerDetail = ({ customer }) => {
  if (!customer) return null;

  // Mapping status dari idStat
const getStatusText = (id) => {
  switch (id) {
    case 1: return { text: 'Review', color: 'bg-yellow-400 text-white' };
    case 2: return { text: 'Approved', color: 'bg-green-500 text-white' };
    case 3: return { text: 'Rejected', color: 'bg-red-500 text-white' };
    default: return { text: '-', color: 'bg-gray-400 text-white' };
  }
};

const idStatValue = customer.idStat ?? customer.idstat ?? customer.idStatCustomer;
const statusInfo = getStatusText(idStatValue);

const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  };


  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-1">DATA PELANGGAN</h1>
      <p className="text-gray-600 mb-6">Laporan Informasi Pelanggan</p>

      {/* Informasi Pelanggan */}
      <div className="mb-6">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaUser className="mr-2" /> Informasi Pelanggan
        </h2>
        <div className="space-y-1">
          <p><strong>Nama</strong> : {customer.nmCustomer}</p>
          <p><strong>Email</strong> : {customer.emailCustomer}</p>
          <p><strong>Phone</strong> : {customer.mobileCustomer || "-"}</p>
          <p><strong>Sales</strong> : {customer.nmSales || "-"}</p>
        </div>
      </div>

      {/* Informasi Bisnis */}
      <div className="mb-6">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaInfoCircle className="mr-2" /> Informasi Bisnis
        </h2>
        <div className="space-y-1">
          <p><strong>Alamat</strong> : {customer.addrCustomer || "-"}</p>
          <p><strong>Perusahaan</strong> : {customer.corpCustomer || "-"}</p>
          <p className="flex items-center">
            <strong>Status</strong> :
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </p>
		  <p><strong>Tanggal Input</strong> : {formatDate(customer.tglInput)}</p>
        </div>
      </div>

      {/* Deskripsi Pelanggan */}
      <div className="mb-8">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaFileAlt className="mr-2" /> Deskripsi Pelanggan
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap">
          {customer.descCustomer || "Tidak ada deskripsi."}
        </p>
      </div>

      {/* Tombol Export */}
      <PDFDownloadLink
        document={<PdfTemplate customer={customer} />}
        fileName={`Laporan_Pelanggan_${customer.nmCustomer}.pdf`}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition duration-300 flex items-center justify-center"
      >
        {({ loading }) =>
          loading ? 'Membuat PDF...' : <><FaDownload className="mr-2" /> Export To PDF</>
        }
      </PDFDownloadLink>
    </div>
  );
};

export default CustomerDetail;