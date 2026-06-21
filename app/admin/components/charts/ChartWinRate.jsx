// components/charts/ChartWinRate.jsx
"use client";

import "../chartConfig";
import { Bar } from "react-chartjs-2";

const rankColors = {
  iron: "#6b7280",
  bronze: "#d97706",
  silver: "#94a3b8",
  gold: "#fbbf24",
  platinum: "#6ee7b7",
  diamond: "#60a5fa",
  master: "#c084fc",
};

const getRankColor = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("iron")) return rankColors.iron;
  if (l.includes("bronze")) return rankColors.bronze;
  if (l.includes("silver")) return rankColors.silver;
  if (l.includes("gold")) return rankColors.gold;
  if (l.includes("platinum")) return rankColors.platinum;
  if (l.includes("diamond")) return rankColors.diamond;
  return rankColors.master;
};

// winRateData: [{ label: "Bronze", winRate: 48 }, ...]
export default function ChartWinRate({ winRateData = [] }) {
  const labels = winRateData.map((x) => x.label);
  const values = winRateData.map((x) => x.winRate ?? 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Tỉ lệ thắng (%)",
        data: values,
        backgroundColor: labels.map((l) => getRankColor(l) + "dd"),
        borderColor: labels.map((l) => getRankColor(l)),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            `${ctx.label}: ${ctx.raw?.toFixed?.(1) ?? ctx.raw}% tỉ lệ thắng`,
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
        max: 100,
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          callback: (v) => `${v}%`,
        },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
  };

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Tỉ lệ thắng theo Rank</h3>
          <p className="chart-subtitle">Tỉ lệ thắng trung bình theo từng rank</p>
        </div>
      </div>
      <div className="chart-inner">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
