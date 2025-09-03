// frontend/src/components/SalesPipelineChart.js
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesPipelineChart = ({ data }) => {
  const options = {
    indexAxis: 'y',
    responsive: true,
    elements: { bar: { borderWidth: 1, maxBarThickness: 36 } },
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Current Sales Pipeline by Status' },
      tooltip: { enabled: true },
    },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  const chartData = {
    labels: (data || []).map(i => i.statOpti),
    datasets: [
      {
        label: 'Opportunities',
        data: (data || []).map(i => i.count),
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default SalesPipelineChart;
