import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Scale, Plus, TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

interface WeightTrackerProps {
  userId: string;
  currentWeight: number;
}

interface WeightLog {
  id: string;
  weight: number;
  date: string;
}

const WeightTracker = ({ userId, currentWeight }: WeightTrackerProps) => {
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWeightLogs();
  }, [userId]);

  const loadWeightLogs = async () => {
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString().split("T")[0];
    
    const { data, error } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("date", thirtyDaysAgo)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error loading weight logs:", error);
      return;
    }

    setWeightLogs(data || []);
  };

  const logWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight value.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    // Check if there's already a log for today
    const existingLog = weightLogs.find((log) => log.date === today);

    if (existingLog) {
      const { error } = await supabase
        .from("weight_logs")
        .update({ weight: parseFloat(newWeight) })
        .eq("id", existingLog.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update weight.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Weight updated",
          description: `Today's weight updated to ${newWeight} kg.`,
        });
        loadWeightLogs();
      }
    } else {
      const { error } = await supabase.from("weight_logs").insert({
        user_id: userId,
        weight: parseFloat(newWeight),
        date: today,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to log weight.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Weight logged",
          description: `Weight of ${newWeight} kg recorded.`,
        });
        loadWeightLogs();
      }
    }

    setNewWeight("");
    setLoading(false);
  };

  const chartData = weightLogs.map((log) => ({
    date: format(new Date(log.date), "MMM d"),
    weight: Number(log.weight),
  }));

  const latestWeight = weightLogs.length > 0 
    ? Number(weightLogs[weightLogs.length - 1].weight) 
    : currentWeight;
  
  const previousWeight = weightLogs.length > 1 
    ? Number(weightLogs[weightLogs.length - 2].weight) 
    : currentWeight;
  
  const weightChange = latestWeight - previousWeight;
  const totalChange = weightLogs.length > 0 
    ? latestWeight - Number(weightLogs[0].weight) 
    : 0;

  const getTrendIcon = () => {
    if (weightChange > 0) return <TrendingUp className="h-4 w-4 text-orange-500" />;
    if (weightChange < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Weight Tracking</h3>
            <p className="text-sm text-muted-foreground">Track your progress over time</p>
          </div>
        </div>
      </div>

      {/* Weight Input */}
      <div className="flex gap-3 mb-6">
        <Input
          type="number"
          step="0.1"
          placeholder="Enter weight (kg)"
          value={newWeight}
          onChange={(e) => setNewWeight(e.target.value)}
          className="flex-1"
        />
        <Button onClick={logWeight} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Log
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Current</p>
          <p className="text-xl font-bold">{latestWeight.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">kg</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Last Change</p>
          <div className="flex items-center justify-center gap-1">
            {getTrendIcon()}
            <p className="text-xl font-bold">
              {weightChange > 0 ? "+" : ""}{weightChange.toFixed(1)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">kg</p>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">30-Day Change</p>
          <p className={`text-xl font-bold ${totalChange < 0 ? "text-green-500" : totalChange > 0 ? "text-orange-500" : ""}`}>
            {totalChange > 0 ? "+" : ""}{totalChange.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">kg</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="text-center">
            <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No weight data yet</p>
            <p className="text-sm text-muted-foreground">Log your weight to see the chart</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeightTracker;