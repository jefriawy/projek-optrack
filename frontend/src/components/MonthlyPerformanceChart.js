// frontend/src/components/MonthlyPerformanceChart.js
import React, { useMemo, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const IDR = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const MonthlyPerformanceChart = ({ data = [] }) => {
  const canvasRef = useRef(null);

  // labels & values yang rapi
  const { labels, values } = useMemo(() => {
    const lbl = [];
    const val = [];
    for (const item of data) {
      const d = new Date(item.month);
      const m = d.toLocaleString("en-US", { month: "short" });
      const y = d.getFullYear().toString().slice(-2);
      lbl.push(`${m} ${y}`);
      val.push(Number(item.totalValue || 0));
    }
    return { labels: lbl, values: val };
  }, [data]);

  // gradient fill yang responsif terhadap resize
  const gradient = useMemo(() => {
    const ctx = canvasRef.current?.getContext?.("2d");
    if (!ctx) return null;
    const g = ctx.createLinearGradient(0, 0, 0, 320);
    g.addColorStop(0, "rgba(59, 130, 246, 0.25)"); // biru-500 25%
    g.addColorStop(1, "rgba(59, 130, 246, 0.02)");
    return g;
  }, [canvasRef.current, labels.length]); // re-run jika canvas/ukuran berubah

  useEffect(() => {
    // trigger re-render gradient saat container berubah ukuran
  }, [gradient]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly Sales Performance (Closed Won)" },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${IDR.format(ctx.parsed.y || 0)}`,
        },
      },
    },
    interaction: { mode: "index", intersect: false },
    elements: {
      line: { tension: 0.35, borderWidth: 2 },
      point: { radius: 3, hoverRadius: 5, hitRadius: 8 },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.06)" },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
          callback: (v) => IDR.format(v),
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Value",
        data: values,
        borderColor: "rgba(59, 130, 246, 1)",       // blue-500
        backgroundColor: gradient || "rgba(59,130,246,0.15)",
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(59,130,246,1)",
      },
    ],
  };

  return (
    <div className="w-full h-80 md:h-96"> {/* tinggi fleksibel */}
      <Line ref={canvasRef} options={options} data={chartData} />
    </div>
  );
};

export default MonthlyPerformanceChart;
