// app/api/game/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      gameStats: {
        elo: user.elo,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Game stats error:", error);
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
  }
}
