// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { signToken, createAuthCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Thiếu username hoặc password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: "Sai username hoặc password" },
        { status: 400 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Sai username hoặc password" },
        { status: 400 }
      );
    }

    const token = signToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set(createAuthCookie(token));

    // 👉 ĐÁNH DẤU ONLINE + LOG RA CONSOLE
    const result = await User.updateOne(
      { _id: user._id },
      { $set: { isOnline: true } }
    );
    //console.log("🔵 LOGIN set isOnline=true:", user.username, result);

    return NextResponse.json(
      {
        message: "Đăng nhập thành công",
        user: {
          id: user._id,
          username: user.username,
          elo: user.elo,
          role: user.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
