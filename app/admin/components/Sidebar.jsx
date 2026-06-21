"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Menu, X } from "lucide-react";
import { FaTachometerAlt, FaUsers } from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreen = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      setOpen(desktop); // desktop: mở, mobile: đóng
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const menu = [
    { label: "Tổng quan", icon: <FaTachometerAlt />, href: "/admin" },
    { label: "Quản lý tài khoản", icon: <FaUsers />, href: "/admin/account" },
  ];

  return (
    <>
      {/* Nút mở sidebar - chỉ hiện mobile */}
      {!isDesktop && (
        <button
          className="btn btn-outline-light position-fixed top-0 start-0 mt-3 ms-3 z-top"
          onClick={() => setOpen(!open)}
          style={{ zIndex: 1100 }}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      )}

      {/* Overlay tối nền khi mở trên mobile */}
      {open && !isDesktop && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
          style={{ opacity: 0.7, zIndex: 1040 }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className="bg-dark text-light position-fixed start-0 top-0 h-100 d-flex flex-column"
        style={{
          width: "260px",
          zIndex: 1050,
          transition: "transform 0.35s ease",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Logo */}
        <div className="text-center my-4">
          <Link href="/admin" className="d-block">
            <Crown
              size={60}
              strokeWidth={1.5}
              color="#f5c542"
              style={{
                margin: "0 auto",
                filter: "drop-shadow(0 0 8px rgba(255,255,200,0.35))",
              }}
            />
          </Link>
        </div>

        {/* Menu */}
        <ul className="nav nav-pills flex-column mb-auto px-3">
          {menu.map((item, index) => (
            <li key={index} className="nav-item mb-2">
              <Link
                href={item.href}
                onClick={() => !isDesktop && setOpen(false)}
                className={`nav-link d-flex align-items-center text-light ${
                  pathname === item.href ? "active bg-primary" : ""
                }`}
                style={{
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                }}
              >
                {item.icon}
                <span style={{ fontSize: "14.5px", fontWeight: "500" }}>
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="p-3 text-center text-muted small border-top border-secondary">
          © 2025 Chess System
        </div>
      </div>

      {/* Khoảng trống bù cho sidebar trên desktop */}
      {isDesktop && <div style={{ width: "260px", flexShrink: 0 }} />}
    </>
  );
}
