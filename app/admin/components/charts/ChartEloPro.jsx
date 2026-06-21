// components/charts/ChartEloPro.jsx
"use client";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Bubble } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Filler);

const rankColors = {
  iron: "#6b7280",
  bronze: "#d97706",
  silver: "#94a3b8",
  gold: "#fbbf24",
  platinum: "#6ee7b7",
  diamond: "#60a5fa",
  master: "#c084fc",
};

const getRankColor = (label) => {
  const l = label.toLowerCase();
  if (l.includes("iron")) return rankColors.iron;
  if (l.includes("bronze")) return rankColors.bronze;
  if (l.includes("silver")) return rankColors.silver;
  if (l.includes("gold")) return rankColors.gold;
  if (l.includes("platinum")) return rankColors.platinum;
  if (l.includes("diamond")) return rankColors.diamond;
  return rankColors.master;
};

export default function ChartEloPro({ eloData = [] }) {
  const sortedData = [...eloData].sort((a, b) => {
    const eloA = parseInt(a.label) || 0;
    const eloB = parseInt(b.label) || 0;
    return eloA - eloB;
  });

  const getEloValue = (label) => {
    const num = parseInt(label);
    if (!isNaN(num)) return num;
    if (label.includes("Master")) return 2800;
    if (label.includes("Diamond")) return 2200;
    if (label.includes("Platinum")) return 1900;
    if (label.includes("Gold")) return 1600;
    if (label.includes("Silver")) return 1300;
    if (label.includes("Bronze")) return 1000;
    if (label.includes("Iron")) return 700;
    return 800;
  };

  const bubbleData = sortedData.map((item) => ({
    x: getEloValue(item.label),
    y: item.count,
    r: Math.max(18, Math.min(70, Math.sqrt(item.count) * 4.2)),
    count: item.count,
    label: item.label,
    color: getRankColor(item.label),
  }));

  const lineData = sortedData.map((item) => ({
    x: getEloValue(item.label),
    y: item.count,
  }));

  const data = {
    datasets: [
      {
        type: "line",
        label: "Xu hướng phân bố người chơi",
        data: lineData,
        borderColor: "#20d1ff",
        backgroundColor: (ctx) => {
          if (!ctx.chart.chartArea) return;
          const { ctx: canvasCtx, chartArea } = ctx.chart;
          const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(32, 209, 255, 0.35)");
          gradient.addColorStop(0.4, "rgba(32, 209, 255, 0.15)");
          gradient.addColorStop(1, "rgba(32, 209, 255, 0)");
          return gradient;
        },
        borderWidth: 4,
        pointRadius: 0,
        tension: 0.5,
        fill: true,
      },
      {
        type: "bubble",
        label: "Người chơi theo Rank",
        data: bubbleData,
        backgroundColor: bubbleData.map((d) => d.color + "e6"),
        borderColor: bubbleData.map((d) => d.color),
        borderWidth: 3.5,
        hoverBackgroundColor: "#ffffff",
        hoverBorderWidth: 6,
        hoverBorderColor: "#20d1ff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "nearest", intersect: false },
    plugins: {
      legend: { display: false }, // Tắt legend mặc định
      tooltip: {
        backgroundColor: "rgba(15, 15, 15, 0.97)",
        titleColor: "#20d1ff",
        bodyColor: "#ffffff",
        borderColor: "#20d1ff",
        borderWidth: 2,
        cornerRadius: 16,
        padding: 16,
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 15 },
        displayColors: false,
        callbacks: {
          title: (ctx) => ctx[0].raw.label || "Không xác định",
          label: (ctx) => {
            if (ctx.dataset.type === "bubble") {
              return `Người chơi: ${ctx.raw.count.toLocaleString("vi-VN")}`;
            }
            return `Xu hướng: ${ctx.parsed.y.toLocaleString("vi-VN")} người`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear",
        min: 600,
        max: 3000,
        ticks: {
          color: "#94a3b8",
          font: { size: 13 },
          stepSize: 300,
        },
        title: {
          display: true,
          text: "Điểm ELO",
          color: "#20d1ff",
          font: { size: 16, weight: "bold" },
          padding: { top: 10, bottom: 10 },
        },
        grid: { color: "rgba(255, 255, 255, 0.08)" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#94a3b8",
          font: { size: 13 },
          callback: (value) => (value >= 1000 ? `${value / 1000}k` : value),
        },
        title: {
          display: true,
          text: "Số lượng người chơi",
          color: "#20d1ff",
          font: { size: 16, weight: "bold" },
          padding: { top: 10, bottom: 10 },
        },
        grid: { color: "rgba(255, 255, 255, 0.08)" },
      },
    },
    animation: {
      duration: 2400,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="card chart-card elo-chart-pro bg-dark border-0 shadow-xl rounded-4 overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h3 className="text-white fw-bold mb-2 fs-4">Biểu đồ ELO nâng cao</h3>
            <p className="text-muted small mb-0">
              Phân tích mật độ & phân bố người chơi theo Rank (thời gian thực)
            </p>
          </div>
          <span className="badge bg-success text-white px-4 py-2 rounded-pill fw-bold shadow-sm">
            Live
          </span>
        </div>

        {/* Legend thủ công - ĐẸP & KHÔNG BAO GIỜ BỊ DÍNH */}
        <div className="d-flex flex-wrap justify-content-center gap-5 mt-4 pt-3 border-top border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle shadow-sm"
              style={{ width: 18, height: 18, background: "#20d1ff" }}
            ></div>
            <span className="text-light fw-semibold">Xu hướng phân bố người chơi</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle shadow-sm"
              style={{ width: 18, height: 18, background: "#c084fc" }}
            ></div>
            <span className="text-light fw-semibold">Người chơi theo Rank</span>
          </div>
        </div>
      </div>

      {/* Biểu đồ - có padding trên để không bị đè */}
      <div
        className="position-relative"
        style={{ height: "400px", paddingTop: "0px" }}
      >
        <Bubble data={data} options={options} />
      </div>
    </div>
  );
}