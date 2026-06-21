// app/forgot-password/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Đã gửi email đặt lại mật khẩu. Kiểm tra inbox của bạn!");
        setEmail("");
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-6">
            <h1 className="chess-title text-3xl mb-2">♞ Quên Mật Khẩu</h1>
            <p className="text-[var(--color-soft)]">
              Nhập email để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          {message && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "🔓 Gửi Email"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/login"
              className="text-[var(--color-primary)] hover:underline text-sm"
            >
              ← Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
