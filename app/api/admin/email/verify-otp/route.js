import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Thiếu email hoặc mã OTP" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email, role: "admin" });

    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản admin" },
        { status: 404 }
      );
    }

    const rawOtp = String(otp).trim();
    const storedOtp = String(user.otpCode || "").trim();

    // console.log("ADMIN VERIFY OTP:", {
    //   rawOtp,
    //   storedOtp,
    //   expires: user.otpExpires,
    // });

    if (!storedOtp || storedOtp !== rawOtp) {
      return NextResponse.json(
        { message: "Mã OTP không hợp lệ" },
        { status: 400 }
      );
    }

    if (!user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return NextResponse.json(
        { message: "Mã OTP đã hết hạn" },
        { status: 400 }
      );
    }

    // Xóa OTP sau khi dùng
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    // Tạo token admin
    const token = signToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json(
      {
        message: "Đăng nhập admin thành công",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN VERIFY OTP ERROR:", err);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}
