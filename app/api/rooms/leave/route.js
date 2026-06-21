import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function POST(request) {
  try {
    // Lấy token user
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;

    // Lấy code từ FE gửi lên
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json(
        { message: "Room code is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const room = await Room.findOne({ code: code.toUpperCase() });
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    // ❗❗ CASE 1: CHỦ PHÒNG RỜI → XÓA LUÔN PHÒNG
    if (room.creator?.toString() === userId.toString()) {
      await Room.deleteOne({ _id: room._id });

      //console.log("🗑️ Room deleted because host left:", room.code);

      return NextResponse.json(
        { message: "Host left → Room deleted" },
        { status: 200 }
      );
    }

    // ❗ CASE 2: Người chơi bình thường rời
    room.players = room.players.filter(
      (p) => p.toString() !== userId.toString()
    );

    // Nếu không còn ai → xóa phòng
    if (room.players.length === 0) {
      await Room.deleteOne({ _id: room._id });

      //console.log("🗑️ Room deleted (no players left):", room.code);

      return NextResponse.json(
        { message: "Room deleted because no players left" },
        { status: 200 }
      );
    }

    // Nếu còn người → cập nhật trạng thái
    room.status = room.players.length === 1 ? "available" : "in-progress";

    await room.save();

    return NextResponse.json({ room }, { status: 200 });

  } catch (error) {
    console.error("❌ Error leaving room:", error);
    return NextResponse.json(
      { message: "Error leaving room", error: error.message },
      { status: 500 }
    );
  }
}
