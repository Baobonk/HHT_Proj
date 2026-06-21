// components/Card.jsx
import { TrendingUp, TrendingDown, Users, Gamepad2, DollarSign, Activity } from "lucide-react";

const iconMap = {
  users: Users,
  game: Gamepad2,
  revenue: DollarSign,
  activity: Activity,
  up: TrendingUp,
  down: TrendingDown,
};

export default function Card({ 
  title, 
  value, 
  extra, 
  trend = null,     // "up" | "down" | null
  icon = null,      // "users" | "game" | "revenue" | "activity"
  variant = "default" // "default" | "purple" | "green" | "orange"
}) {
  const IconComponent = icon ? iconMap[icon] : null;

  const variants = {
    default: "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
    purple: "from-purple-500/20 to-pink-600/20 border-purple-500/30",
    green: "from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
    orange: "from-orange-500/20 to-red-600/20 border-orange-500/30",
  };

  return (
    <div className={`card kpi-card group relative overflow-hidden bg-gradient-to-br ${variants[variant]} border backdrop-blur-xl`}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Optional background orb */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <p className="kpi-title text-gray-300">{title}</p>
          
          {IconComponent && (
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
              <IconComponent className="w-5 h-5 text-cyan-400" />
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <p className="kpi-value text-white drop-shadow-lg">
            {value?.toLocaleString?.() ?? value}
          </p>

          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
              trend === "up" 
                ? "bg-emerald-500/20 text-emerald-400" 
                : "bg-red-500/20 text-red-400"
            }`}>
              {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{extra}</span>
            </div>
          )}
        </div>

        {extra && !trend && (
          <p className="kpi-extra text-cyan-400 mt-2 font-medium">
            {extra}
          </p>
        )}
      </div>

      {/* Bottom shine line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
    </div>
  );
}