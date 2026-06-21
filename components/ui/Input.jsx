// ============================================
// FILE: components/ui/Input.jsx
// ============================================
"use client";

import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, required, className = "", ...props },
  ref
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-[var(--color-soft)] text-sm font-medium">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`input-field ${error ? "border-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
});
