import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MatchHistory from "@/models/MatchHistory";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const matches = await MatchHistory.find({ userId })
      .sort({ playedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await MatchHistory.countDocuments({ userId });

    return NextResponse.json({
      matches,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching match history:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
