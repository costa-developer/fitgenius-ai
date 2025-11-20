import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Loader2, Sparkles } from "lucide-react";

interface WorkoutGeneratorProps {
  profile: any;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
}

const WorkoutGenerator = ({ profile }: WorkoutGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [workout, setWorkout] = useState<any>(null);
  const { toast } = useToast();

  const generateWorkout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-workout",
        {
          body: {
            gender: profile.gender,
            age: profile.age,
            weight: profile.weight,
            goal: profile.goal,
          },
        }
      );

      if (error) throw error;

      setWorkout(data);
      toast({
        title: "Workout Generated!",
        description: "Your personalized workout is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">AI Workout Generator</h2>
        </div>
        <Button onClick={generateWorkout} disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      {workout ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div>
              <h3 className="font-semibold">{workout.name}</h3>
              <p className="text-sm text-muted-foreground">
                {workout.duration_minutes} minutes • {workout.difficulty}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                {workout.total_calories}
              </p>
              <p className="text-xs text-muted-foreground">calories</p>
            </div>
          </div>

          <div className="space-y-3">
            {workout.exercises?.map((exercise: Exercise, index: number) => (
              <div
                key={index}
                className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h4 className="font-medium">{exercise.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} sets × {exercise.reps} reps • Rest{" "}
                  {exercise.rest_seconds}s
                </p>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => setWorkout(null)}
          >
            Generate New Workout
          </Button>
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Click Generate to create your personalized workout</p>
        </div>
      )}
    </Card>
  );
};

export default WorkoutGenerator;
