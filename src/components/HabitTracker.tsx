import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Moon, TrendingDown, Plus } from "lucide-react";
import StreakBadge from "./StreakBadge";
import BadgesDisplay from "./BadgesDisplay";
import HabitAnalytics from "./HabitAnalytics";

interface HabitTrackerProps {
  userId: string;
}

interface Habit {
  id: string;
  type: string;
  target_value: number;
  unit: string;
  current_streak: number;
  best_streak: number;
  last_logged_date: string | null;
}

const HABIT_ICONS: { [key: string]: any } = {
  water: Droplets,
  sleep: Moon,
  smoking: TrendingDown,
  wellness: Plus,
};

const BADGE_MILESTONES = [
  { days: 3, type: "streak_3", name: "3-Day Streak", description: "Logged a habit for 3 consecutive days!" },
  { days: 7, type: "streak_7", name: "Week Warrior", description: "Logged a habit for 7 consecutive days!" },
  { days: 30, type: "streak_30", name: "Monthly Master", description: "Logged a habit for 30 consecutive days!" },
];

const HabitTracker = ({ userId }: HabitTrackerProps) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadHabits();
    loadTodayLogs();
  }, [userId]);

  const loadHabits = async () => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId);

    if (!error && data) {
      setHabits(data);
      
      // Create default habits if none exist
      if (data.length === 0) {
        await createDefaultHabits();
      }
    }
  };

  const createDefaultHabits = async () => {
    const defaultHabits = [
      { user_id: userId, type: "water" as const, target_value: 8, unit: "glasses" },
      { user_id: userId, type: "sleep" as const, target_value: 8, unit: "hours" },
      { user_id: userId, type: "smoking" as const, target_value: 0, unit: "cigarettes" },
    ];

    const { error } = await supabase.from("habits").insert(defaultHabits);
    
    if (!error) {
      loadHabits();
    }
  };

  const loadTodayLogs = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("habit_logs")
      .select("*, habits(*)")
      .eq("user_id", userId)
      .eq("date", today);

    if (!error && data) {
      const logsMap: { [key: string]: number } = {};
      data.forEach((log: any) => {
        logsMap[log.habit_id] = log.value;
      });
      setTodayLogs(logsMap);
    }
  };

  const checkAndAwardBadges = async (habitId: string, newStreak: number) => {
    for (const milestone of BADGE_MILESTONES) {
      if (newStreak === milestone.days) {
        // Check if badge already earned for this habit
        const { data: existing } = await supabase
          .from("badges")
          .select("id")
          .eq("user_id", userId)
          .eq("habit_id", habitId)
          .eq("badge_type", milestone.type)
          .single();

        if (!existing) {
          await supabase.from("badges").insert({
            user_id: userId,
            habit_id: habitId,
            badge_type: milestone.type,
            badge_name: milestone.name,
            description: milestone.description,
          });

          toast({
            title: "🏆 Badge Earned!",
            description: milestone.name,
          });
        }
      }
    }
  };

  const updateHabitLog = async (habitId: string, value: number) => {
    const today = new Date().toISOString().split("T")[0];
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    // Log the habit
    const { error } = await supabase
      .from("habit_logs")
      .upsert({
        user_id: userId,
        habit_id: habitId,
        date: today,
        value: value,
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = habit.current_streak;
    
    if (habit.last_logged_date === yesterdayStr) {
      // Consecutive day - increment streak
      newStreak = habit.current_streak + 1;
    } else if (habit.last_logged_date !== today) {
      // Streak broken or first log - reset to 1
      newStreak = 1;
    }

    const newBestStreak = Math.max(newStreak, habit.best_streak);

    // Update habit with new streak
    await supabase
      .from("habits")
      .update({
        current_streak: newStreak,
        best_streak: newBestStreak,
        last_logged_date: today,
      })
      .eq("id", habitId);

    // Check for badge milestones
    await checkAndAwardBadges(habitId, newStreak);

    // Update local state
    setHabits(
      habits.map((h) =>
        h.id === habitId
          ? { ...h, current_streak: newStreak, best_streak: newBestStreak, last_logged_date: today }
          : h
      )
    );
    setTodayLogs({ ...todayLogs, [habitId]: value });

    toast({
      title: "Updated!",
      description: newStreak > 1 ? `${newStreak} day streak! 🔥` : "Habit logged successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Daily Habits</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {habits.map((habit) => {
            const Icon = HABIT_ICONS[habit.type] || Plus;
            const currentValue = todayLogs[habit.id] || 0;
            const percentage = (currentValue / habit.target_value) * 100;

            return (
              <div
                key={habit.id}
                className="p-4 border border-border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium capitalize">{habit.type}</span>
                  </div>
                  <StreakBadge
                    streak={habit.current_streak || 0}
                    bestStreak={habit.best_streak || 0}
                    size="sm"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={currentValue}
                      onChange={(e) =>
                        updateHabitLog(habit.id, parseFloat(e.target.value) || 0)
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground">
                      / {habit.target_value}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {habit.unit}
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <HabitAnalytics userId={userId} />
      <BadgesDisplay userId={userId} />
    </div>
  );
};

export default HabitTracker;
