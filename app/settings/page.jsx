"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-slate-100 font-semibold text-base">
                    Chess Online
                  </h1>
                  <p className="text-slate-400 text-xs">Cài đặt</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl space-y-6">
            {/* Cài đặt giao diện */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Cài đặt giao diện
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-4">
                Tùy chỉnh giao diện và các thiết lập khác để cải thiện trải nghiệm chơi cờ của bạn.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Chọn giao diện
                  </label>
                  <select
                    value={theme}
                    onChange={handleThemeChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                  >
                    <option value="dark">Chế độ tối</option>
                    <option value="light">Chế độ sáng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Cài đặt thông báo
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-5 h-5" />
                    <span className="text-slate-400 text-sm">
                      Nhận thông báo khi có trận đấu mới
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Cài đặt khác
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Thay đổi mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Nhập email mới"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* NÚT QUAY LẠI */}
            <div className="mt-10 text-center">
              <a
                href="/room"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg inline-block"
              >
                ← Quay lại phòng chơi
              </a>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900/95 border-t border-slate-800 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-xs">
              © 2024 Chess Online · Built with care
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
