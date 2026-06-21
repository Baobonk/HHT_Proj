// app/admin/page.jsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Card from "./components/Card";

// Import các chart bằng dynamic, tắt SSR để tránh window is not defined
const ChartLine = dynamic(() => import("./components/ChartLine"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-slate-900/60 rounded-2xl border border-slate-800">
      <span className="text-slate-400 text-sm">Đang tải biểu đồ...</span>
    </div>
  ),
});

const ChartEloPro = dynamic(
  () => import("./components/charts/ChartEloPro"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-slate-900/60 rounded-2xl border border-slate-800">
        <span className="text-slate-400 text-sm">Đang tải biểu đồ ELO...</span>
      </div>
    ),
  }
);

const ChartEloPie = dynamic(
  () => import("./components/charts/ChartEloPie"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-slate-900/60 rounded-2xl border border-slate-800">
        <span className="text-slate-400 text-sm">
          Đang tải biểu đồ phân bố ELO...
        </span>
      </div>
    ),
  }
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/dashboard/summary");
        const json = await res.json();
        //console.log(json);
        setData(json);
      } catch (e) {
        console.error("Lỗi khi tải dashboard:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1a1a1a] to-[#111]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl text-cyan-400 font-medium">
            Đang tải Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const { summary, charts } = data;

  return (
    <div className="dashboard mt-5 space-y-8 pb-10">
      {/* Banner trên cùng */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-900 via-blue-900 to-purple-900 p-8 shadow-2xl border border-cyan-800/30">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Chào mừng trở lại, Quản trị viên
          </h1>
          <p className="text-cyan-200 text-lg">
            Phân tích trò chơi thời gian thực •{" "}
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              {
                label: "Tổng số người chơi",
                value: summary.totalUsers?.toLocaleString() || "0",
                color: "text-cyan-400",
              },
              {
                label: "Đang online",
                value: summary.onlineNow || "0",
                color: "text-green-400",
              },
              {
                label: "Trận đấu hôm nay",
                value: summary.matchesToday?.toLocaleString() || "0",
                color: "text-yellow-400",
              },
              {
                label: "Doanh thu 24h",
                value: `$${(summary.revenue24h || 0).toLocaleString()}`,
                color: "text-purple-400",
              },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-gray-300 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hàng biểu đồ lớn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartLine chartData={charts.matchesTrend} />
        <ChartEloPro eloData={charts.eloDistribution} />
      </div>

      {/* Biểu đồ nhỏ + cards */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-1">
          <ChartEloPie eloData={charts.eloDistribution} />
        </div>

        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            title="Tổng số người chơi"
            value={summary.totalUsers}
            extra="+8.2% so với tuần trước"
            trend="up"
            icon="users"
            variant="default"
          />

          <Card
            title="Doanh thu hôm nay"
            value={summary.revenue24h}
            extra="+0.0%"
            trend="up"
            icon="revenue"
            variant="green"
          />

          <Card
            title="Tải trọng máy chủ"
            value="87%"
            extra="Giờ cao điểm"
            icon="activity"
            variant="orange"
          />

          <Card
            title="Tài khoản bị cấm"
            value={0}
            extra="0%"
            trend="down"
            variant="purple"
          />
        </div>
      </div>

      {/* Footer mini stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
        {[
          {
            label: "Người dùng mới hôm nay",
            value: summary.newUsersToday?.toLocaleString() || "0",
            color: "text-emerald-400",
          },
          {
            label: "Tỉ lệ cấm",
            value: `${summary.banRate || 0.0}%`,
            color: "text-red-400",
          },
          {
            label: "Báo cáo đã giải quyết",
            value: summary.reportsResolved || "0",
            color: "text-blue-400",
          },
          {
            label: "Đỉnh người dùng đồng thời",
            value: summary.peakConcurrent?.toLocaleString() || "0",
            color: "text-purple-400",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 text-center hover:border-cyan-600 transition-all duration-300"
          >
            <p className="text-gray-400 text-sm">{item.label}</p>
            <p className={`text-2xl font-bold mt-2 ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
