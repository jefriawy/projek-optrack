// frontend/src/components/SalesRepCustomerChart.js
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

const SalesRepCustomerChart = ({ data }) => {
  const sorted = useMemo(
    () => [...(data || [])].sort((a, b) => (b.customers || 0) - (a.customers || 0)),
    [data]
  );

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={sorted} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="customers">
          <LabelList dataKey="customers" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesRepCustomerChart;
