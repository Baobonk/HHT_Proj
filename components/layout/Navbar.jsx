"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
  await logout();          
  router.replace("/login");
};



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="chess-title text-xl font-bold">
          ♟ Chess Online
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">

          {/* ============ USER ĐÃ ĐĂNG NHẬP ============ */}
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--color-soft)]">👤</span>
                <span className="text-white font-medium">{user.username}</span>
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-xs">
                  ELO: {user.elo}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-[var(--color-soft)] hover:text-white text-sm transition-colors"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            /* ============ USER CHƯA ĐĂNG NHẬP ============ */
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-1.5 rounded-lg text-sm border border-white/20 text-white hover:bg-white/10 transition"
            >
              Bạn chưa đăng nhập — Về trang Login
            </button>
          )}

          {/* Nút Donate */}
          <Link
            href="/donate"
            className="px-4 py-1.5 rounded-lg text-sm border border-yellow-500 text-yellow-200 hover:bg-yellow-500/20 transition"
          >
            Donate
          </Link>
        </div>
      </div>
    </nav>
  );
}
