// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken, createAuthCookie } from "@/lib/auth";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request) {
  try {
    await connectDB();
    const { username, password, email, fullName, birthDay, sex, address } =
      await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Thiếu username hoặc password" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json(
        { message: "Username đã tồn tại" },
        { status: 400 }
      );
    }

    const user = new User({
      username,
      password,
      email: email || "",
      fullName: fullName || "",
      birthDay: birthDay || null,
      sex: sex || "",
      address: address || "",
    });

    await user.save();

    // Gửi email xác nhận
    if (email) {
      await transporter.sendMail({
        to: email,
        subject: "Chào mừng đến Chess Online!",
        html: `<h1>Đăng ký thành công</h1><p>Tài khoản ${username} đã được tạo. Chơi cờ vua ngay thôi!</p>`,
      });
    }

    const token = signToken({
      id: user._id.toString(),
      username: user.username,
    });

    const cookieStore = await cookies();
    cookieStore.set(createAuthCookie(token));

    return NextResponse.json({
      message: "Đăng ký thành công",
      user: {
        id: user._id,
        username: user.username,
        elo: user.elo,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
