"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  User,
  Trophy,
  History,
  LogOut,
  Star,
  BarChart2,
  Target,
  Play,
  BookOpen,
  Settings,
  Heart,         // 👈 thêm icon donate
} from "lucide-react";

// Tạo mã phòng ngẫu nhiên
function generateRoomCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Component bọc Suspense (KHÔNG dùng hook trong này)
export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
          Đang tải phòng...
        </div>
      }
    >
      <RoomPageInner />
    </Suspense>
  );
}

// Component thật sự dùng useSearchParams và các hook khác
function RoomPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // 👇 state để điều khiển nhấp nháy Donate
  const [donateHighlight, setDonateHighlight] = useState(false);

  // Xử lý error từ URL
  useEffect(() => {
    const errorParam = searchParams.get("error");

    const errorMap = {
      missingCode: "Vui lòng nhập mã bàn.",
      invalidCode: "Mã bàn không hợp lệ hoặc phòng không tồn tại.",
      selfPlayNotAllowed:
        "Bạn không thể chơi cả trắng lẫn đen bằng cùng tài khoản.",
      roomFull: "Bàn này đã đủ 2 người chơi.",
      roomOwnedByAnother: "Mã bàn này đã được người chơi khác tạo.",
    };

    if (errorParam && errorMap[errorParam]) {
      setError(errorMap[errorParam]);
    }
  }, [searchParams]);

  // 👇 JS cho hiệu ứng nhấp nháy Donate
  useEffect(() => {
    const id = setInterval(() => {
      setDonateHighlight((prev) => !prev);
    }, 700); // nhấp nháy mỗi 0.7s

    return () => clearInterval(id);
  }, []);

  // Tạo bàn mới (quân trắng)
 const handleCreateRoom = async () => {
  const code = generateRoomCode();

  // 👇 Lấy id từ user theo nhiều key
  const creatorId = user?._id || user?.id || user?.userId || null;

  //console.log("CreatorId khi tạo phòng:", creatorId);

  try {
    await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        creator: creatorId,
      }),
    });
  } catch (err) {
    console.error("Lỗi tạo phòng:", err);
  }

  router.push(`/game/white?code=${code}`);
};



  // Vào bàn có sẵn (quân đen)
  const handleJoinRoom = async (e) => {
  e.preventDefault();
  const code = joinCode.trim().toUpperCase();
  if (!code) {
    setError("Vui lòng nhập mã bàn.");
    return;
  }

  try {
    const res = await fetch("/api/rooms/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Không thể vào phòng");
      return;
    }

    router.push(`/game/black?code=${code}`);
  } catch (err) {
    console.error("Lỗi join room:", err);
    setError("Đã có lỗi xảy ra khi vào phòng");
  }
};


  // Đăng xuất
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (confirmLogout) {
      await logout();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-xl"
                >
                  ♟
                </Link>
                <div>
                  <h1 className="text-slate-100 font-semibold text-base">
                    Chess Online
                  </h1>
                  <p className="text-slate-400 text-xs">
                    Multiplayer · Real-time
                  </p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 transition text-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/leaderboard"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 transition text-sm"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Bảng xếp hạng</span>
                </Link>

                <Link
                  href="/match-history"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 transition text-sm"
                >
                  <History className="w-4 h-4" />
                  <span>Lịch sử</span>
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-900 border border-slate-800 rounded-md">
                  <div className="text-right">
                    <p className="text-slate-100 font-medium text-sm">
                      {user?.username}
                    </p>
                    <p className="text-amber-400 text-xs">
                      ELO: {user?.elo || 1200}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 rounded hover:bg-slate-800 transition"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden p-2 rounded-md hover:bg-slate-800 text-slate-100"
              >
                {showMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {showMenu && (
              <div className="md:hidden py-3 space-y-2 border-t border-slate-800">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 transition text-sm"
                  onClick={() => setShowMenu(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>

                <Link
                  href="/leaderboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 transition text-sm"
                  onClick={() => setShowMenu(false)}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Bảng xếp hạng</span>
                </Link>

                <Link
                  href="/match-history"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 transition text-sm"
                  onClick={() => setShowMenu(false)}
                >
                  <History className="w-4 h-4" />
                  <span>Lịch sử</span>
                </Link>

                <div className="px-4 py-3 bg-slate-900 rounded-md border border-slate-800">
                  <p className="text-slate-100 font-medium text-sm">
                    {user?.username}
                  </p>
                  <p className="text-amber-400 text-xs mt-1">
                    ELO: {user?.elo || 1200}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl space-y-6">
            {/* Welcome Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-1">
                Xin chào, {user?.username}
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                Sẵn sàng cho một ván cờ mới? Tạo phòng mới hoặc nhập mã để vào
                phòng có sẵn.
              </p>
            </div>

            {/* Quick Stats / Shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
                <Star className="w-5 h-5 mx-auto mb-2 text-amber-400" />
                <div className="text-2xl font-semibold text-amber-300">
                  {user?.elo || 1200}
                </div>
                <div className="text-slate-400 text-xs mt-1">ELO Rating</div>
              </div>

              <Link
                href="/profile"
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center hover:bg-slate-800 transition"
              >
                <BarChart2 className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Thống kê</div>
                <div className="text-slate-400 text-xs mt-1">
                  Xem chi tiết profile
                </div>
              </Link>

              <Link
                href="/leaderboard"
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center hover:bg-slate-800 transition"
              >
                <Trophy className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Xếp hạng</div>
                <div className="text-slate-400 text-xs mt-1">Top players</div>
              </Link>

              <Link
                href="/match-history"
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center hover:bg-slate-800 transition"
              >
                <History className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Lịch sử</div>
                <div className="text-slate-400 text-xs mt-1">
                  Các ván đã chơi
                </div>
              </Link>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tạo bàn mới */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">Tạo bàn mới</h2>
                  <p className="text-slate-400 text-sm">
                    Bạn sẽ là người tạo phòng và đi trước với quân trắng. Mã
                    phòng sẽ được tạo tự động để chia sẻ với bạn bè.
                  </p>
                  <ul className="text-slate-500 text-xs space-y-1 mt-3">
                    <li>• Đi trước với quân Trắng</li>
                    <li>• Mã phòng tự động</li>
                    <li>• Chờ đối thủ tham gia</li>
                  </ul>
                </div>
                <button
                  onClick={handleCreateRoom}
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg text-sm transition"
                >
                  <Target className="w-4 h-4" />
                  <span>Tạo phòng & vào chơi</span>
                </button>
              </div>
           {/* Vào phòng có sẵn */}
           {/* Chọn phòng đang mở */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-1">Chọn phòng đang mở</h2>
                <p className="text-slate-400 text-sm">
                  Xem danh sách các phòng hiện đang ở trạng thái{" "}
                  <span className="text-emerald-400">available</span> và chọn phòng để vào
                  chơi cùng người khác.
                </p>
                <ul className="text-slate-500 text-xs space-y-1 mt-3">
                  <li>• Thấy ngay các phòng công khai</li>
                  <li>• Không cần nhập mã</li>
                  <li>• Bấm một nút là vào</li>
                </ul>
              </div>
              <button
                onClick={() => router.push("/room/available")}
                className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg text-sm transition"
              >
                <Target className="w-4 h-4" />
                <span>Xem danh sách phòng</span>
              </button>
            </div>

              {/* Vào bàn có sẵn */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-full">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">
                    Vào bàn có sẵn
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Nhập mã phòng được bạn bè gửi để tham gia với quân đen. Ván
                    cờ sẽ bắt đầu ngay khi bạn vào.
                  </p>
                  <ul className="text-slate-500 text-xs space-y-1 mt-3">
                    <li>• Đi sau với quân Đen</li>
                    <li>• Nhập mã do bạn bè cung cấp</li>
                    <li>• Bắt đầu ngay lập tức</li>
                  </ul>
                </div>

                <form onSubmit={handleJoinRoom} className="space-y-3 mt-auto">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.toUpperCase());
                      setError("");
                    }}
                    placeholder="Nhập mã phòng (VD: ABC123)"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono tracking-[0.25em] text-center uppercase"
                    maxLength={8}
                  />
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 rounded-lg text-sm transition"
                  >
                    <Target className="w-4 h-4" />
                    <span>Vào bàn</span>
                  </button>
                </form>
                <p className="text-slate-500 text-xs mt-3 text-center">
                  Nếu vào không được, hãy kiểm tra lại mã hoặc liên hệ người tạo
                  phòng.
                </p>
              </div>
            </div>

            {/* Additional Links + Donate */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Donate card nhấp nháy */}
              <Link
                href="/donate"
                className={`relative bg-slate-900 rounded-lg p-4 text-center transition border 
                  ${
                    donateHighlight
                      ? "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.7)]"
                      : "border-slate-800"
                  }`}
              >
                <div className="absolute -top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-semibold">
                  NEW
                </div>
                <Heart
                  className={`w-5 h-5 mx-auto mb-2 ${
                    donateHighlight ? "text-amber-400" : "text-amber-300"
                  }`}
                />
                <div className="text-sm font-medium text-amber-200">Donate</div>
                <div className="text-slate-400 text-xs mt-1">Ủng hộ tác giả phát triển</div>
              </Link>

              {/* Other Links */}
              <Link
                href="/game/ai"
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center hover:bg-slate-800 transition"
              >
                <Play className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Chơi với máy</div>
                <div className="text-slate-400 text-xs mt-1">Luyện tập offline</div>
              </Link>

              <Link
                href="/tutorial"
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center hover:bg-slate-800 transition"
              >
                <BookOpen className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Hướng dẫn</div>
                <div className="text-slate-400 text-xs mt-1">Quy tắc & chiến thuật</div>
              </Link>

              <Link
                href="/settings"
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center hover:bg-slate-800 transition"
              >
                <Settings className="w-5 h-5 mx-auto mb-2" />
                <div className="text-sm font-medium">Cài đặt</div>
                <div className="text-slate-400 text-xs mt-1">Tuỳ chỉnh trải nghiệm</div>
              </Link>
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
