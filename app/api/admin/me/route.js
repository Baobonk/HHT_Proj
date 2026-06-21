import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    //console.log("=== [API /admin/me] BẮT ĐẦU ===");

    await connectDB();
    //console.log("→ MongoDB đã kết nối");

    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    //console.log("→ Token nhận được:", token || "⛔ KHÔNG CÓ TOKEN");

    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      //console.log("→ Decode JWT:", decoded);
    } catch (err) {
      //console.log("⛔ Lỗi verify token:", err);
      return NextResponse.json({ message: "Token không hợp lệ" }, { status: 401 });
    }

    //console.log("→ ID lấy từ token:", decoded.id);

    const user = await User.findById(decoded.id)
      .select("-password -resetPasswordToken -resetPasswordExpires -verificationToken")
      .lean();

    //console.log("→ MongoDB trả ra user:", user);

    if (!user) {
      return NextResponse.json({ message: "Không tìm thấy admin" }, { status: 404 });
    }

    //console.log("=== [API /admin/me] TRẢ VỀ THÀNH CÔNG ===");

    return NextResponse.json(
      {
        admin: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar || null,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("⛔ GET /api/admin/me error:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
