"use client";

import dynamic from "next/dynamic";

// Dynamic import Sparkles - chỉ render ở client
const Sparkles = dynamic(
  () =>
    import("@/components/layout/Sparkles").then((mod) => ({
      default: mod.Sparkles,
    })),
  {
    ssr: false, // ✅ Được phép ở client component
    loading: () => null,
  }
);

export function RootLayoutClient({ children }) {
  return (
    <>
      <Sparkles />
      {children}
    </>
  );
}
