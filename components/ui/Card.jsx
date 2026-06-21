// ============================================
// FILE: components/ui/Card.jsx
// ============================================
export function Card({ children, className = "", ...props }) {
  return (
    <div className={`card p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
