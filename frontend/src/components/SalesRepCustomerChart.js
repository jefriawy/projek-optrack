// frontend/src/components/SalesRepCustomerChart.js
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

const SalesRepCustomerChart = ({ data }) => {
  const sortedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => (b.customers || 0) - (a.customers || 0));
  }, [data]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sortedData}
          margin={{ top: 16, right: 24, left: 40, bottom: 16 }} // 👉 kiri diperkecil
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            domain={[0, "dataMax + 1"]}
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            width={80} // 👉 cukup buat teks
          />
          <Tooltip
            contentStyle={{ fontSize: "0.875rem" }}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Bar dataKey="customers" fill="rgba(59, 130, 246, 0.85)" radius={[0, 6, 6, 0]}>
            <LabelList
              dataKey="customers"
              position="insideRight" // 👉 biar angkanya di dalam bar
              fill="#fff"
              fontSize={12}
              offset={8}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesRepCustomerChart;
