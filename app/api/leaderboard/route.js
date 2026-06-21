import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PlayerStats from "@/models/PlayerStats";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const sortBy = searchParams.get("sortBy") || "elo"; // elo, wins, games

    let sortCriteria = {};
    if (sortBy === "elo") {
      sortCriteria = { elo: -1 };
    } else if (sortBy === "wins") {
      sortCriteria = { "stats.wins": -1 };
    } else if (sortBy === "games") {
      sortCriteria = { "stats.totalGames": -1 };
    }

    const users = await User.find()
      .select("username elo fullName")
      .sort(sortCriteria)
      .limit(limit)
      .lean();

    // Lấy stats cho mỗi user
    const userIds = users.map((u) => u._id);
    const stats = await PlayerStats.find({ userId: { $in: userIds } }).lean();

    const statsMap = {};
    stats.forEach((s) => {
      statsMap[s.userId.toString()] = s;
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      fullName: user.fullName,
      elo: user.elo,
      stats: statsMap[user._id.toString()] || {},
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
