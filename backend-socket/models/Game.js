import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      index: true,
    },

    // Thông tin người chơi
    white: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: String,
      eloBeforeGame: Number,
      eloAfterGame: Number,
      eloChange: Number,
    },

    black: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: String,
      eloBeforeGame: Number,
      eloAfterGame: Number,
      eloChange: Number,
    },

    // Kết quả
    result: {
      type: String,
      enum: [
        "white_win",
        "black_win",
        "draw",
        "white_disconnect",
        "black_disconnect",
        "white_resign",
        "black_resign",
      ],
      required: true,
    },

    winner: {
      type: String,
      enum: ["white", "black", "draw"],
    },

    endReason: {
      type: String,
      enum: [
        "checkmate",
        "resign",
        "disconnect",
        "draw_agreement",
        "stalemate",
        "insufficient_material",
        "timeout",
      ],
      required: true,
    },

    // PGN và FEN
    pgn: {
      type: String,
      required: true,
    },

    finalFen: String,

    // Thống kê
    totalMoves: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number, // Tính bằng giây
      default: 0,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    endedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Index để query nhanh
gameSchema.index({ "white.userId": 1, createdAt: -1 });
gameSchema.index({ "black.userId": 1, createdAt: -1 });
gameSchema.index({ createdAt: -1 });

export default mongoose.models.Game || mongoose.model("Game", gameSchema);
