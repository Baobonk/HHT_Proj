import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Thiếu username hoặc password" },
        { status: 400 }
      );
    }

    // Nên chuẩn hóa về lowercase vì schema có lowercase: true
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản" },
        { status: 404 }
      );
    }

    // console.log(
    //   "[ADMIN LOGIN] Thử đăng nhập:",
    //   user.username,
    //   "role =",
    //   user.role
    // );

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Mật khẩu không chính xác" },
        { status: 401 }
      );
    }

    // Player: không được login admin
    if (user.role === "player") {
      return NextResponse.json(
        {
          message:
            "Tài khoản player không được phép đăng nhập vào hệ thống quản trị.",
        },
        { status: 403 }
      );
    }

    // Cho phép cả admin + user login vào /admin
    // Quyền chi tiết (thêm/sửa/xóa user) đã check ở API /api/admin/users

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json(
      {
        message: "Đăng nhập admin thành công",
        role: user.role, // nếu muốn FE biết luôn để hiển thị UI theo quyền
      },
      { status: 200 }
    );

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}
