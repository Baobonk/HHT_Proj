// ============================================
// FILE: components/game/GameControls.jsx
// ============================================
"use client";

import { Button } from "@/components/ui/Button";

export function GameControls({
  onNewGame,
  onUndo,
  onResign,
  onLeave,
  canUndo = true,
  canResign = true,
  isAIGame = false,
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {isAIGame && (
          <>
            <Button variant="primary" onClick={onNewGame} className="flex-1">
              🔄 Ván mới
            </Button>
            <Button
              variant="primary"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex-1"
            >
              ↶ Hoàn tác
            </Button>
          </>
        )}
      </div>

      {canResign && !isAIGame && (
        <Button variant="outline" onClick={onResign} className="w-full">
          🏳️ Đầu hàng
        </Button>
      )}

      <Button variant="danger" onClick={onLeave} className="w-full">
        🚪 {isAIGame ? "Về trang chủ" : "Rời phòng"}
      </Button>
    </div>
  );
}
