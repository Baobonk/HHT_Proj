"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function MatchHistoryPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all"); // all, win, loss, draw

  useEffect(() => {
    if (user?.id) {
      fetchMatches();
    }
  }, [user, page]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const limit = 20;
      const skip = page * limit;

      const res = await fetch(
        `/api/match-history?userId=${user.id}&limit=${limit}&skip=${skip}`
      );
      const data = await res.json();

      if (page === 0) {
        setMatches(data.matches);
      } else {
        setMatches((prev) => [...prev, ...data.matches]);
      }

      setHasMore(data.pagination.hasMore);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    return match.result === filter;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Vui lòng đăng nhập</p>
          <Link href="/login" className="btn-primary px-6 py-2 rounded-lg">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">📜 Lịch Sử Đấu</h1>
          <Link href="/profile" className="btn-primary px-6 py-2 rounded-lg">
            ← Quay lại
          </Link>
        </div>

        {/* Filter */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Lọc:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "all"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Tất cả ({matches.length})
              </button>
              <button
                onClick={() => setFilter("win")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "win"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Thắng ({matches.filter((m) => m.result === "win").length})
              </button>
              <button
                onClick={() => setFilter("loss")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "loss"
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Thua ({matches.filter((m) => m.result === "loss").length})
              </button>
              <button
                onClick={() => setFilter("draw")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === "draw"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Hòa ({matches.filter((m) => m.result === "draw").length})
              </button>
            </div>
          </div>
        </div>

        {/* Matches List */}
        {loading && page === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Đang tải...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="card p-20 text-center">
            <p className="text-gray-400">Chưa có trận đấu nào</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {filteredMatches.map((match) => (
                <div
                  key={match._id}
                  className="card p-6 hover:bg-gray-800/70 transition"
                >
                  <div className="flex items-start justify-between">
                    {/* Left side */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Result Icon */}
                      <div
                        className={`text-4xl ${
                          match.result === "win"
                            ? "text-green-400"
                            : match.result === "loss"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {match.result === "win"
                          ? "✓"
                          : match.result === "loss"
                          ? "✗"
                          : "="}
                      </div>

                      {/* Match Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-bold text-lg">
                            vs {match.opponentUsername}
                          </h3>
                          <span className="text-gray-400 text-sm">
                            (ELO: {match.opponentElo})
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>
                            {match.myColor === "white"
                              ? "♔ Quân Trắng"
                              : "♚ Quân Đen"}
                          </span>
                          <span>•</span>
                          <span>{match.totalMoves} nước</span>
                          <span>•</span>
                          <span>
                            {Math.floor(match.duration / 60)}:
                            {(match.duration % 60).toString().padStart(2, "0")}
                          </span>
                          <span>•</span>
                          <span className="capitalize">
                            {match.endReason.replace("_", " ")}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(match.playedAt).toLocaleString("vi-VN")} •
                          Phòng: {match.roomCode}
                        </p>
                      </div>
                    </div>

                    {/* Right side - ELO Change */}
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          match.eloChange > 0
                            ? "text-green-400"
                            : match.eloChange < 0
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {match.eloChange > 0 ? "+" : ""}
                        {match.eloChange}
                      </p>
                      <p className="text-sm text-gray-400">
                        ELO: {match.eloAfter}
                      </p>
                    </div>
                  </div>

                  {/* PGN Preview */}
                  {match.pgn && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-yellow-400 text-sm hover:text-yellow-300">
                        Xem PGN
                      </summary>
                      <pre className="bg-gray-900 p-3 rounded mt-2 text-xs text-gray-300 overflow-x-auto">
                        {match.pgn}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && !loading && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-primary px-8 py-3 rounded-lg"
                >
                  Tải thêm
                </button>
              </div>
            )}

            {loading && page > 0 && (
              <div className="text-center mt-6">
                <p className="text-gray-400">Đang tải...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
