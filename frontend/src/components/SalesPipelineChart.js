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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesPipelineChart = ({ data }) => {
  const options = {
    indexAxis: 'y', // This makes the bar chart horizontal
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false, // We can hide the legend if there's only one dataset
      },
      title: {
        display: true,
        text: 'Current Sales Pipeline by Status',
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: false,
      },
    },
  };

  const chartData = {
    labels: data.map(item => item.statOpti),
    datasets: [
      {
        label: 'Opportunities',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
