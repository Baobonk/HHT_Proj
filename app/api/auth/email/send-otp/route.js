import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Thiếu email" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Email không tồn tại" }, { status: 404 });
    }

    // Tạo mã OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu vào DB (10 phút hết hạn)
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    
    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Chess App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your Login Code",
      html: `
        <h2>Your Login Code</h2>
        <p style="font-size: 20px; font-weight: bold;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    return NextResponse.json({ message: "OTP đã gửi thành công" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
