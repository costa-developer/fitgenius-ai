import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { BarChart3 } from "lucide-react";

interface HabitAnalyticsProps {
  userId: string;
}

interface HabitLog {
  date: string;
  habit_id: string;
  value: number;
  habits: {
    type: string;
    target_value: number;
  };
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--accent))", "hsl(var(--muted))"];

const HabitAnalytics = ({ userId }: HabitAnalyticsProps) => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [completionData, setCompletionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Get last 30 days of logs
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString().split("T")[0];
    
    const { data: logs, error } = await supabase
      .from("habit_logs")
      .select("date, habit_id, value, habits(type, target_value)")
      .eq("user_id", userId)
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: true });

    if (error || !logs) {
      setLoading(false);
      return;
    }

    // Process weekly data (last 7 days)
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const weeklyChartData = last7Days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayLogs = logs.filter((log: any) => log.date === dayStr);
      
      const completedCount = dayLogs.filter((log: any) => {
        const habit = log.habits;
        return habit && log.value >= habit.target_value;
      }).length;

      return {
        day: format(day, "EEE"),
        completed: completedCount,
        logged: dayLogs.length,
      };
    });

    setWeeklyData(weeklyChartData);

    // Process monthly data (last 4 weeks)
    const monthlyChartData = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(new Date(), i * 7));
      const weekEnd = endOfWeek(subDays(new Date(), i * 7));
      
      const weekLogs = logs.filter((log: any) => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      });

      const completedCount = weekLogs.filter((log: any) => {
        const habit = log.habits;
        return habit && log.value >= habit.target_value;
      }).length;

      monthlyChartData.push({
        week: `Week ${4 - i}`,
        completed: completedCount,
        total: weekLogs.length,
      });
    }

    setMonthlyData(monthlyChartData);

    // Calculate completion rates by habit type
    const habitTypes: { [key: string]: { completed: number; total: number } } = {};
    
    logs.forEach((log: any) => {
      const habit = log.habits;
      if (!habit) return;
      
      const type = habit.type;
      if (!habitTypes[type]) {
        habitTypes[type] = { completed: 0, total: 0 };
      }
      
      habitTypes[type].total++;
      if (log.value >= habit.target_value) {
        habitTypes[type].completed++;
      }
    });

    const completionChartData = Object.entries(habitTypes).map(([type, stats]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      completed: stats.completed,
      total: stats.total,
    }));

    setCompletionData(completionChartData);
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Habit Analytics</h2>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="completion">Completion</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="pt-4">
          <div className="h-64">
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    fill="hsl(var(--primary))"
                    name="Goals Met"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="logged"
                    fill="hsl(var(--muted))"
                    name="Logged"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available for the last 7 days
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="pt-4">
          <div className="h-64">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    fill="hsl(var(--primary))"
                    name="Goals Met"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--muted))"
                    name="Total Logged"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No data available for the last 4 weeks
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completion" className="pt-4">
          <div className="h-64">
            {completionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {completionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value}% (${props.payload.completed}/${props.payload.total})`,
                      "Completion Rate",
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No completion data available
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default HabitAnalytics;
