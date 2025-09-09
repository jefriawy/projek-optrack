import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const OpportunityTypePie = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,        // ⬅️ penting
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Opportunity Types Breakdown' },
      datalabels: {
        formatter: (value, ctx) => {
          const ds = ctx?.chart?.data?.datasets?.[0]?.data || [];
          const sum = ds.reduce((a, b) => a + (Number(b) || 0), 0);
          if (!sum) return '0%';
          return ((value * 100) / sum).toFixed(1) + '%';
        },
        color: '#fff',
        font: { weight: 'bold' },
      },
    },
  };

  const chartData = {
    labels: data.map((item) => item.jenisOpti),
    datasets: [
      {
        label: '# of Opportunities',
        data: data.map((item) => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    // ⬇️ flex item: ikut lebar, tinggi tetap, tanpa card dalam card
    <div className="flex-1 min-w-0 h-64 md:h-80">
      <Pie options={options} data={chartData} />
    </div>
  );
};

export default OpportunityTypePie;
