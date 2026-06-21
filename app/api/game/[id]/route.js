import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Game from "@/models/Game";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const gameId = params.id;

    const game = await Game.findById(gameId)
      .populate("white.userId", "username elo")
      .populate("black.userId", "username elo")
      .lean();

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
