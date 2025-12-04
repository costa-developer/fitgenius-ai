import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  bestStreak: number;
  size?: "sm" | "md" | "lg";
}

const StreakBadge = ({ streak, bestStreak, size = "md" }: StreakBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs p-1",
    md: "text-sm p-1.5",
    lg: "text-base p-2",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const isOnFire = streak >= 3;
  const isRecord = streak === bestStreak && streak > 0;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center gap-1 rounded-full font-semibold transition-all",
          sizeClasses[size],
          isOnFire
            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
            : streak > 0
            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Flame
          size={iconSizes[size]}
          className={cn(isOnFire && "animate-pulse")}
        />
        <span>{streak}</span>
      </div>
      {isRecord && streak > 1 && (
        <span className="text-xs text-yellow-500 font-medium">🏆 Best!</span>
      )}
    </div>
  );
};

export default StreakBadge;
