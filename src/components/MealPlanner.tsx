import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Apple, Loader2, Sparkles } from "lucide-react";

interface MealPlannerProps {
  profile: any;
}

interface Meal {
  name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
}

const MealPlanner = ({ profile }: MealPlannerProps) => {
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const { toast } = useToast();

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-meal-plan",
        {
          body: {
            gender: profile.gender,
            age: profile.age,
            weight: profile.weight,
            goal: profile.goal,
            diet_preference: profile.diet_preference,
          },
        }
      );

      if (error) throw error;

      setMeals(data.meals || []);
      toast({
        title: "Meal Plan Generated!",
        description: "Your personalized meal plan is ready.",
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
          <Apple className="h-6 w-6 text-success" />
          <h2 className="text-xl font-bold">AI Meal Planner</h2>
        </div>
        <Button onClick={generateMealPlan} disabled={loading} size="sm">
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

      {meals.length > 0 ? (
        <div className="space-y-4">
          {meals.map((meal, index) => (
            <div
              key={index}
              className="p-4 border border-border rounded-lg space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{meal.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {meal.meal_type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-success">
                    {meal.calories}
                  </p>
                  <p className="text-xs text-muted-foreground">cal</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-sm font-medium">{meal.protein}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{meal.carbs}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{meal.fats}g</p>
                  <p className="text-xs text-muted-foreground">Fats</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Ingredients:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {meal.ingredients?.map((ingredient, i) => (
                    <li key={i}>• {ingredient}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <Button
            className="w-full"
            variant="outline"
            onClick={() => setMeals([])}
          >
            Generate New Meal Plan
          </Button>
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground">
          <Apple className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Click Generate to create your personalized meal plan</p>
        </div>
      )}
    </Card>
  );
};

export default MealPlanner;
