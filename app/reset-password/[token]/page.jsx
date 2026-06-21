// app/reset-password/[token]/page.jsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Mật khẩu đã được cập nhật! Đang chuyển đến đăng nhập...");
        setTimeout(() => router.push("/login"), 2000);
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
            <h1 className="chess-title text-3xl mb-2">♞ Đặt Lại Mật Khẩu</h1>
            <p className="text-[var(--color-soft)]">
              Nhập mật khẩu mới của bạn
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "✓ Cập Nhật Mật Khẩu"}
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
