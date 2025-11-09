// src/components/OutsourceDetailTab.js
import React from "react";
import pdfIcon from "../iconres/pdf.png";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

const fmtDateTime = (v) =>
  v
    ? new Date(v).toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "-";

const diffDays = (start, end) => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (isNaN(s) || isNaN(e)) return null;
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
};

const OutsourceDetailTab = ({ outsource }) => {
  if (!outsource) return null;
  // Status logic for parent modal
  // const now = new Date();
  // const start = outsource.startOutsource ? new Date(outsource.startOutsource) : null;
  // const end = outsource.endOutsource ? new Date(outsource.endOutsource) : null;
  // let status = "-";
  // if (start && now < start) status = "PO Received";
  // else if (start && end && now >= start && now <= end) status = "Outsource On Going";
  // else if (end && now > end) status = "Outsource Delivered";
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="text-sm text-gray-500 mb-2">Jadwal</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Mulai</span>
            <b>{fmtDateTime(outsource.startOutsource)}</b>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Selesai</span>
            <b>{fmtDateTime(outsource.endOutsource)}</b>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Durasi</span>
            <b>{diffDays(outsource.startOutsource, outsource.endOutsource) ?? "-"} hari</b>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-2">Sales</div>
          <div>{outsource.nmSales || "-"}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-2">Human Resource</div>
          <div>{outsource.nmHR || "-"}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-2">Deskripsi</div>
          <div>{outsource.kebutuhan || "Belum ada deskripsi."}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-2">Proposal</div>
          <div>{outsource.proposalOpti || "Belum ada proposal."}</div>
        </div>
      </div>
      {/* Dokumen Outsource jika ada */}
      {/* <div className="rounded-lg border p-4">
        <div className="text-sm text-gray-500 mb-2">Dokumen Outsource</div>
        {outsource.documentOutsource ? (
          <a
            href={`${API_BASE}/uploads/outsource/${outsource.documentOutsource}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black hover:underline flex items-center gap-2"
          >
            <img src={pdfIcon} alt="PDF Icon" className="w-5 h-5" />
            <span>{outsource.documentOutsource}</span>
          </a>
        ) : (
          <div className="text-sm text-gray-700">Belum ada dokumen.</div>
        )}
      </div> */}
    </div>
  );
};

export default OutsourceDetailTab;
