"use client";

import { useEffect, useState } from "react";

export function Sparkles() {
  const [sparkles, setSparkles] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Chỉ generate sparkles ở client sau khi mount
  useEffect(() => {
    setMounted(true);

    // Generate sparkles
    const generateSparkles = () => {
      const sparkleArray = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 4,
      }));
      setSparkles(sparkleArray);
    };

    generateSparkles();
  }, []); // Run once on mount

  // Chỉ render sparkles khi mounted (hydration safe)
  if (!mounted) {
    return null;
  }

  return (
    <>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            top: `${sparkle.top}vh`,
            left: `${sparkle.left}vw`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}
    </>
  );
}
