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
  CheckCircle2,
  ArrowRight
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
      description: "Personalized workout plans tailored to your goals, fitness level, and schedule.",
      gradient: "from-primary to-primary/60"
    },
    {
      icon: Apple,
      title: "Smart Nutrition",
      description: "AI-generated meal plans with macros, customized for your dietary preferences.",
      gradient: "from-emerald-500 to-emerald-400"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor habits, weight, and workouts with beautiful analytics.",
      gradient: "from-amber-500 to-orange-400"
    },
    {
      icon: Zap,
      title: "Adaptive Plans",
      description: "Your plans evolve based on your progress and feedback.",
      gradient: "from-violet-500 to-purple-400"
    }
  ];

  const benefits = [
    "Personalized AI-powered recommendations",
    "Track all your health metrics in one place",
    "Beautiful charts and progress visualization",
    "Works with any diet or fitness goal"
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FitTrack AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth")} className="hidden sm:flex">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-24">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Fitness Platform
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get personalized workouts, smart meal plans, and comprehensive tracking—all powered by artificial intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 h-14 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 h-14 rounded-xl"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
            {[
              { value: "100%", label: "Personalized" },
              { value: "AI", label: "Powered" },
              { value: "Free", label: "To Start" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive tools designed to help you reach your fitness goals faster.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose FitTrack AI?
            </h2>
            <p className="text-muted-foreground text-lg">
              We combine the power of artificial intelligence with proven fitness principles to deliver results.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate("/auth")} className="mt-4">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
            <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">Dashboard</div>
                  <div className="text-sm text-muted-foreground">Your fitness overview</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Workouts", value: "12", color: "bg-primary/10 text-primary" },
                  { label: "Meals", value: "28", color: "bg-emerald-500/10 text-emerald-500" },
                  { label: "Habits", value: "85%", color: "bg-amber-500/10 text-amber-500" },
                  { label: "Progress", value: "+5kg", color: "bg-violet-500/10 text-violet-500" }
                ].map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl ${item.color}`}>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-xs opacity-80">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-3xl border border-border/50 backdrop-blur-sm animate-fade-in">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join FitTrack AI today and start your personalized fitness journey with the power of artificial intelligence.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-10 h-14 rounded-xl shadow-lg shadow-primary/20"
          >
            Start Free Today
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>© 2024 FitTrack AI. Built with ❤️ for fitness enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
