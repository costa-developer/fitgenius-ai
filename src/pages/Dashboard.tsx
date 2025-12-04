import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  Apple,
  TrendingUp,
  LogOut,
  Dumbbell,
  Target,
  Flame,
  Heart,
} from "lucide-react";
import WorkoutGenerator from "@/components/WorkoutGenerator";
import MealPlanner from "@/components/MealPlanner";
import HabitTracker from "@/components/HabitTracker";
import WeightTracker from "@/components/WeightTracker";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-success/5">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center animate-pulse">
            <Dumbbell className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const bmi = profile?.weight / Math.pow(profile?.height / 100, 2);
  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-accent" };
    if (bmi < 25) return { label: "Normal", color: "text-success" };
    if (bmi < 30) return { label: "Overweight", color: "text-accent" };
    return { label: "Obese", color: "text-destructive" };
  };
  const bmiCategory = getBmiCategory(bmi);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-success/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                FitTrack AI
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, <span className="font-medium text-foreground">{profile?.full_name || user?.email?.split('@')[0]}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <section className="animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Your Stats
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Weight Card */}
            <Card className="stat-card p-5 group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Weight</p>
                  <p className="text-3xl font-bold">{profile?.weight}</p>
                  <p className="text-sm text-muted-foreground">kg</p>
                </div>
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </Card>

            {/* BMI Card */}
            <Card className="stat-card p-5 group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">BMI</p>
                  <p className="text-3xl font-bold">{bmi?.toFixed(1)}</p>
                  <p className={`text-sm font-medium ${bmiCategory.color}`}>{bmiCategory.label}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-secondary to-success flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
            </Card>

            {/* Goal Card */}
            <Card className="stat-card p-5 group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Goal</p>
                  <p className="text-xl font-bold capitalize leading-tight">
                    {profile?.goal?.replace("_", " ")}
                  </p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <Target className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </Card>

            {/* Diet Card */}
            <Card className="stat-card p-5 group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Diet</p>
                  <p className="text-xl font-bold capitalize leading-tight">
                    {profile?.diet_preference || "Standard"}
                  </p>
                  <p className="text-sm text-muted-foreground">Preference</p>
                </div>
                <div className="h-12 w-12 rounded-xl gradient-success flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <Apple className="h-6 w-6 text-success-foreground" />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* AI Features */}
        <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-accent" />
            AI-Powered Tools
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <WorkoutGenerator profile={profile} userId={user?.id} />
            <MealPlanner profile={profile} userId={user?.id} />
          </div>
        </section>

        {/* Weight Tracking */}
        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <WeightTracker userId={user?.id} currentWeight={profile?.weight} />
        </section>

        {/* Habit Tracking */}
        <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <HabitTracker userId={user?.id} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>FitTrack AI — Your intelligent fitness companion</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;