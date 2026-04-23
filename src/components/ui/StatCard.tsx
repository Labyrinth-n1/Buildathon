import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "blue" | "purple" | "red" | "green";
}

export function StatCard({ title, value, icon: Icon, trend, color = "blue" }: StatCardProps) {
  const colorMap = {
    blue: "text-neon-blue border-neon-blue/20 bg-neon-blue/5",
    purple: "text-neon-purple border-neon-purple/20 bg-neon-purple/5",
    red: "text-neon-red border-neon-red/20 bg-neon-red/5",
    green: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn("glass-panel p-6 flex flex-col justify-between h-full", colorMap[color])}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-black/40 border border-white/5">
          <Icon className={cn("w-6 h-6", colorMap[color].split(" ")[0])} />
        </div>
        {trend && (
          <span className={cn("text-xs font-mono px-2 py-1 rounded-full bg-black/20", trend.value > 0 ? "text-neon-red" : "text-emerald-400")}>
            {trend.value > 0 ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-sans font-bold tracking-tight text-white">{value}</h3>
        {trend && <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{trend.label}</p>}
      </div>
    </motion.div>
  );
}
