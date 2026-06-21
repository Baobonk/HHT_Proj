// ============================================
// FILE: components/game/GameStatus.jsx
// ============================================
"use client";

import { getTurnColor } from "@/lib/utils";

export function GameStatus({
  game,
  gameStarted,
  gameOver,
  opponentDisconnected,
}) {
  const getStatus = () => {
    if (!game) return "Đang tải...";
    if (opponentDisconnected) return "🏆 Đối thủ đã ngắt kết nối, bạn thắng!";
    if (!gameStarted) return "⏳ Đang chờ đối thủ tham gia...";

    const turn = getTurnColor(game.turn());

    if (game.in_checkmate()) return `🎉 Chiếu hết! ${turn} thua!`;
    if (game.in_draw()) return "🤝 Hòa!";
    if (game.in_stalemate()) return "🤝 Hòa do bế tắc!";

    let status = `${turn} đến lượt`;
    if (game.in_check()) status += " - ⚠️ Chiếu!";

    return status;
  };

  return (
    <div className="text-xl font-semibold text-[var(--color-accent)]">
      {getStatus()}
    </div>
  );
}
