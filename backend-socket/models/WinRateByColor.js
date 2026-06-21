import mongoose from "mongoose";

const winRateByColorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Quân Trắng
    white: {
      games: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 }, // %
      avgEloChange: { type: Number, default: 0 },
    },

    // Quân Đen
    black: {
      games: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      winRate: { type: Number, default: 0 }, // %
      avgEloChange: { type: Number, default: 0 },
    },

    // Tổng hợp
    preferredColor: {
      type: String,
      enum: ["white", "black", "neutral"],
      default: "neutral",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Method tính toán lại win rate
winRateByColorSchema.methods.recalculate = function () {
  // Tính win rate Trắng
  if (this.white.games > 0) {
    this.white.winRate = Math.round((this.white.wins / this.white.games) * 100);
  }

  // Tính win rate Đen
  if (this.black.games > 0) {
    this.black.winRate = Math.round((this.black.wins / this.black.games) * 100);
  }

  // Xác định màu ưa thích
  if (this.white.winRate > this.black.winRate + 10) {
    this.preferredColor = "white";
  } else if (this.black.winRate > this.white.winRate + 10) {
    this.preferredColor = "black";
  } else {
    this.preferredColor = "neutral";
  }

  this.lastUpdated = new Date();
};

export default mongoose.models.WinRateByColor ||
  mongoose.model("WinRateByColor", winRateByColorSchema);
