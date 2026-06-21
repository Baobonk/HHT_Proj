// ============================================
// FILE: components/ui/Button.jsx
// ============================================
"use client";

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseClass =
    "font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "btn-primary",
    gradient: "btn-gradient",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    outline:
      "border border-[var(--color-border-subtle)] bg-transparent text-[var(--color-soft)] hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Đang xử lý...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
