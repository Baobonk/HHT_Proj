"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("elo"); // elo, wins, games

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leaderboard?sortBy=${sortBy}&limit=100`);
      const data = await res.json();
      setLeaderboard(data.leaderboard);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">🏆 Bảng Xếp Hạng</h1>

          <Link href="/room" className="btn-primary px-6 py-2 rounded-lg">
            ← Quay lại
          </Link>
        </div>

        {/* Sort Options */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Sắp xếp theo:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("elo")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === "elo"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                ELO
              </button>
              <button
                onClick={() => setSortBy("wins")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === "wins"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Số trận thắng
              </button>
              <button
                onClick={() => setSortBy("games")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sortBy === "games"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Số trận đấu
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Đang tải...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card p-20 text-center">
            <p className="text-gray-400">Chưa có dữ liệu</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 bg-gray-800 p-4 font-semibold text-gray-300 text-sm">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">Người chơi</div>
              <div className="col-span-2 text-center">ELO</div>
              <div className="col-span-2 text-center">Trận đấu</div>
              <div className="col-span-2 text-center">Thắng</div>
              <div className="col-span-2 text-center">Tỉ lệ thắng</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-700">
              {leaderboard.map((player, index) => {
                const totalGames = player.stats?.totalGames || 0;
                const wins = player.stats?.wins || 0;
                const winRate =
                  totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

                return (
                  <div
                    key={player.username}
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/50 transition ${
                      index < 3 ? "bg-yellow-900/20" : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex items-center justify-center">
                      {index === 0 && <span className="text-3xl">🥇</span>}
                      {index === 1 && <span className="text-3xl">🥈</span>}
                      {index === 2 && <span className="text-3xl">🥉</span>}
                      {index > 2 && (
                        <span className="text-gray-400 font-semibold">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Player */}
                    <div className="col-span-3 flex items-center">
                      <div>
                        <p className="text-white font-semibold">
                          {player.username}
                        </p>
                        {player.fullName && (
                          <p className="text-sm text-gray-400">
                            {player.fullName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ELO */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-yellow-400 font-bold text-lg">
                        {player.elo}
                      </span>
                    </div>

                    {/* Total Games */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {totalGames}
                      </span>
                    </div>

                    {/* Wins */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-green-400 font-semibold">
                        {wins}
                      </span>
                    </div>

                    {/* Win Rate */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white font-semibold">{winRate}%</p>
                        {player.stats?.currentWinStreak > 0 && (
                          <p className="text-xs text-green-400">
                            🔥 {player.stats.currentWinStreak} streak
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {leaderboard.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="card p-6 text-center">
              <p className="text-yellow-400 text-sm mb-2">TOP ELO</p>
              <p className="text-3xl font-bold text-white">
                {leaderboard[0]?.elo || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {leaderboard[0]?.username}
              </p>
            </div>

            <div className="card p-6 text-center">
              <p className="text-yellow-400 text-sm mb-2">TỔNG NGƯỜI CHƠI</p>
              <p className="text-3xl font-bold text-white">
                {leaderboard.length}
              </p>
              <p className="text-sm text-gray-400 mt-1">Đang hoạt động</p>
            </div>

            <div className="card p-6 text-center">
              <p className="text-yellow-400 text-sm mb-2">ELO TRUNG BÌNH</p>
              <p className="text-3xl font-bold text-white">
                {Math.round(
                  leaderboard.reduce((sum, p) => sum + p.elo, 0) /
                    leaderboard.length
                )}
              </p>
              <p className="text-sm text-gray-400 mt-1">Toàn server</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
