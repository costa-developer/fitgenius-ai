import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Apple, Loader2, Sparkles, Save, History, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/integrations/supabase/types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];

interface MealPlannerProps {
  profile: any;
  userId: string;
}

interface GeneratedMeal {
  name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
}

const MealPlanner = ({ profile, userId }: MealPlannerProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [meals, setMeals] = useState<GeneratedMeal[]>([]);
  const [savedMeals, setSavedMeals] = useState<Meal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedMeals();
  }, [userId]);

  const loadSavedMeals = async () => {
    const { data, error } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!error && data) {
      setSavedMeals(data);
    }
  };

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

  const saveMealPlan = async () => {
    if (meals.length === 0) return;
    
    setSaving(true);
    try {
      const mealsToInsert = meals.map((meal) => ({
        user_id: userId,
        name: meal.name,
        meal_type: meal.meal_type,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fats: meal.fats,
        ingredients: meal.ingredients,
      }));

      const { error } = await supabase.from("meals").insert(mealsToInsert);

      if (error) throw error;

      toast({
        title: "Meal Plan Saved!",
        description: `${meals.length} meals have been saved to your history.`,
      });
      loadSavedMeals();
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

  const deleteMeal = async (id: string) => {
    const { error } = await supabase.from("meals").delete().eq("id", id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete meal.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Meal removed from history.",
      });
      loadSavedMeals();
    }
  };

  const renderMealCard = (meal: GeneratedMeal | Meal, showDelete = false, mealId?: string) => (
    <div className="p-4 border border-border rounded-lg space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{meal.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {meal.meal_type}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="text-right">
            <p className="text-xl font-bold text-green-600">{meal.calories}</p>
            <p className="text-xs text-muted-foreground">cal</p>
          </div>
          {showDelete && mealId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMeal(mealId)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
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
          {(meal.ingredients as string[])?.map((ingredient, i) => (
            <li key={i}>• {ingredient}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Apple className="h-6 w-6 text-green-600" />
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

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="saved">
            <History className="h-4 w-4 mr-2" />
            Saved ({savedMeals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-4">
          {meals.length > 0 ? (
            <div className="space-y-4">
              {meals.map((meal, index) => (
                <div key={index}>
                  {renderMealCard(meal)}
                </div>
              ))}

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={saveMealPlan}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save All Meals
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setMeals([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Apple className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click Generate to create your personalized meal plan</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          {savedMeals.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {savedMeals.map((meal) => (
                <div key={meal.id}>
                  {renderMealCard(meal, true, meal.id)}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved meals yet</p>
              <p className="text-sm">Generate and save a meal plan to see it here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MealPlanner;