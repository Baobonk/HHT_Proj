// components/charts/ChartNewPlayers.jsx
"use client";

import "../chartConfig";
import { Bar } from "react-chartjs-2";

// newPlayersData: [{ label: "Jan", count: 120 }, ...]
export default function ChartNewPlayers({ newPlayersData = [] }) {
  const labels = newPlayersData.map((x) => x.label);
  const counts = newPlayersData.map((x) => x.count ?? 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Người chơi mới",
        data: counts,
        backgroundColor: "rgba(32, 209, 255, 0.6)",
        borderColor: "#20d1ff",
        borderWidth: 2,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#e5e7eb",
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 15, 15, 0.95)",
        titleColor: "#20d1ff",
        bodyColor: "#ffffff",
        borderColor: "#20d1ff",
        borderWidth: 1.5,
        padding: 10,
        callbacks: {
          label: (ctx) =>
            `${ctx.raw?.toLocaleString?.() ?? ctx.raw} người chơi mới`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
        },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (v) =>
            v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString(),
        },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
  };

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Người chơi mới</h3>
          <p className="chart-subtitle">Số người dùng mới theo tháng</p>
        </div>
      </div>
      <div className="chart-inner">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
