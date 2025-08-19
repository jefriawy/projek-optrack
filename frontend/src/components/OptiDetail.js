// frontend/src/components/OptiDetail.js
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OptiDetailPdf from "./OptiDetailPdf";

const OptiDetail = ({ opti }) => {
  if (!opti) return null;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID");

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-bold text-lg">{opti.nmOpti}</h3>
        <p className="text-sm text-gray-500">Perusahaan: {opti.nmCustomer}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <p>
          <strong>Nama Kontak PIC:</strong> {opti.contactOpti || "-"}
        </p>
        <p>
          <strong>Tanggal:</strong> {formatDate(opti.datePropOpti)}
        </p>
        <p>
          <strong>Sumber:</strong> {opti.nmSumber || "-"}
        </p>
      </div>
      <div className="pt-6 flex justify-end">
        <PDFDownloadLink
          document={<OptiDetailPdf opti={opti} />}
          fileName={`detail_opti_${opti.nmOpti || 'opti'}.pdf`}
          className="bg-black text-white px-5 py-2 rounded font-semibold hover:bg-gray-800 transition"
        >
          {({ loading }) => loading ? "Membuat PDF..." : "Export PDF"}
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default OptiDetail;