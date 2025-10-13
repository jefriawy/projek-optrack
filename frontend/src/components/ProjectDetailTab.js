// src/components/ProjectDetailTab.js
import React from "react";
import pdfIcon from "../iconres/pdf.png";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

// Helper functions copied from ProjectPage.js for self-containment
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

const IconMap = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="M9 18l6-3 6 3V6l-6-3-6 3-6-3v12l6 3zM9 18V6M15 15V3" />
  </svg>
);

const ProjectDetailTab = ({ project }) => {
  console.log('Props diterima oleh Detail Tab:', { project });
  if (!project) return null;

  // Helper to render a list of documents
  const renderDocumentList = (documents, title, uploadFolder) => (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      {documents && documents.length > 0 ? (
        <ul className="space-y-2">
          {documents.map((doc, index) => (
            <li key={index}>
              <a
                href={`${API_BASE}/uploads/${uploadFolder}/${doc.fileNameStored || doc}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black hover:underline flex items-center gap-2"
              >
                <img src={pdfIcon} alt="PDF Icon" className="w-5 h-5" />
                <span>{doc.fileNameOriginal || doc}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-700">Belum ada dokumen.</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="text-sm text-gray-500 mb-2">Jadwal & Lokasi</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Mulai</span>
            <b>{fmtDateTime(project.startProject)}</b>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Selesai</span>
            <b>{fmtDateTime(project.endProject)}</b>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Durasi</span>
            <b>
              {diffDays(project.startProject, project.endProject) ?? "-"} hari
            </b>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-gray-500">
              <IconMap /> Tempat
            </span>
            <b className="text-right">{project.placeProject || "-"}</b>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border p-4 flex flex-col items-start">
          <div className="text-sm text-gray-500 mb-2">Sales</div>
          <div className="text-sm font-normal text-gray-800">
            {project.nmSales || "-"}
          </div>
        </div>
        <div className="rounded-lg border p-4 flex flex-col justify-center items-start">
          <div className="text-sm text-gray-500 mb-2">Project Manager</div>
          <div className="text-sm font-normal text-gray-800">
            {project.nmPM || "-"}
          </div>
          <div className="text-sm text-gray-500 mt-4 mb-2">Expert</div>
          <div className="text-sm font-normal text-gray-800">
            {Array.isArray(project.experts) && project.experts.length > 0 ? (
              <div className="space-y-1">
                {project.experts.map((e, i) => (
                  <div key={i}>
                    {e.nmExpert || e.name || e.fullName || e.username || "-"}
                  </div>
                ))}
              </div>
            ) : (
              project.nmExpert || project.nmExperts || "-"
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-2">Deskripsi</div>
          <div className="text-sm text-gray-700 leading-6">
            {project.kebutuhan || "Belum ada deskripsi."}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-2">Proposal</div>
          {project.proposalOpti ? (
            <a
              href={`${API_BASE}/uploads/proposals/${project.proposalOpti
                .split(/[\\/]/)
                .pop()}
              }`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-black hover:underline flex items-center gap-2"
            >
              <img src={pdfIcon} alt="PDF Icon" className="w-5 h-5" />
              <span>{project.proposalOpti.split(/[\\/]/).pop()}</span>
            </a>
          ) : (
            <div className="text-sm text-gray-700">Belum ada proposal.</div>
          )}
        </div>
      </div>

      {/* New Document Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderDocumentList(project.project_documents, "Dokumen Project", "project_documents")}
        {renderDocumentList(project.bast_documents, "Dokumen BAST", "bast_project")}
      </div>

      {project.feedback && (
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500 mb-2">Feedback</div>
          <p className="text-sm whitespace-pre-wrap">{project.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailTab;
