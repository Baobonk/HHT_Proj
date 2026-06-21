"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="card p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="chess-title text-3xl mb-2">♟ Chess Online</h1>
            <p className="text-[var(--color-soft)]">
              Chơi cờ vua trực tuyến cùng bạn bè
            </p>
          </div>

          {/* Play with AI button */}
          <Link
            href="/game/ai"
            className="btn-gradient block w-full py-3 text-center rounded-xl mb-4"
          >
            🤖 Chơi với máy (AI)
          </Link>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
            <span className="px-3 text-[var(--color-soft)] text-sm">hoặc</span>
            <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
          </div>

          {/* Login/Room button based on auth state */}
          {loading ? (
            <div className="text-center py-3 text-[var(--color-soft)]">
              Đang tải...
            </div>
          ) : user ? (
            <Link
              href="/room"
              className="btn-primary block w-full py-3 text-center rounded-xl"
            >
              🎮 Vào phòng chơi
            </Link>
          ) : (
            <Link
              href="/login"
              className="btn-primary block w-full py-3 text-center rounded-xl"
            >
              🔐 Đăng nhập
            </Link>
          )}

          <p className="text-[var(--color-soft)] text-sm mt-4 text-center">
            Đăng nhập để trải nghiệm đầy đủ tính năng và lưu tiến trình của bạn
          </p>
        </div>
      </div>
    </div>
  );
}
