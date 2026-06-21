import mongoose from "mongoose";

const eloHistorySchema = new mongoose.Schema(
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
    },

    eloBefore: {
      type: Number,
      required: true,
    },

    eloAfter: {
      type: Number,
      required: true,
    },

    eloChange: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      enum: [
        "win",
        "loss",
        "draw",
        "disconnect_loss",
        "resign_loss",
        "opponent_disconnect",
        "opponent_resign",
      ],
      required: true,
    },

    opponentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    opponentUsername: String,
    opponentEloBefore: Number,
  },
  { timestamps: true }
);

// Index để query lịch sử theo user
eloHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.EloHistory ||
  mongoose.model("EloHistory", eloHistorySchema);
