// scripts/deleteRooms.mjs
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

//console.log("🔎 MONGODB_URI:", process.env.MONGODB_URI);

// Dynamic import để chắc chắn dotenv chạy trước
const { default: connectDB } = await import("../lib/db.js");
const { default: Room } = await import("../models/Room.js");

async function main() {
  await connectDB();
  //console.log("✅ Connected to MongoDB");

  // ============================
  // CÁC CHẾ ĐỘ XOÁ DỮ LIỆU
  // ============================

  // 1️⃣ XOÁ TOÀN BỘ PHÒNG (ĐANG BẬT)
  const result = await Room.deleteMany({});
  //console.log(`🗑 Đã xoá TOÀN BỘ ${result.deletedCount} phòng trong DB`);

  // 2️⃣ Xóa các phòng không có người chơi
  // const result = await Room.deleteMany({ players: { $size: 0 } });
  // console.log(`🗑 Đã xoá ${result.deletedCount} phòng (players = 0)`);

  // 3️⃣ Xóa phòng theo status
  // const result = await Room.deleteMany({ status: "in-progress" });
  // console.log(`🗑 Đã xoá ${result.deletedCount} phòng đang in-progress`);

  // 4️⃣ Xóa phòng theo mã code
  // const result = await Room.deleteOne({ code: "ABC123" });
  // console.log("🗑 Đã xoá phòng code ABC123:", result);

  // 5️⃣ Xóa phòng theo _id
  // const result = await Room.findByIdAndDelete("672a8fa7...");
  // console.log("🗑 Đã xoá phòng theo ID:", result);

  console.log("✨ DONE — xoá phòng hoàn tất.");
}

main()
  .then(() => {
    console.log("👌 Script delete hoàn tất");
    process.exit(0);
  })
  .catch((err) => {
    console.error("🔥 Lỗi trong script delete:", err);
    process.exit(1);
  });
