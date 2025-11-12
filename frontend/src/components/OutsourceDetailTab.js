// src/components/OutsourceDetailTab.js
import React, { useState, useContext } from "react";
import AddOutsourcerForm from "./AddOutsourcerForm";
import pdfIcon from "../iconres/pdf.png";
import { AuthContext } from "../context/AuthContext";

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
  const [activeTab, setActiveTab] = useState("detail");
  const { user } = useContext(AuthContext);
  const isHR = user?.role === "HR";
  if (!outsource) return null;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b mb-2">
        <button
          className={`px-4 py-2 -mb-px border-b-2 ${activeTab === "detail" ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500"}`}
          onClick={() => setActiveTab("detail")}
        >
          Detail
        </button>
        {/* Tampilkan tab tambah outsourcer hanya jika user adalah HR */}
        {isHR && (
          <button
            className={`px-4 py-2 -mb-px border-b-2 ${activeTab === "outsourcer" ? "border-blue-600 text-blue-600 font-semibold" : "border-transparent text-gray-500"}`}
            onClick={() => setActiveTab("outsourcer")}
          >
            Tambah Outsourcer
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "detail" && (
        <>
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
        </>
      )}
      {activeTab === "outsourcer" && isHR && (
        <div className="rounded-lg border p-4">
          <AddOutsourcerForm outsourceId={outsource.idOutsource} />
        </div>
      )}
    </div>
  );
};

export default OutsourceDetailTab;
