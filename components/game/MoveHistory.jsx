// ============================================
// FILE: components/game/MoveHistory.jsx
// ============================================
"use client";

import { useEffect, useRef } from "react";

export function MoveHistory({ history = [] }) {
  const containerRef = useRef(null);

  // Auto scroll xuống cuối
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history.length]);

  if (history.length === 0) {
    return (
      <div className="bg-[var(--color-bg-input)] rounded-lg p-3 text-[var(--color-soft)] text-sm">
        Chưa có nước đi nào
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-[var(--color-bg-input)] rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-sm"
    >
      {history.map((move, i) => (
        <span key={i} className="inline">
          {i % 2 === 0 && (
            <span className="text-[var(--color-soft)]">
              {Math.floor(i / 2) + 1}.{" "}
            </span>
          )}
          <span className="text-white hover:bg-white/10 px-0.5 rounded cursor-default">
            {move.san || move}
          </span>{" "}
        </span>
      ))}
    </div>
  );
}
