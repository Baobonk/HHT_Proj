"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css"; // nhớ đã cài: npm i bootstrap

export default function AdminLoginPage() {
  const router = useRouter();

  // TAB: "password" | "email"
  const [activeTab, setActiveTab] = useState("password");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Email login
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // ĐĂNG NHẬP = MẬT KHẨU
  // =========================
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      toast.success("Đăng nhập admin thành công!");
      router.replace("/admin");

      setTimeout(() => {
        if (window.location.pathname !== "/admin") {
          window.location.href = "/admin";
        }
      }, 150);
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ĐĂNG NHẬP = EMAIL: GỬI OTP
  // =========================
  const handleSendOtp = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Vui lòng nhập email admin.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/email/send-otp", {
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
        setInfo(
          "Mã đăng nhập đã được gửi tới email admin của bạn. Vui lòng kiểm tra hộp thư (và cả spam)."
        );
      }
    } catch (err) {
      console.error("ADMIN SEND OTP ERROR:", err);
      setError("Có lỗi xảy ra khi gửi mã. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ĐĂNG NHẬP = EMAIL: XÁC THỰC OTP
  // =========================
  const handleVerifyOtp = async () => {
    setError("");
    setInfo("");

    if (!email || !otp) {
      setError("Vui lòng nhập đầy đủ email và mã OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Mã OTP không hợp lệ.");
      } else {
        toast.success("Đăng nhập admin bằng email thành công!");
        router.replace("/admin");

        setTimeout(() => {
          if (window.location.pathname !== "/admin") {
            window.location.href = "/admin";
          }
        }, 150);
      }
    } catch (err) {
      console.error("ADMIN VERIFY OTP ERROR:", err);
      setError("Có lỗi xảy ra khi xác thực mã. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        width: "100%",
        background: "#04081C",
        padding: 24,
      }}
    >
      <div
        className="card border-0 shadow-lg w-100"
        style={{
          maxWidth: 960,
          borderRadius: 24,
          background: "#272b44",
          overflow: "hidden",
        }}
      >
        <div className="row g-0">
          {/* Bên trái: logo + quân cờ lớn (ẩn trên mobile, hiện từ md trở lên) */}
          <div className="col-md-5 d-none d-md-flex flex-column text-white p-4">
            {/* Logo + chữ */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 12,
                  background:
                    "radial-gradient(circle at 30% 20%, #38bdf8, #1d4ed8)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                ♚
              </span>
              <span style={{ fontSize: 20, fontWeight: 700 }}>Chess Admin</span>
            </div>

            {/* Quân cờ */}
            <div className="flex-grow-1 d-flex align-items-center justify-content-center mt-2">
              <div
                style={{
                  width: 380,
                  height: 380,
                  position: "relative",
                }}
              >
                <Image
                  src="/img/QUAN_CO.png"
                  alt="Chess King"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            </div>
          </div>

          {/* Bên phải: form login + tabs (chiếm full trên mobile) */}
          <div className="col-12 col-md-7 text-light p-4 p-md-5">
            {/* Logo nhỏ trên mobile */}
            <div className="d-flex d-md-none align-items-center gap-2 mb-3">
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 12,
                  background:
                    "radial-gradient(circle at 30% 20%, #38bdf8, #1d4ed8)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                ♚
              </span>
              <span style={{ fontSize: 20, fontWeight: 700 }}>Chess Admin</span>
            </div>

            {/* Badge Admin Panel */}
            <span
              className="d-inline-block mb-2 px-3 py-1 rounded-pill"
              style={{
                background: "rgba(59,130,246,0.2)",
                fontSize: 12,
              }}
            >
              Admin Panel
            </span>

            <h1 className="fw-bold mb-1" style={{ color: "#fff", fontSize: 26 }}>
              Welcome back!
            </h1>
            <p className="mb-3" style={{ fontSize: 14, color: "#9ca3af" }}>
              Chọn phương thức đăng nhập cho khu vực quản trị.
            </p>

            {/* Tabs */}
            <div
              className="d-flex rounded-pill p-1 mb-3"
              style={{ background: "rgba(15,23,42,0.7)" }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab("password");
                  setError("");
                  setInfo("");
                }}
                className={`btn btn-sm rounded-pill flex-fill ${
                  activeTab === "password"
                    ? "fw-semibold"
                    : "fw-medium text-secondary"
                }`}
                style={{
                  fontSize: 13,
                  backgroundColor:
                    activeTab === "password" ? "#20d1ff" : "transparent",
                  color: activeTab === "password" ? "#0f172a" : "#9ca3af",
                  transition: "all 0.2s ease",
                }}
              >
                Đăng nhập bằng mật khẩu
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("email");
                  setError("");
                  setInfo("");
                }}
                className={`btn btn-sm rounded-pill flex-fill ${
                  activeTab === "email"
                    ? "fw-semibold"
                    : "fw-medium text-secondary"
                }`}
                style={{
                  fontSize: 13,
                  backgroundColor:
                    activeTab === "email" ? "#20d1ff" : "transparent",
                  color: activeTab === "email" ? "#0f172a" : "#9ca3af",
                  transition: "all 0.2s ease",
                }}
              >
                Đăng nhập bằng email
              </button>
            </div>

            {/* Error / Info / Loading */}
            {error && (
              <div
                className="mb-2 p-2 rounded"
                style={{
                  background: "rgba(248,113,113,0.15)",
                  color: "#fecaca",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            {info && (
              <div
                className="mb-2 p-2 rounded"
                style={{
                  background: "rgba(16,185,129,0.16)",
                  color: "#a7f3d0",
                  fontSize: 13,
                }}
              >
                {info}
              </div>
            )}

            {loading && (
              <div
                className="mb-2 p-2 rounded"
                style={{
                  background: "rgba(59,130,246,0.18)",
                  color: "#bfdbfe",
                  fontSize: 13,
                }}
              >
                Đang xử lý...
              </div>
            )}

            {/* TAB 1: PASSWORD */}
            {activeTab === "password" && (
              <form
                onSubmit={handlePasswordLogin}
                className="d-flex flex-column gap-2"
              >
                <div className="mb-2">
                  <label className="form-label mb-1" style={{ fontSize: 13 }}>
                    Email / Username
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    style={{
                      height: 42,
                      fontSize: 14,
                      borderColor: "#4b5563",
                    }}
                    placeholder="admin@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label mb-1" style={{ fontSize: 13 }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-pill"
                    style={{
                      height: 42,
                      fontSize: 14,
                      borderColor: "#4b5563",
                    }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="rememberMe"
                      style={{ fontSize: 13 }}
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <a
                    href="/admin/forgot-password"
                    style={{
                      fontSize: 13,
                      color: "#38bdf8",
                      textDecoration: "none",
                    }}
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn rounded-pill mt-1"
                  style={{
                    height: 42,
                    background: "#20d1ff",
                    color: "#0f172a",
                    fontWeight: 600,
                    fontSize: 15,
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  Sign in
                </button>
              </form>
            )}

            {/* TAB 2: EMAIL + OTP */}
            {activeTab === "email" && (
              <div className="d-flex flex-column gap-2">
                <div className="mb-2">
                  <label className="form-label mb-1" style={{ fontSize: 13 }}>
                    Email admin
                  </label>
                  <input
                    type="email"
                    className="form-control rounded-pill"
                    style={{
                      height: 42,
                      fontSize: 14,
                      borderColor: "#4b5563",
                    }}
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                  />
                </div>

                {otpSent && (
                  <div className="mb-2">
                    <label
                      className="form-label mb-1"
                      style={{ fontSize: 13 }}
                    >
                      Mã đăng nhập (OTP)
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill text-center"
                      style={{
                        height: 42,
                        fontSize: 18,
                        letterSpacing: "0.3em",
                        borderColor: "#4b5563",
                      }}
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setError("");
                      }}
                    />
                  </div>
                )}

                <div className="d-flex flex-column flex-md-row gap-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || !email}
                    className="btn rounded-pill flex-fill"
                    style={{
                      height: 42,
                      border: "1px solid #0ea5e9",
                      background: "transparent",
                      color: "#7dd3fc",
                      fontWeight: 500,
                      fontSize: 14,
                      cursor: loading || !email ? "not-allowed" : "pointer",
                      opacity: loading || !email ? 0.6 : 1,
                    }}
                  >
                    {otpSent ? "Gửi lại mã" : "📧 Gửi mã đăng nhập"}
                  </button>

                  {otpSent && (
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading || !otp}
                      className="btn rounded-pill flex-fill"
                      style={{
                        height: 42,
                        border: "none",
                        background: "#22c55e",
                        color: "#022c22",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: loading || !otp ? "not-allowed" : "pointer",
                        opacity: loading || !otp ? 0.7 : 1,
                      }}
                    >
                      ✅ Xác nhận
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Text dưới cùng */}
            <div className="mt-4" style={{ fontSize: 12, color: "#6b7280" }}>
              <div className="mb-2">
                Không phải admin?{" "}
                <a
                  href="/login"
                  style={{ color: "#38bdf8", textDecoration: "none" }}
                >
                  Về trang đăng nhập người dùng
                </a>
              </div>

              <div>
                <a
                  href="#"
                  style={{
                    color: "#6b7280",
                    textDecoration: "none",
                    marginRight: 16,
                  }}
                >
                  Terms of use
                </a>
                <a
                  href="#"
                  style={{ color: "#6b7280", textDecoration: "none" }}
                >
                  Privacy policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
