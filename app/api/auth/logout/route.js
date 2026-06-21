// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST() {
  try {
    //console.log("🚪 [API] Processing logout...");
    await connectDB();

    // 👉 PHẢI await cookies()
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 👉 đặt offline
        await User.updateOne(
          { _id: decoded.id },
          { $set: { isOnline: false } }
        );

        //console.log("🔴 LOGOUT set isOnline=false:", decoded.username);
      } catch (err) {
        console.warn("⚠ Token invalid or expired:", err.message);
      }
    }

    // 👉 XÓA COOKIE đúng chuẩn Next.js 14
    cookieStore.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    //console.log("✅ [API] Logout successful, cookie cleared");

    return NextResponse.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("❌ [API] Logout error:", error);

    // cố xoá cookie lần nữa
    try {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "token",
        value: "",
        maxAge: 0,
        path: "/",
      });
    } catch {}

    return NextResponse.json({ message: "Đã đăng xuất" });
  }
}
