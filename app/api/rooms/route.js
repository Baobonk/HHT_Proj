// app/api/rooms/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/Room";

export async function GET() {
  try {
    await connectDB();

    // Không trả trường password
    const rooms = await Room.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching rooms:", error);
    return NextResponse.json(
      { message: "Error fetching rooms", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { code, creator, password } = body;

    if (!code) {
      return NextResponse.json(
        { message: "Room code is required" },
        { status: 400 }
      );
    }

    const newRoom = await Room.create({
      code: code.toUpperCase(),
      creator: creator || null,
      players: creator ? [creator] : [],
      status: "available",

      // 🔐 Lưu mật khẩu
      password: password || null,
      isPrivate: password ? true : false,
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating room:", error);
    return NextResponse.json(
      { message: "Error creating room", error: error.message },
      { status: 500 }
    );
  }
}
