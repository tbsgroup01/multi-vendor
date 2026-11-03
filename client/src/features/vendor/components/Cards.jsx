import React from "react";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  CircleDollarSign,
  Clock,
} from "lucide-react";

export default function Cards({ stats: customStats }) {
  const defaultStats = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: "₹1,48,250",
      change: "+18.2%",
      isPositive: true,
      icon: CircleDollarSign,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] to-[#10B981] border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/90 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/25",
      valueColor: "text-[#049669]",
    },
    {
      id: "orders",
      title: "Total Orders",
      value: "384",
      change: "+12.4%",
      isPositive: true,
      icon: ShoppingCart,
      iconColor: "text-white bg-gradient-to-tr from-[#059669] to-teal-500 border-teal-400/40 shadow-md shadow-teal-600/25",
      bgGradient: "from-teal-50/90 via-white/85 to-white/60",
      accentBorder: "border-teal-200/80 hover:border-teal-400 hover:shadow-[0_16px_36px_rgba(13,148,136,0.15)]",
      glowColor: "bg-teal-400/25",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "products",
      title: "Active Products",
      value: "56",
      change: "+4 new",
      isPositive: true,
      icon: Package,
      iconColor: "text-white bg-gradient-to-tr from-[#049669] via-emerald-600 to-teal-600 border-emerald-400/40 shadow-md shadow-emerald-600/25",
      bgGradient: "from-emerald-50/70 via-white/85 to-white/60",
      accentBorder: "border-emerald-200/80 hover:border-emerald-400 hover:shadow-[0_16px_36px_rgba(4,150,105,0.15)]",
      glowColor: "bg-emerald-400/20",
      valueColor: "text-[#1E1B4B]",
    },
    {
      id: "pending",
      title: "Pending Orders",
      value: "14",
      change: "Needs dispatch",
      isPositive: false,
      icon: Clock,
      iconColor: "text-white bg-gradient-to-tr from-amber-500 to-amber-400 border-amber-300 shadow-md shadow-amber-500/25",
      bgGradient: "from-amber-50/90 via-white/85 to-white/60",
      accentBorder: "border-amber-200/80 hover:border-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.15)]",
      glowColor: "bg-amber-400/25",
      valueColor: "text-amber-600",
    },
  ];

  const items = customStats || defaultStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 font-['Poppins',sans-serif]">
      {items.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className={`backdrop-blur-2xl rounded-xl sm:rounded-2xl p-4 sm:p-5 border shadow-[0_8px_30px_rgba(4,150,105,0.06)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group ${
              stat.bgGradient
                ? `bg-gradient-to-br ${stat.bgGradient}`
                : "bg-white/60"
            } ${
              stat.accentBorder ||
              "border-white/80 hover:border-emerald-300 hover:shadow-xl"
            }`}
          >
            {/* Subtle top glass edge highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent" />

            {/* Ambient Corner Glow Blob */}
            <div
              className={`pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-transform group-hover:scale-125 duration-500 ${
                stat.glowColor || "bg-emerald-400/10"
              }`}
            />

            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${stat.iconColor} shadow-sm`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2 relative z-10">
              <h3
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  stat.valueColor || "text-[#1E1B4B]"
                }`}
              >
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
