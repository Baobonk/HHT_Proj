// app/api/auth/forgot-password/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import User from "@/models/User";
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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Thiếu email" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Email không được tìm thấy" },
        { status: 400 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Đặt lại mật khẩu Chess Online",
      html: `
        <h1>Đặt lại mật khẩu</h1>
        <p>Nhấn vào liên kết dưới đây để đặt lại mật khẩu (hết hạn sau 1 giờ):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    return NextResponse.json({
      message: "Đã gửi email đặt lại mật khẩu",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
