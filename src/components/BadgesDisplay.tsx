import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Award, Droplets, Moon, TrendingDown, Zap, Trophy, Star } from "lucide-react";

interface Badge {
  id: string;
  badge_type: string;
  badge_name: string;
  description: string;
  earned_at: string;
}

interface BadgesDisplayProps {
  userId: string;
}

const BADGE_ICONS: { [key: string]: any } = {
  streak_3: Zap,
  streak_7: Trophy,
  streak_30: Star,
  water: Droplets,
  sleep: Moon,
  smoking: TrendingDown,
  default: Award,
};

const BADGE_COLORS: { [key: string]: string } = {
  streak_3: "from-orange-400 to-yellow-400",
  streak_7: "from-purple-400 to-pink-400",
  streak_30: "from-yellow-400 to-amber-500",
  water: "from-blue-400 to-cyan-400",
  sleep: "from-indigo-400 to-purple-400",
  smoking: "from-green-400 to-emerald-400",
  default: "from-gray-400 to-slate-400",
};

const BadgesDisplay = ({ userId }: BadgesDisplayProps) => {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    const { data, error } = await supabase
      .from("badges")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (!error && data) {
      setBadges(data);
    }
  };

  if (badges.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Badges</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Keep tracking your habits to earn badges!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Badges ({badges.length})</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {badges.map((badge) => {
          const Icon = BADGE_ICONS[badge.badge_type] || BADGE_ICONS.default;
          const colorClass = BADGE_COLORS[badge.badge_type] || BADGE_COLORS.default;

          return (
            <div
              key={badge.id}
              className="group relative"
              title={badge.description || badge.badge_name}
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-xs bg-popover text-popover-foreground px-2 py-1 rounded shadow">
                  {badge.badge_name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BadgesDisplay;
