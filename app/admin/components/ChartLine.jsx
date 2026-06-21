// components/ChartLine.jsx
"use client";

import "./chartConfig";
import { Line } from "react-chartjs-2";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

export default function ChartLine({ chartData }) {
  const labels = chartData?.labels || [];
  const values = chartData?.data || [];

  // =========================
  // Tính toán trend (tăng/giảm)
  // =========================
  const firstValue = values[0] || 0;
  const lastValue = values[values.length - 1] || 0;

  let trend = "flat";
  let percentChange = 0;

  if (values.length >= 2 && firstValue !== 0) {
    const rawChange = ((lastValue - firstValue) / firstValue) * 100;
    percentChange = Number(rawChange.toFixed(1));

    if (rawChange > 0) trend = "up";
    else if (rawChange < 0) trend = "down";
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Matches Played",
        data: values,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(251, 146, 60, 0.15)",
        borderWidth: 3.5,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#f59e0b",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 3,
        tension: 0.45,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 15, 15, 0.96)",
        titleColor: "#f59e0b",
        bodyColor: "#ffffff",
        borderColor: "#f59e0b",
        borderWidth: 2,
        cornerRadius: 14,
        padding: 14,
        displayColors: false,
        titleFont: { size: 15, weight: "bold" },
        bodyFont: { size: 16 },
        callbacks: {
          title: (ctx) => ctx[0].label,
          label: (ctx) => `${ctx.parsed.y.toLocaleString()} matches`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          maxTicksLimit: 10,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          callback: (value) =>
            value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
    animation: {
      duration: 2200,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="card chart-card group relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-600/5 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="chart-header flex justify-between items-start">
        <div>
          <h3 className="chart-title flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            Matches Overview
          </h3>
          <p className="chart-subtitle mt-1">
            Last 6 months • Daily average
          </p>
        </div>

        {/* Trend badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm border ${
            trend === "up"
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : trend === "down"
              ? "bg-red-500/15 text-red-400 border-red-500/30"
              : "bg-gray-500/15 text-gray-400 border-gray-500/30"
          }`}
        >
          {trend === "up" && <TrendingUp className="w-4 h-4" />}
          {trend === "down" && <TrendingDown className="w-4 h-4" />}
          {trend === "flat" && (
            <div className="w-4 h-1 bg-current rounded-full" />
          )}
          <span>{Math.abs(percentChange)}%</span>
        </div>
      </div>

      <div className="chart-inner relative">
        <Line data={data} options={options} />

        {/* Bottom shine line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      </div>

      {/* Hover glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </div>
  );
}
