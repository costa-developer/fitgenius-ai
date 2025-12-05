import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  Sparkles, 
  TrendingUp, 
  Apple, 
  Target, 
  Zap, 
  BarChart3,
  ArrowRight,
  Flame,
  Heart,
  Activity,
  Trophy
} from "lucide-react";

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

  const features = [
    {
      icon: Dumbbell,
      title: "AI Workouts",
      description: "Hyper-personalized training adapted to your body and goals.",
      color: "from-primary to-primary/60",
      delay: "0ms"
    },
    {
      icon: Apple,
      title: "Smart Nutrition",
      description: "AI-crafted meal plans with precise macro calculations.",
      color: "from-secondary to-secondary/60",
      delay: "100ms"
    },
    {
      icon: Activity,
      title: "Habit Mastery",
      description: "Track water, sleep, and wellness with gamified streaks.",
      color: "from-accent to-accent/60",
      delay: "200ms"
    },
    {
      icon: BarChart3,
      title: "Deep Analytics",
      description: "Visualize your progress with beautiful, insightful charts.",
      color: "from-violet-500 to-purple-400",
      delay: "300ms"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 hero-gradient" />
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-secondary/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: "4s" }} />
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] animate-float">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <Flame className="w-8 h-8 text-primary/60" />
          </div>
        </div>
        <div className="absolute top-[30%] right-[12%] animate-float-delayed">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 backdrop-blur-sm border border-secondary/20 flex items-center justify-center">
            <Heart className="w-7 h-7 text-secondary/60" />
          </div>
        </div>
        <div className="absolute bottom-[25%] left-[8%] animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm border border-accent/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-accent/60" />
          </div>
        </div>
        <div className="absolute bottom-[35%] right-[8%] animate-float-delayed" style={{ animationDelay: "3s" }}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-500/5 backdrop-blur-sm border border-violet-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-violet-500/60" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-background/60 border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">FitTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")} className="font-medium">
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")} className="hidden sm:flex font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary animate-fade-in backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Next-Gen Fitness Intelligence
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] tracking-tight animate-fade-in" style={{ animationDelay: "100ms" }}>
            Your Body.
            <br />
            <span className="text-gradient animate-gradient">Your AI Coach.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in font-medium" style={{ animationDelay: "200ms" }}>
            Unlock peak performance with AI-powered workouts, precision nutrition, and intelligent habit tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-10 h-16 rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all font-bold group"
            >
              Start Your Transformation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto pt-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
            {[
              { value: "AI", label: "Powered", icon: Sparkles },
              { value: "24/7", label: "Adaptive", icon: Zap },
              { value: "100%", label: "Personal", icon: Target }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted/50 mb-3 group-hover:bg-primary/10 transition-colors">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A complete ecosystem designed to transform how you approach fitness.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 bg-card/40 backdrop-blur-sm rounded-3xl border border-border/30 hover:border-primary/30 hover:bg-card/60 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: feature.delay }}
            >
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Dashboard Preview */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                Track Everything.
                <br />
                <span className="text-primary">Achieve Anything.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From daily habits to long-term goals, our intelligent dashboard gives you complete visibility into your fitness journey with beautiful, actionable insights.
              </p>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, text: "Real-time progress tracking" },
                  { icon: Trophy, text: "Gamified achievements & badges" },
                  { icon: BarChart3, text: "Deep analytics & insights" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => navigate("/auth")} size="lg" className="mt-4 font-semibold">
                Start Tracking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 rounded-[2rem] blur-3xl" />
              <div className="relative bg-card/60 backdrop-blur-xl rounded-[2rem] border border-border/30 p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold">Dashboard</div>
                    <div className="text-sm text-muted-foreground">Your fitness overview</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Workouts", value: "12", subtext: "this week", color: "bg-primary/10 text-primary border-primary/20" },
                    { label: "Meals", value: "28", subtext: "logged", color: "bg-secondary/10 text-secondary border-secondary/20" },
                    { label: "Streak", value: "7", subtext: "days", color: "bg-accent/10 text-accent border-accent/20" },
                    { label: "Progress", value: "+5", subtext: "kg gained", color: "bg-violet-500/10 text-violet-500 border-violet-500/20" }
                  ].map((item, i) => (
                    <div key={i} className={`p-5 rounded-2xl ${item.color} border`}>
                      <div className="text-3xl font-display font-bold">{item.value}</div>
                      <div className="text-xs opacity-70 font-medium">{item.label}</div>
                      <div className="text-xs opacity-50 mt-1">{item.subtext}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-[3rem] blur-2xl" />
          <div className="relative p-16 bg-card/40 backdrop-blur-xl rounded-[3rem] border border-border/30">
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center mx-auto mb-8 shadow-xl animate-float">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Transform?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands who've revolutionized their fitness with the power of AI. Your transformation starts now.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-12 h-16 rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all font-bold"
            >
              Begin Your Journey
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-12 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">FitTrack AI</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 FitTrack AI. Built for fitness enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
