// ============================================
// FILE: components/game/ChessBoard.jsx
// ============================================
"use client";

import { useEffect, useRef } from "react";

export function ChessBoard({
  game,
  playerColor = "white",
  onMove,
  disabled = false,
}) {
  const boardRef = useRef(null);
  const boardInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.Chessboard || !game) return;

    const config = {
      draggable: !disabled,
      position: game.fen(),
      pieceTheme: "/img/chesspieces/wikipedia/{piece}.png",
      showNotation: false,
      onDragStart: (source, piece) => {
        if (disabled) return false;
        if (game.game_over()) return false;

        // Không cho kéo quân đối phương
        if (playerColor === "black" && piece.startsWith("w")) return false;
        if (playerColor === "white" && piece.startsWith("b")) return false;

        // Không phải lượt mình
        if (game.turn() === "w" && playerColor !== "white") return false;
        if (game.turn() === "b" && playerColor !== "black") return false;
      },
      onDrop: (source, target) => {
        const move = { from: source, to: target, promotion: "q" };
        const result = game.move(move);

        if (!result) return "snapback";

        if (onMove) onMove(move);
        return undefined;
      },
      onSnapEnd: () => {
        boardInstanceRef.current?.position(game.fen());
      },
    };

    const board = window.Chessboard("chessBoard", config);
    boardInstanceRef.current = board;

    if (playerColor === "black") {
      board.flip();
    }

    return () => {
      if (boardInstanceRef.current?.destroy) {
        boardInstanceRef.current.destroy();
      }
    };
  }, [game, playerColor, disabled, onMove]);

  // Cập nhật position khi game thay đổi
  useEffect(() => {
    if (boardInstanceRef.current && game) {
      boardInstanceRef.current.position(game.fen());
    }
  }, [game?.fen()]);

  return (
    <div className="p-5 border-[10px] border-amber-900 rounded-xl shadow-[0_0_25px_rgba(255,165,0,0.7)] bg-black/75 backdrop-blur">
      <div
        id="chessBoard"
        style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
      />
    </div>
  );
}
