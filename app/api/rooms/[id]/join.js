import { connectToDatabase } from "../../../../lib/db";
import Room from "../../../../models/Room";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // nếu bạn dùng route.js trong app router thì sẽ khác chút

  if (method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDatabase();

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.status !== "available") {
      return res.status(400).json({ message: "Phòng đã đầy hoặc không khả dụng" });
    }

    // ở đây bạn có thể check thêm số người trong phòng,
    // ví dụ nếu bạn có field players, maxPlayers,...
    // demo đơn giản: join xong đánh dấu phòng full
    room.status = "full";
    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error joining room", error: error.message });
  }
}
