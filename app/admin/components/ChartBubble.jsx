"use client";

import "./chartConfig";
import { Bubble } from "react-chartjs-2";

export default function ChartBubble({ eloData }) {
  const datasets = [
    {
      label: "ELO Distribution",
      data: (eloData || []).map((item, index) => ({
        x: index * 10 + 10,
        y: item.count || 0,
        r: Math.max(8, Math.sqrt(item.count || 1) * 2),
        label: item.label,
      })),
      backgroundColor: ["#e74c3c", "#9b59b6", "#f1c40f", "#3498db", "#2ecc71"],
    },
  ];

  const data = { datasets };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#f5f5f5",
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const i = ctx.dataIndex;
            const d = eloData?.[i];
            if (!d) return "";
            return `${d.label}: ${d.count} players`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#777" },
        grid: { color: "rgba(255,255,255,0.03)" },
        title: { display: true, text: "Players", color: "#999" },
      },
    },
  };

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">ELO Distribution</h3>
          <p className="chart-subtitle">Players by rating range</p>
        </div>
      </div>
      <div className="chart-inner">
        <Bubble data={data} options={options} />
      </div>
    </div>
  );
}
