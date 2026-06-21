"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setAdmin(data.admin);
      } catch (err) {}
    };
    fetchAdmin();
  }, []);

  // ⬇️ ĐOẠN MỚI: đọc window.innerWidth trong useEffect, không dùng trực tiếp trong JSX
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <header
      style={{
        background: "rgba(10,10,10,0.95)",
        borderBottom: "1px solid #2b2b2b",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "66px",
        zIndex: 1000, // nhỏ hơn sidebar (1050)
        marginLeft: isDesktop ? "260px" : "0px", // dùng state thay vì window trực tiếp
      }}
    >
      {/* Tiêu đề */}
      <div className="d-flex align-items-center ml-[20%]" style={{ gap: 12 }}>
        <h2
          className="mb-0"
          style={{ fontSize: 21, fontWeight: 600, color: "#f5f5f5" }}
        >
          Bảng điều khiển
        </h2>
        <span
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1,
            padding: "3px 10px",
            borderRadius: 999,
            border: "1px solid #444",
            color: "#bbb",
            background: "#181818",
          }}
        >
          Admin
        </span>
      </div>

      {/* Avatar + dropdown */}
      <div style={{ position: "relative" }}>
        <div
          className="d-flex align-items-center"
          style={{ gap: 12, cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          <div className="d-none d-md-block text-end">
            <div style={{ fontSize: 13.5, color: "#e5e5e5", fontWeight: 500 }}>
              Xin chào, {admin?.username || "Quản trị viên"}
            </div>
            <div style={{ fontSize: 11, color: "#8b8b8b" }}>
              Hệ thống quản trị CHESS
            </div>
          </div>

          {admin?.avatar ? (
            <img
              src={admin.avatar}
              alt="avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #444",
              }}
            />
          ) : (
            <FaUserCircle size={38} color="#c5c5c5" />
          )}
        </div>

        {/* Dropdown */}
        {open && (
          <>
            <div
              style={{ position: "fixed", inset: 0, zIndex: 998 }}
              onClick={() => setOpen(false)}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: 12,
                background: "#151515",
                border: "1px solid #333",
                borderRadius: 12,
                minWidth: 220,
                boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
                zIndex: 999,
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #262626",
                }}
              >
                <div style={{ fontWeight: 600, color: "#fff" }}>
                  {admin?.username || "Quản trị viên"}
                </div>
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                  {admin?.email || "admin@chess.com"}
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: "#ff6b6b",
                  fontWeight: 500,
                }}
              >
                Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
