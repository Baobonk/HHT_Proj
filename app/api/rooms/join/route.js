import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { code, password } = await request.json();

    if (!code) {
      return NextResponse.json(
        { message: "Room code is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const room = await Room.findOne({ code: code.toUpperCase() });

    if (!room) {
      return NextResponse.json(
        { message: "Room not found" },
        { status: 404 }
      );
    }

    // 🔐 KIỂM TRA MẬT KHẨU NẾU PHÒNG PRIVATE
    if (room.isPrivate) {
      if (!password) {
        return NextResponse.json(
          { message: "Phòng này yêu cầu mật khẩu" },
          { status: 403 }
        );
      }

      if (room.password !== password) {
        return NextResponse.json(
          { message: "Mật khẩu không đúng" },
          { status: 403 }
        );
      }
    }

    const userId = decoded.id;

    // 🚫 Không cho user join 2 lần
    const alreadyIn = room.players.some(
      (p) => p.toString() === userId.toString()
    );

    if (!alreadyIn) {
      // 👤 Thêm người chơi
      room.players.push(userId);
    }

    // 🟢 Cập nhật trạng thái phòng
    if (room.players.length >= 2) {
      room.status = "in-progress";
    } else if (room.players.length === 1) {
      room.status = "available";
    }

    await room.save();

    // ❗ Không trả mật khẩu về cho client
    const safeRoom = {
      _id: room._id,
      code: room.code,
      status: room.status,
      creator: room.creator,
      players: room.players,
      createdAt: room.createdAt,
      isPrivate: room.isPrivate,
    };

    return NextResponse.json({ room: safeRoom }, { status: 200 });

  } catch (error) {
    console.error("❌ Error joining room:", error);
    return NextResponse.json(
      { message: "Error joining room", error: error.message },
      { status: 500 }
    );
  }
}
