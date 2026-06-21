// app/donate/page.jsx
"use client";

import Link from "next/link";

export default function DonatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-white">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-semibold mb-4">Cảm ơn bạn đã ủng hộ!</h1>
        <p className="text-gray-400 mb-6">Hãy quét mã QR dưới đây để thực hiện donation:</p>
        <img 
          src="https://img.vietqr.io/image/VBA-8805205087038-compact2.png?amount=120404&addInfo=Donate%for%PDK&accountName=PhamDangKhue"
          alt="QR Code for Donation"
          className="mx-auto mb-6"
        />
        <p className="text-gray-300 text-sm mb-6">
          Mã QR này sẽ giúp bạn chuyển tiền đến tài khoản của tôi. Cảm ơn sự hỗ trợ của bạn!
        </p>
        
        {/* Nút Quay lại trang Room */}
        <Link
          href="/room"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
        >
          🔙 Quay lại trang phòng
        </Link>
      </div>
    </div>
  );
}
