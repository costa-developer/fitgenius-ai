import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Apple,
  Droplets,
  Moon,
  TrendingUp,
  LogOut,
  Dumbbell,
  Target,
} from "lucide-react";
import WorkoutGenerator from "@/components/WorkoutGenerator";
import MealPlanner from "@/components/MealPlanner";
import HabitTracker from "@/components/HabitTracker";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error || !profileData?.gender) {
        navigate("/onboarding");
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const bmi = profile?.weight / Math.pow(profile?.height / 100, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FitTrack AI</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {profile?.full_name || user?.email}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="text-2xl font-bold">{profile?.weight} kg</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">BMI</p>
                <p className="text-2xl font-bold">{bmi?.toFixed(1)}</p>
              </div>
              <Activity className="h-8 w-8 text-secondary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goal</p>
                <p className="text-lg font-semibold capitalize">
                  {profile?.goal?.replace("_", " ")}
                </p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Diet</p>
                <p className="text-lg font-semibold capitalize">
                  {profile?.diet_preference}
                </p>
              </div>
              <Apple className="h-8 w-8 text-success" />
            </div>
          </Card>
        </div>

        {/* AI Features */}
        <div className="grid lg:grid-cols-2 gap-6">
          <WorkoutGenerator profile={profile} />
          <MealPlanner profile={profile} />
        </div>

        {/* Habit Tracking */}
        <HabitTracker userId={user?.id} />
      </main>
    </div>
  );
};

export default Dashboard;
