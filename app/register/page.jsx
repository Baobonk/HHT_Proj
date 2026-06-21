// ============================================
// FILE: app/register/page.jsx (REFACTORED)
// Register với upload CCCD
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    birthDay: "",
    sex: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cccdPreview, setCccdPreview] = useState(null);
  const [extracting, setExtracting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Xử lý upload CCCD
  const handleCccdUpload = async (file) => {
    if (!file) return;

    setError("");
    setExtracting(true);

    try {
      // Preview ảnh
      const reader = new FileReader();
      reader.onload = (e) => setCccdPreview(e.target.result);
      reader.readAsDataURL(file);

      // Upload & extract
      const formDataUpload = new FormData();
      formDataUpload.append("cccd_image", file);

      console.log("📤 Uploading CCCD image...");

      const res = await fetch("/api/cccd/extract", {
        method: "POST",
        body: formDataUpload,
      });

      const json = await res.json();

      if (res.ok) {
        console.log("✅ CCCD extraction success:", json.data);

        setFormData((prev) => ({
          ...prev,
          fullName: json.data.fullName || prev.fullName,
          birthDay: json.data.birthDay || prev.birthDay,
          sex: json.data.sex || prev.sex,
          address: json.data.address || prev.address,
        }));

        setSuccess("✓ Đã tự động điền thông tin từ CCCD!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(json.message || "Không thể trích xuất thông tin CCCD");
      }
    } catch (err) {
      console.error("❌ CCCD upload error:", err);
      setError("Lỗi kết nối server. Vui lòng thử lại.");
    } finally {
      setExtracting(false);
    }
  };

  // Xử lý drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-400", "bg-blue-500/10");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-500/10");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-500/10");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleCccdUpload(files[0]);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
    if (!formData.username || !formData.password) {
      setError("Vui lòng nhập username và password");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      setSuccess("✓ Đăng ký thành công! Đang chuyển trang...");
      setTimeout(() => router.push("/room"), 1500);
    } else {
      setError(result.message || "Đăng ký thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="relative z-10 w-full max-w-2xl">
        <div className="card p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="chess-title text-3xl mb-2">♞ Chess Online</h1>
            <p className="text-[var(--color-soft)]">
              Tạo tài khoản mới để bắt đầu ♟
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          {/* CCCD Upload Section */}
          <div className="mb-6">
            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-200 px-4 py-3 rounded-lg mb-4 text-sm">
              💡 <strong>Mẹo:</strong> Tải ảnh CCCD để tự động điền thông tin
              (tùy chọn)
            </div>

            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="block border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--color-primary)] transition-all"
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={(e) => handleCccdUpload(e.target.files?.[0])}
                disabled={extracting}
              />

              <div className="text-4xl mb-2">{extracting ? "⏳" : "📤"}</div>

              <p className="text-[var(--color-soft)] font-medium">
                {extracting
                  ? "Đang xử lý ảnh..."
                  : "Nhấn hoặc kéo thả ảnh CCCD vào đây"}
              </p>

              <p className="text-xs text-[var(--color-soft)] mt-1">
                Hỗ trợ JPG, PNG (tối đa 5MB)
              </p>

              {cccdPreview && (
                <div className="mt-4">
                  <img
                    src={cccdPreview}
                    alt="CCCD Preview"
                    className="max-h-32 mx-auto rounded-lg border border-[var(--color-border-subtle)]"
                  />
                </div>
              )}
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                  Tên đăng nhập <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="3+ ký tự"
                  required
                  minLength={3}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                  Mật khẩu <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="6+ ký tự"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your-email@example.com"
                disabled={loading}
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                placeholder="Nguyễn Văn A"
                disabled={loading}
              />
            </div>

            {/* Birth Day & Sex */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                  Giới tính
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="">-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[var(--color-soft)] mb-1 text-sm font-medium">
                Địa chỉ
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                placeholder="Nhập địa chỉ đầy đủ"
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || extracting}
              className="btn-primary w-full py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⚙️</span>
                  Đang xử lý...
                </>
              ) : (
                "📝 Tạo tài khoản"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center mt-6 space-y-3">
            <p className="text-[var(--color-soft)] text-sm">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-[var(--color-primary)] hover:underline font-medium"
              >
                Đăng nhập
              </Link>
            </p>
            <Link
              href="/"
              className="text-[var(--color-soft)] text-sm hover:text-white inline-block"
            >
              ← Chơi ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
