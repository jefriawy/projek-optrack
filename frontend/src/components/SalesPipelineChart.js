import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = {
  "opti on going": 'rgba(34,197,94,0.8)',       // hijau
  "opti failed": 'rgba(239,68,68,0.8)',        // merah
  "opti entry": 'rgba(168,85,247,0.8)',       // ungu (default for Entry)
  "po received": 'rgba(59,130,246,0.8)',      // biru (default for Received)
};

const SalesPipelineChart = ({ data }) => {
  const labels = data.map((item) => item.statOpti);
  const counts = data.map((item) => item.count);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,         // ⬅️ penting
    elements: { bar: { borderWidth: 0, borderRadius: 12 } },
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
    labels,
    datasets: [
      {
        label: 'Opportunities',
        data: counts,
        backgroundColor: labels.map((l) => COLORS[l] || 'rgba(59,130,246,0.8)'),
      },
    ],
  };

  return (
    // ⬇️ flex item: ikut lebar, tinggi tetap, tanpa card dalam card
    <div className="flex-1 min-w-0 h-64 md:h-80">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default SalesPipelineChart;
