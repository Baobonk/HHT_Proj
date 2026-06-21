import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import EloHistory from "@/models/EloHistory";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const history = await EloHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching ELO history:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
