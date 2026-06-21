// components/charts/ChartEloPie.jsx
"use client";

import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const rankColors = [
  "#ef4444", // Iron - đỏ
  "#f97316", // Bronze - cam
  "#eab308", // Silver - vàng nhạt
  "#3b82f6", // Gold - xanh dương
  "#8b5cf6", // Platinum - tím
  "#10b981", // Diamond - xanh lá
  "#a78bfa", // Master+ - tím nhạt
];

export default function ChartEloPie({ eloData = [] }) {
  const sortedData = [...eloData].sort((a, b) => {
    const order = [
      "Iron",
      "Bronze",
      "Silver",
      "Gold",
      "Platinum",
      "Diamond",
      "Master",
    ];
    return (
      order.indexOf(a.label.split(" ")[0]) -
      order.indexOf(b.label.split(" ")[0])
    );
  });

  const labels = sortedData.map((item) => item.label);
  const values = sortedData.map((item) => item.count || 0);
  const total = values.reduce((a, b) => a + b, 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Người chơi",
        data: values,
        backgroundColor: rankColors,
        borderColor: "#1f1f1f",
        borderWidth: 3,
        hoverOffset: 30,
        hoverBorderWidth: 5,
        hoverBorderColor: "#20d1ff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          color: "#ffffff",
          font: { size: 13, weight: "600", family: "Inter" },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          generateLabels: (chart) => {
            const data = chart.data;
            if (!data.labels.length) return [];
            return data.labels.map((label, i) => {
              const value = data.datasets[0].data[i];
              const percentage =
                total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return {
                text: `${label} • ${value.toLocaleString()} người chơi (${percentage}%)`,
                fillStyle: rankColors[i],
                strokeStyle: rankColors[i],
                fontColor: "#ffffff",
                color: "#ffffff",
                hidden: false,
                index: i,
              };
            });
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 15, 15, 0.95)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#20d1ff",
        borderWidth: 2,
        cornerRadius: 16,
        padding: 14,
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed || 0;
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(2) : 0;
            return `${value.toLocaleString()} người chơi (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="card chart-card pie-chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Phân bố người chơi theo Rank</h3>
          <p className="chart-subtitle">
            Tỉ lệ phần trăm theo Rank • Tổng: {total.toLocaleString()} người
            chơi
          </p>
        </div>
        <div className="live-badge">Live</div>
      </div>

      <div className="chart-inner flex items-center justify-center">
        {/* Có thể đổi thành <Pie /> nếu muốn biểu đồ tròn đầy */}
        <Doughnut data={data} options={options} />
      </div>

      <div className="mt-4 text-center">
        <span className="text-3xl font-bold text-cyan-400">
          {total.toLocaleString()}
        </span>
        <p className="text-sm text-gray-400 mt-1">
          Tổng số người chơi đang hoạt động
        </p>
      </div>
    </div>
  );
}
