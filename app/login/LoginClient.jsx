// app/login/LoginClient.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; 
// import các thứ khác như cũ (Link, useAuth, ...)
import { useAuth } from "@/context/AuthContext"; 
export default function LoginClient() {
  const searchParams = useSearchParams();

  const { login } = useAuth();

  // TAB: "password" | "email"
  const [activeTab, setActiveTab] = useState("password");

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login bằng email
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailInfo, setEmailInfo] = useState("");

  // Xử lý error từ URL params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "notLoggedIn") {
      setError("Vui lòng đăng nhập để tiếp tục.");
    } else if (errorParam === "sessionExpired") {
      setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // ======================
  // LOGIN BẰNG MẬT KHẨU
  // ======================
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEmailInfo("");

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        //console.log("✅ Login successful, redirecting...");

        await new Promise((resolve) => setTimeout(resolve, 300));

        const returnUrl = searchParams.get("returnUrl") || "/room";
        window.location.href = returnUrl;
      } else {
        setError(result.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LOGIN BẰNG EMAIL: GỬI OTP
  // ======================
  const handleSendOtp = async () => {
    setError("");
    setEmailInfo("");

    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/email/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Không gửi được mã đăng nhập.");
      } else {
        setOtp("");
        setOtpSent(true);
        setEmailInfo(
          "Mã đăng nhập đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư (và cả spam)."
        );
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError("Có lỗi xảy ra khi gửi mã. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // LOGIN BẰNG EMAIL: XÁC THỰC OTP
  // ======================
  const handleVerifyOtp = async () => {
    setError("");
    setEmailInfo("");

    if (!email || !otp) {
      setError("Vui lòng nhập đầy đủ email và mã OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Mã OTP không hợp lệ.");
      } else {
        //console.log("✅ OTP login successful, redirecting...");

        await new Promise((resolve) => setTimeout(resolve, 300));

        const returnUrl = searchParams.get("returnUrl") || "/room";
        window.location.href = returnUrl;
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("Có lỗi xảy ra khi xác thực mã. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="card p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="chess-title text-3xl mb-2">♞ Chess Online</h1>
            <p className="text-[var(--color-soft)]">
              Đăng nhập để tiếp tục ♟
            </p>
          </div>

          {/* Tab chọn phương thức đăng nhập */}
          <div className="flex mb-6 bg-white/5 rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("password");
                setError("");
                setEmailInfo("");
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "password"
                  ? "bg-[var(--color-primary)] text-white shadow"
                  : "text-[var(--color-soft)] hover:text-white"
              }`}
            >
              Đăng nhập bằng mật khẩu
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("email");
                setError("");
                setEmailInfo("");
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "email"
                  ? "bg-[var(--color-primary)] text-white shadow"
                  : "text-[var(--color-soft)] hover:text-white"
              }`}
            >
              Đăng nhập bằng email
            </button>
          </div>

          {/* Error + Info */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {emailInfo && (
            <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-lg mb-4 text-sm">
              {emailInfo}
            </div>
          )}

          {loading && (
            <div className="bg-blue-500/20 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg mb-4 text-center text-sm">
              <span className="inline-block animate-spin mr-2">⚙️</span>
              Đang xử lý...
            </div>
          )}

          {/* TAB 1: ĐĂNG NHẬP BẰNG MẬT KHẨU */}
          {activeTab === "password" && (
            <form onSubmit={handleSubmitPassword} className="space-y-4 mb-4">
              <div>
                <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-[var(--color-primary)] text-sm hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "🔐 Đăng nhập"}
              </button>
            </form>
          )}

          {/* TAB 2: ĐĂNG NHẬP BẰNG EMAIL */}
          {activeTab === "email" && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="input-field"
                  disabled={loading}
                  placeholder="you@example.com"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                    Mã đăng nhập (OTP)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setError("");
                    }}
                    className="input-field text-center tracking-[0.3em]"
                    disabled={loading}
                    placeholder="••••••"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading || !email}
                  className="flex-1 btn-secondary py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpSent ? "Gửi lại mã" : "📧 Gửi mã đăng nhập"}
                </button>

                {otpSent && (
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading || !otp}
                    className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ✅ Xác nhận
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="text-center mt-4 space-y-3">
            <p className="text-[var(--color-soft)] text-sm">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-[var(--color-primary)] hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <Link
              href="/"
              className="text-[var(--color-soft)] text-sm hover:text-white inline-block"
            >
              ← Chơi ngay không cần đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
