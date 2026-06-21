import mongoose from "mongoose";

const playerStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Tổng quan
    totalGames: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },

    // Thống kê theo màu
    whiteGames: { type: Number, default: 0 },
    blackGames: { type: Number, default: 0 },
    whiteWins: { type: Number, default: 0 },
    blackWins: { type: Number, default: 0 },
    whiteLosses: { type: Number, default: 0 },
    blackLosses: { type: Number, default: 0 },
    whiteDraws: { type: Number, default: 0 },
    blackDraws: { type: Number, default: 0 },

    // Cách kết thúc
    winsByCheckmate: { type: Number, default: 0 },
    winsByResign: { type: Number, default: 0 },
    winsByDisconnect: { type: Number, default: 0 },
    lossesByCheckmate: { type: Number, default: 0 },
    lossesByResign: { type: Number, default: 0 },
    lossesByDisconnect: { type: Number, default: 0 },

    // Trung bình
    averageGameDuration: { type: Number, default: 0 }, // giây
    averageMovesPerGame: { type: Number, default: 0 },

    // Streaks
    currentWinStreak: { type: Number, default: 0 },
    longestWinStreak: { type: Number, default: 0 },
    currentLossStreak: { type: Number, default: 0 },
    longestLossStreak: { type: Number, default: 0 },

    // ELO cao nhất
    highestElo: { type: Number, default: 1200 },
    lowestElo: { type: Number, default: 1200 },

    lastGameAt: Date,
  },
  { timestamps: true }
);

// Method cập nhật stats sau mỗi trận
playerStatsSchema.methods.updateAfterGame = function (gameData) {
  this.totalGames += 1;
  this.lastGameAt = new Date();

  const { color, result, endReason, moves, duration } = gameData;

  // Cập nhật theo màu
  if (color === "white") {
    this.whiteGames += 1;
  } else {
    this.blackGames += 1;
  }

  // Cập nhật kết quả
  if (result === "win") {
    this.wins += 1;
    if (color === "white") this.whiteWins += 1;
    else this.blackWins += 1;

    // Streak
    this.currentWinStreak += 1;
    this.currentLossStreak = 0;
    if (this.currentWinStreak > this.longestWinStreak) {
      this.longestWinStreak = this.currentWinStreak;
    }

    // Cách thắng
    if (endReason === "checkmate") this.winsByCheckmate += 1;
    else if (endReason === "resign") this.winsByResign += 1;
    else if (endReason === "disconnect") this.winsByDisconnect += 1;
  } else if (result === "loss") {
    this.losses += 1;
    if (color === "white") this.whiteLosses += 1;
    else this.blackLosses += 1;

    // Streak
    this.currentLossStreak += 1;
    this.currentWinStreak = 0;
    if (this.currentLossStreak > this.longestLossStreak) {
      this.longestLossStreak = this.currentLossStreak;
    }

    // Cách thua
    if (endReason === "checkmate") this.lossesByCheckmate += 1;
    else if (endReason === "resign") this.lossesByResign += 1;
    else if (endReason === "disconnect") this.lossesByDisconnect += 1;
  } else if (result === "draw") {
    this.draws += 1;
    if (color === "white") this.whiteDraws += 1;
    else this.blackDraws += 1;

    // Reset streaks
    this.currentWinStreak = 0;
    this.currentLossStreak = 0;
  }

  // Cập nhật trung bình
  const totalDuration =
    this.averageGameDuration * (this.totalGames - 1) + duration;
  this.averageGameDuration = Math.round(totalDuration / this.totalGames);

  const totalMoves = this.averageMovesPerGame * (this.totalGames - 1) + moves;
  this.averageMovesPerGame = Math.round(totalMoves / this.totalGames);
};

export default mongoose.models.PlayerStats ||
  mongoose.model("PlayerStats", playerStatsSchema);
