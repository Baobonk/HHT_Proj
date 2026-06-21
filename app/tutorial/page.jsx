"use client";

import { useRouter } from "next/navigation";

export default function TutorialPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-slate-900/95 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <div>
            <h1 className="text-slate-100 font-semibold text-base">Chess Online</h1>
            <p className="text-slate-400 text-xs">Hướng dẫn chơi</p>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-5xl">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-10">
            <h2 className="text-3xl font-semibold mb-4">Hướng dẫn chơi cờ vua</h2>

            <p className="text-slate-400 mb-4">
              Đây là hướng dẫn cơ bản cho người mới bắt đầu chơi cờ vua trực tuyến.
            </p>

            <ul className="text-slate-500 list-disc pl-6 space-y-2">
              <li>Tạo hoặc tham gia phòng cờ.</li>
              <li>Chọn quân Trắng hoặc Đen.</li>
              <li>Di chuyển quân theo luật.</li>
              <li>Cạnh tranh để giành chiến thắng.</li>
              <li>Xem lại ván đấu và phân tích.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6">Quy tắc cơ bản:</h3>

            <ul className="text-slate-500 list-disc pl-6 space-y-2">
              <li>Quân cờ di chuyển theo kiểu nhất định.</li>
              <li>Chiếm quân bằng cách đi vào ô đối phương.</li>
              <li>Mục tiêu cuối cùng là chiếu hết vua.</li>
            </ul>
          </div>

          {/* BUTTON — đặt TRƯỚC FOOTER */}
          <div className="flex justify-center mb-16 mt-6">
            <a
                href="/room"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg inline-block"
            >
                ← Quay lại phòng chơi
            </a>
            </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900/95 border-t border-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-xs">© 2024 Chess Online · Built with care</p>
        </div>
      </footer>
    </div>
  );
}
