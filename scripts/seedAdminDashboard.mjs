// scripts/seedAdminDashboard.mjs
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

//console.log("🔎 MONGODB_URI in seed script:", process.env.MONGODB_URI);

// Dùng dynamic import để đảm bảo dotenv chạy trước
const { default: connectDB } = await import("../lib/db.js");
const { default: User } = await import("../models/User.js");
const { default: MatchHistory } = await import("../models/MatchHistory.js");
const mongoose = (await import("mongoose")).default;

// Helpers
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Các constant cho fake dữ liệu
const COLORS = ["white", "black"];

// ⚠ endReason: bỏ "draw" vì schema không cho phép
const END_REASONS = ["checkmate", "resign", "timeout", "stalemate"];

// Kết quả ván cờ (ok, schema cho phép)
const RESULTS = ["win", "loss", "draw"];

async function main() {
  await connectDB();
  //console.log("✅ Connected to MongoDB");

  // ====== CẤU HÌNH SỐ LƯỢNG FAKE ======
  const NUM_USERS = 30; // số user muốn thêm thêm
  const MATCHES_PER_USER_MIN = 20;
  const MATCHES_PER_USER_MAX = 80;
  // ====================================

  // ⚠ NẾU MUỐN RESET SẠCH MỖI LẦN SEED => BỎ COMMENT 2 DÒNG NÀY:
  // await User.deleteMany({});
  // await MatchHistory.deleteMany({});

  // 1) Tạo admin nếu chưa có
  let admin = await User.findOne({ username: "admin" });
  if (!admin) {
    admin = await User.create({
      username: "admin",
      password: "123456", // sẽ được hash bởi pre('save')
      email: "admin@example.com",
      fullName: "Admin",
      elo: 2000,
      role: "admin",
    });
    //console.log("✅ Created admin user: admin / 123456");
  }

  // Lấy toàn bộ username hiện có để tránh trùng
  const existingUsers = await User.find({}, "username").lean();
  const usedUsernames = new Set(existingUsers.map((u) => u.username));

  // 2) Tạo user thường mới, đảm bảo KHÔNG trùng username
  const sampleNames = [
    "Alpha",
    "Bravo",
    "Charlie",
    "Delta",
    "Echo",
    "Foxtrot",
    "Gamma",
    "Knight",
    "Bishop",
    "Rook",
    "Queen",
    "King",
    "Pawn",
    "Dragon",
    "Phoenix",
  ];

  const usersToInsert = [];
  for (let i = 0; i < NUM_USERS; i++) {
    let username;

    // Generate tới khi ra username chưa dùng
    do {
      const baseName = pickRandom(sampleNames);
      username = `${baseName.toLowerCase()}${randomInt(1, 999)}`;
    } while (usedUsernames.has(username));

    usedUsernames.add(username);

    // ELO phân bố: nhiều người 800-1500, ít người 2000+
    let elo;
    const r = Math.random();
    if (r < 0.6) elo = randomInt(800, 1500);
    else if (r < 0.9) elo = randomInt(1500, 2000);
    else elo = randomInt(2000, 2400);

    // createdAt rải đều 6 tháng gần đây
    const now = new Date();
    const daysAgo = randomInt(0, 180);
    const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    usersToInsert.push({
      username,
      password: "123456", // sẽ được hash bởi pre('save') trong model
      email: `${username}@test.com`,
      fullName: `${username} Player`,
      elo,
      role: "user",
      createdAt,
      updatedAt: createdAt,
    });
  }

  let insertedUsers = [];
  if (usersToInsert.length > 0) {
    insertedUsers = await User.insertMany(usersToInsert);
    //console.log(`✅ Inserted ${insertedUsers.length} new users`);
  } else {
    //console.log("ℹ Không có user mới nào để insert (đủ username rồi).");
  }

  const allUsers = [admin, ...insertedUsers];

  // Nếu bạn muốn tạo MatchHistory cho cả user cũ luôn:
  // const allUsers = await User.find().lean();

  // 3) Tạo MatchHistory cho 6 tháng gần đây
  const matchesToInsert = [];
  const now = new Date();

  for (const user of allUsers) {
    const numMatches = randomInt(MATCHES_PER_USER_MIN, MATCHES_PER_USER_MAX);

    for (let i = 0; i < numMatches; i++) {
      const daysAgo = randomInt(0, 180);
      const playedAt = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000
      );

      let opponent = pickRandom(allUsers);
      if (opponent._id.toString() === user._id.toString()) {
        opponent = pickRandom(allUsers);
      }

      const result = pickRandom(RESULTS); // win/loss/draw
      const myColor = pickRandom(COLORS); // white/black
      const endReason = pickRandom(END_REASONS); // checkmate / resign / timeout / stalemate
      const gameId = new mongoose.Types.ObjectId(); // fake ID ván đấu

      matchesToInsert.push({
        userId: user._id,
        opponentId: opponent._id,
        result,
        playedAt,
        endReason,
        myColor,
        gameId,
        createdAt: playedAt,
        updatedAt: playedAt,
      });
    }
  }

  if (matchesToInsert.length > 0) {
    await MatchHistory.insertMany(matchesToInsert);
    //console.log(`✅ Inserted ${matchesToInsert.length} match histories`);
  }

  //console.log("🌟 DONE. Dashboard sẽ có dữ liệu rất đẹp.");
}

main()
  .then(() => {
    //console.log("Seed finished.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
