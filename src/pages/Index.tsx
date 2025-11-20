import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dumbbell, Sparkles, TrendingUp, Apple, Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Dumbbell className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FitTrack AI
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Your intelligent fitness companion powered by AI. Get personalized
            workouts, meal plans, and track your journey to better health.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Get Started
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Workouts</h3>
            <p className="text-muted-foreground">
              Get personalized workout plans tailored to your goals, fitness
              level, and available time.
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <Apple className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Nutrition</h3>
            <p className="text-muted-foreground">
              AI-generated meal plans with detailed macros, customized for your
              dietary preferences and goals.
            </p>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor your habits, weight, workouts, and watch your fitness
              journey unfold with detailed analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-border">
          <Target className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join FitTrack AI today and start your personalized fitness journey
            with the power of artificial intelligence.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")}>
            Start Free Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
