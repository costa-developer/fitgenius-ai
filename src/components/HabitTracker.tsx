import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Moon, TrendingDown, Plus } from "lucide-react";

interface HabitTrackerProps {
  userId: string;
}

interface Habit {
  id: string;
  type: string;
  target_value: number;
  unit: string;
}

interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  value: number;
}

const HABIT_ICONS: { [key: string]: any } = {
  water: Droplets,
  sleep: Moon,
  smoking: TrendingDown,
  wellness: Plus,
};

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

  const updateHabitLog = async (habitId: string, value: number) => {
    const today = new Date().toISOString().split("T")[0];
    
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
    } else {
      setTodayLogs({ ...todayLogs, [habitId]: value });
      toast({
        title: "Updated!",
        description: "Habit logged successfully.",
      });
    }
  };

  return (
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
  );
};

export default HabitTracker;
