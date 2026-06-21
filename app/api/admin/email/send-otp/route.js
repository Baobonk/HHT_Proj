import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Thiếu email" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
    email,
    role: { $in: ["admin", "user"] }
    });


    if (!user) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản admin với email này" },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    //console.log("ADMIN SEND OTP:", { email, otp });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Chess Admin" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your Admin Login Code",
      html: `
        <h2>Your Admin Login Code</h2>
        <p style="font-size: 20px; font-weight: bold;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      `,
    });

    return NextResponse.json(
      { message: "Mã đăng nhập admin đã được gửi" },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN SEND OTP ERROR:", err);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
  }
}
