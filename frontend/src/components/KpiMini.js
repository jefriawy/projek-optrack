// frontend/src/components/KpiMini.js
import React from "react";

const fmt = (n) => (Number(n || 0)).toLocaleString("id-ID");

const Box = ({ title, value }) => (
  <div className="rounded-lg border border-gray-300 bg-white px-6 py-4 text-center shadow-sm">
    <div className="text-xs font-semibold text-gray-600 tracking-wide">{title}</div>
    <div className="mt-2 text-2xl font-bold text-gray-800">{fmt(value)}</div>
  </div>
);

const KpiMini = ({ totalSales = 0, totalCustomers = 0, totalOpti = 0 }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 max-w-3xl">
      <Box title="Total Sales" value={totalSales} />
      <Box title="Total Opti" value={totalOpti} />
      <Box title="Total Customer" value={totalCustomers} />
    </div>
  );
};

export default KpiMini;
