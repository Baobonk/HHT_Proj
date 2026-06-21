// components/charts/ChartMatchResult.jsx
"use client";

import "../chartConfig";
import { Doughnut } from "react-chartjs-2";

// resultData: { win: 1200, lose: 900, draw: 300 }
export default function ChartMatchResult({
  resultData = { win: 0, lose: 0, draw: 0 },
}) {
  const labels = ["Thắng", "Thua", "Hòa"];
  const values = [
    resultData.win ?? 0,
    resultData.lose ?? 0,
    resultData.draw ?? 0,
  ];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "rgba(34, 197, 94, 0.9)", // Win
          "rgba(239, 68, 68, 0.9)", // Lose
          "rgba(234, 179, 8, 0.9)", // Draw
        ],
        borderColor: ["#22c55e", "#ef4444", "#eab308"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#e5e7eb",
          font: { size: 11 },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 12,
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
          label: (ctx) => {
            const total = values.reduce((a, b) => a + b, 0) || 1;
            const v = ctx.raw ?? 0;
            const percent = ((v / total) * 100).toFixed(1);
            return `${ctx.label}: ${v.toLocaleString()} trận (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Kết quả trận đấu</h3>
          <p className="chart-subtitle">Tỉ lệ Thắng / Thua / Hòa</p>
        </div>
      </div>
      <div className="chart-inner">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
