import mongoose from "mongoose";

const matchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },

    // Thông tin cơ bản
    opponentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    opponentUsername: String,
    opponentElo: Number,

    myColor: {
      type: String,
      enum: ["white", "black"],
      required: true,
    },

    result: {
      type: String,
      enum: ["win", "loss", "draw"],
      required: true,
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

    // Điểm số
    eloChange: Number,
    eloAfter: Number,

    // Thông tin trận đấu
    totalMoves: Number,
    duration: Number, // giây
    playedAt: {
      type: Date,
      required: true,
    },

    // Quick access (không cần join)
    roomCode: String,
    pgn: String,
  },
  { timestamps: true }
);

// Index để query nhanh
matchHistorySchema.index({ userId: 1, playedAt: -1 });
matchHistorySchema.index({ userId: 1, result: 1 });

export default mongoose.models.MatchHistory ||
  mongoose.model("MatchHistory", matchHistorySchema);
