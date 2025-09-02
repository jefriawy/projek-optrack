import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyPerformanceChart = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Add this line
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Monthly Sales Performance (Closed Won)',
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
        y: {
            ticks: {
                // Format the y-axis labels as currency if needed
                callback: function(value, index, values) {
                    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
                }
            }
        }
    }
  };

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.month);
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2);
      return `${month} ${year}`;
    }),
    datasets: [
      {
        label: 'Total Value',
        data: data.map(item => item.totalValue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div style={{ height: '400px' }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default MonthlyPerformanceChart;
