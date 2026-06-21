"use client";

import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./styles/admin.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Nếu đang ở /admin/login => KHÔNG dùng layout dashboard
  if (pathname === "/admin/login") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1221",
        }}
      >
        {children}
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <Sidebar />

      <div className="admin-main">
        {/* Navbar */}
        <Navbar />

        {/* Nội dung */}
        <div className="admin-content">{children}</div>
      </div>

      {/* Toaster đặt ở cuối layout */}
      <Toaster position="top-right" />
    </div>
  );
}
