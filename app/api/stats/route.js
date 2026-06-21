import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PlayerStats from "@/models/PlayerStats";
import WinRateByColor from "@/models/WinRateByColor";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const user = await User.findById(userId).select("-password");
    const stats = await PlayerStats.findOne({ userId });
    const winRate = await WinRateByColor.findOne({ userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        username: user.username,
        elo: user.elo,
        fullName: user.fullName,
      },
      stats: stats || {},
      winRate: winRate || {},
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
