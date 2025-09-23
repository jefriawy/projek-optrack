// src/components/OptiDetail.jsx
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OptiDetailPdf from "./OptiDetailPdf";
import {
  FaDownload,
  FaBriefcase,
  FaChalkboardTeacher,
  FaFileAlt,
  FaFileDownload,
  FaInfoCircle,
} from "react-icons/fa";
import pdfIcon from "../iconres/pdf.png";

const TYPE_TRAININGS = [
  { id: 1, name: "Default Training" },
  { id: 2, name: "Public Training" },
  { id: 3, name: "Inhouse Training" },
  { id: 4, name: "Online Training" },
];
const TYPE_PROJECTS = [
  { id: 1, name: "Default Project" },
  { id: 2, name: "Public Project" },
  { id: 3, name: "Inhouse Project" },
  { id: 4, name: "Online Project" },
];

const isBadDate = (v) =>
  !v || v === "0000-00-00 00:00:00" || v === "0000-00-00T00:00";

const OptiDetail = ({ opti }) => {
  if (!opti) return null;

  const formatDate = (dateString) => {
    if (!dateString || isBadDate(dateString)) return "N/A";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || isBadDate(dateTimeString)) return "N/A";
    const d = new Date(dateTimeString);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "opti entry":
        return { text: "Opti Entry", color: "bg-purple-100 text-purple-800" };
      case "opti on going":
        return { text: "On Going", color: "bg-yellow-100 text-yellow-800" };
      case "opti failed":
      case "Reject":
        return { text: "Opti Failed", color: "bg-red-100 text-red-800" };
      case "po received":
        return { text: "PO Received", color: "bg-blue-100 text-blue-800" };
      default:
        return { text: status || "-", color: "bg-gray-100 text-gray-800" };
    }
  };
  const statusInfo = getStatusInfo(opti.statOpti);

  const SpecificDetails = () => {
    const mulai = formatDateTime(opti.startTraining);
    const selesai = formatDateTime(opti.endTraining);
    const lokasi = opti.placeTraining || "-";

    if (opti.jenisOpti === "Training") {
      const typeName =
        TYPE_TRAININGS.find((t) => Number(t.id) === Number(opti.idTypeTraining))
          ?.name || "-";
      return (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="flex items-center text-md font-semibold mb-3 text-gray-700">
            <FaChalkboardTeacher className="mr-2 text-blue-500" />
            Detail Training
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Tipe:</strong> {typeName}
            </p>
            <p>
              <strong>Mulai:</strong> {mulai}
            </p>
            <p>
              <strong>Selesai:</strong> {selesai}
            </p>
            <p>
              <strong>Lokasi:</strong> {lokasi}
            </p>
          </div>
        </div>
      );
    }

    if (opti.jenisOpti === "Project") {
      const typeName =
        TYPE_PROJECTS.find((p) => Number(p.id) === Number(opti.idTypeTraining))
          ?.name || "-";
      return (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="flex items-center text-md font-semibold mb-3 text-gray-700">
            <FaBriefcase className="mr-2 text-green-500" /> Detail Proyek
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Tipe Proyek:</strong> {typeName}
            </p>
            <p>
              <strong>Mulai:</strong> {mulai}
            </p>
            <p>
              <strong>Selesai:</strong> {selesai}
            </p>
            <p>
              <strong>Lokasi:</strong> {lokasi}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">{opti.nmOpti}</h1>
      <p className="text-gray-600 mb-6">
        Laporan Informasi Opportunity untuk{" "}
        <span className="font-semibold">{opti.corpCustomer}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="flex items-center text-lg font-semibold mb-3 border-b pb-2">
            <FaInfoCircle className="mr-2" /> Informasi Utama
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Kontak PIC:</strong> {opti.contactOpti || "-"}
            </p>
            <p>
              <strong>Sales:</strong> {opti.nmSales || "-"}
            </p>
            <p>
              <strong>Trainer:</strong> {opti.nmExpert || "-"}
            </p>
          </div>
        </div>
        <div>
          <h2 className="flex items-center text-lg font-semibold mb-3 border-b pb-2">
            <FaBriefcase className="mr-2" /> Informasi Bisnis
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Perusahaan:</strong> {opti.corpCustomer || "-"}
            </p>
            <p className="flex items-center">
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}
              >
                {statusInfo.text}
              </span>
            </p>
            <p>
              <strong>Sumber:</strong> {opti.nmSumber || "-"}
            </p>
            <p>
              <strong>Tanggal Proposal:</strong> {formatDate(opti.datePropOpti)}
            </p>
          </div>
        </div>
      </div>
      <SpecificDetails />
      <div className="my-8">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaFileAlt className="mr-2" /> Kebutuhan Klien
        </h2>
        <p className="text-gray-700 whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded-md border">
          {opti.kebutuhan || "Tidak ada deskripsi kebutuhan."}
        </p>
      </div>
      <div className="mb-8">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaFileDownload className="mr-2" /> Dokumen Lampiran
        </h2>
        {opti.proposalPath ? (
          <a
            href={`http://localhost:3000/${opti.proposalPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center text-sm"
          >
            <img src={pdfIcon} alt="PDF Icon" className="mr-2 w-5 h-5" />
            {/* Hanya tampilkan nama file tanpa path */}
            {opti.proposalPath.split("/").pop()}
          </a>
        ) : (
          <p className="text-gray-500 text-sm">Tidak ada dokumen Lampiran.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <FaFileDownload className="mr-2" /> Dokumen Pendaftaran
        </h2>
        {opti.dokPendaftaranPath ? (
          <a
            href={`http://localhost:3000/${opti.dokPendaftaranPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center text-sm"
          >
            <img src={pdfIcon} alt="File Icon" className="mr-2 w-5 h-5" />
            {/* Tampilkan nama file dokumen pendaftaran */}
            {opti.dokPendaftaranPath.split("_dokumen_pendaftaran_").pop()}
          </a>
        ) : (
          <p className="text-gray-500 text-sm">
            Belum ada dokumen pendaftaran yang diunggah.
          </p>
        )}
      </div>


      <PDFDownloadLink
        document={<OptiDetailPdf opti={opti} />}
        fileName={`Detail_Opportunity_${opti.nmOpti}.pdf`}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition duration-300 flex items-center justify-center w-full"
      >
        {({ loading }) =>
          loading ? (
            "Membuat PDF..."
          ) : (
            <>
              <FaDownload className="mr-2" /> Export To PDF
            </>
          )
        }
      </PDFDownloadLink>
    </div>
  );
};
export default OptiDetail;
