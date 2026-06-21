// app/api/admin/dashboard/summary/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import MatchHistory from "@/models/MatchHistory";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const totalUsers = await User.countDocuments();
    const totalMatches = await MatchHistory.countDocuments();

    const matchesToday = await MatchHistory.countDocuments({
      playedAt: { $gte: startOfToday },
    });

    const activeUserIdsToday = await MatchHistory.distinct("userId", {
      playedAt: { $gte: startOfToday },
    });
    const dailyActiveUsers = activeUserIdsToday.length;

    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    // 👉 ĐẾM NGƯỜI ONLINE + LOG CHI TIẾT
    const onlineUsers = await User.find({ isOnline: true })
      .select("username role isOnline")
      .lean();

    const onlineNow = onlineUsers.length;

    //console.log("🟢 ONLINE USERS:", onlineUsers);

    const revenue24h = 0;

    const months = [];
    const matchesPerMonth = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();

      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);

      const count = await MatchHistory.countDocuments({
        playedAt: { $gte: start, $lt: end },
      });

      months.push(
        start.toLocaleDateString("en-US", { month: "short" })
      );
      matchesPerMonth.push(count);
    }

    const eloUnder1000 = await User.countDocuments({ elo: { $lt: 1000 } });
    const elo1000_1399 = await User.countDocuments({
      elo: { $gte: 1000, $lt: 1400 },
    });
    const elo1400_1799 = await User.countDocuments({
      elo: { $gte: 1400, $lt: 1800 },
    });
    const elo1800_2199 = await User.countDocuments({
      elo: { $gte: 1800, $lt: 2200 },
    });
    const elo2200Plus = await User.countDocuments({ elo: { $gte: 2200 } });

    const eloDistribution = [
      { label: "<1000", count: eloUnder1000 },
      { label: "1000-1399", count: elo1000_1399 },
      { label: "1400-1799", count: elo1400_1799 },
      { label: "1800-2199", count: elo1800_2199 },
      { label: ">=2200", count: elo2200Plus },
    ];

    const topPlayers = await User.find()
      .select("username elo fullName")
      .sort({ elo: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      summary: {
        totalUsers,
        totalMatches,
        matchesToday,
        dailyActiveUsers,
        newUsersToday,
        onlineNow,
        revenue24h,
      },
      charts: {
        matchesTrend: {
          labels: months,
          data: matchesPerMonth,
        },
        eloDistribution,
      },
      topPlayers,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard summary:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
