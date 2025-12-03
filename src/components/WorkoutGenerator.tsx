import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Dumbbell, Loader2, Sparkles, Save, History, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/integrations/supabase/types";

type Workout = Database["public"]["Tables"]["workouts"]["Row"];

interface WorkoutGeneratorProps {
  profile: any;
  userId: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
}

const WorkoutGenerator = ({ profile, userId }: WorkoutGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [workout, setWorkout] = useState<any>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedWorkouts();
  }, [userId]);

  const loadSavedWorkouts = async () => {
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setSavedWorkouts(data);
    }
  };

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

  const saveWorkout = async () => {
    if (!workout) return;
    
    setSaving(true);
    try {
      const { error } = await supabase.from("workouts").insert({
        user_id: userId,
        name: workout.name,
        duration_minutes: workout.duration_minutes,
        difficulty: workout.difficulty,
        total_calories: workout.total_calories,
        exercises: workout.exercises,
      });

      if (error) throw error;

      toast({
        title: "Workout Saved!",
        description: "Your workout has been saved to your history.",
      });
      loadSavedWorkouts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteWorkout = async (id: string) => {
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete workout.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Workout removed from history.",
      });
      loadSavedWorkouts();
    }
  };

  const renderExercises = (exercises: Exercise[]) => (
    <div className="space-y-2">
      {exercises?.map((exercise: Exercise, index: number) => (
        <div
          key={index}
          className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <h4 className="font-medium">{exercise.name}</h4>
          <p className="text-sm text-muted-foreground">
            {exercise.sets} sets × {exercise.reps} reps • Rest {exercise.rest_seconds}s
          </p>
        </div>
      ))}
    </div>
  );

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

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="saved">
            <History className="h-4 w-4 mr-2" />
            Saved ({savedWorkouts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-4">
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

              {renderExercises(workout.exercises)}

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={saveWorkout}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Workout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setWorkout(null)}
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click Generate to create your personalized workout</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          {savedWorkouts.length > 0 ? (
            <div className="space-y-4">
              {savedWorkouts.map((saved) => (
                <div key={saved.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{saved.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {saved.duration_minutes} min • {saved.difficulty} • {saved.total_calories} cal
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteWorkout(saved.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {renderExercises(saved.exercises as unknown as Exercise[])}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved workouts yet</p>
              <p className="text-sm">Generate and save a workout to see it here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default WorkoutGenerator;