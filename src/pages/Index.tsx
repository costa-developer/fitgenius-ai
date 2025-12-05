import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Apple,
  Activity,
  BarChart3
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle gradient orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-accent/5 via-accent/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-background" />
              </div>
              <span className="text-lg font-semibold tracking-tight">FitTrack</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auth")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate("/auth")}
              className="text-sm bg-foreground text-background hover:bg-foreground/90 rounded-full px-5"
            >
              Get started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-sm text-muted-foreground mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>AI-powered fitness intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight leading-[1.05] mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Your AI fitness
            <br />
            <span className="text-muted-foreground">coach that actually works</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: "200ms" }}>
            FitTrack is your intelligent fitness companion. Personalized workouts, 
            smart nutrition plans, and habit tracking—all powered by AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Button 
              onClick={() => navigate("/auth")}
              className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
            >
              Start for free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              variant="outline"
              className="h-12 px-8 text-base rounded-full font-medium border-border hover:bg-card"
            >
              <Play className="mr-2 w-4 h-4" />
              Watch demo
            </Button>
          </div>
        </div>
      </section>

      {/* Video/Demo Section */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden aspect-video animate-fade-in" style={{ animationDelay: "400ms" }}>
            {/* Placeholder for demo/video */}
            <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-muted/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-foreground/10 border border-border flex items-center justify-center mx-auto backdrop-blur-sm">
                    <Play className="w-8 h-8 text-foreground ml-1" />
                  </div>
                  <p className="text-muted-foreground text-sm">See FitTrack in action</p>
                </div>
              </div>
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                                  linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete fitness ecosystem designed with AI at its core.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Dumbbell,
                title: "AI Workouts",
                description: "Personalized training plans that adapt to your progress and goals."
              },
              {
                icon: Apple,
                title: "Smart Nutrition",
                description: "AI-generated meal plans with precise macros and dietary preferences."
              },
              {
                icon: Activity,
                title: "Habit Tracking",
                description: "Track water, sleep, and wellness with gamified streaks and badges."
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Beautiful charts and insights to visualize your fitness journey."
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="group p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-border/80 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-6 py-24 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in minutes, see results in weeks.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Tell us about yourself",
                description: "Share your goals, fitness level, dietary preferences, and schedule. Our AI learns what makes you unique."
              },
              {
                step: "02",
                title: "Get your personalized plan",
                description: "Receive AI-generated workout routines and meal plans tailored specifically to your needs and preferences."
              },
              {
                step: "03",
                title: "Track and improve",
                description: "Log your progress, build habits, and watch as the AI adapts your plan based on your results."
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="text-4xl font-light text-muted-foreground/30 tabular-nums">
                  {item.step}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-24 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "AI", label: "Powered" },
              { value: "24/7", label: "Adaptive" },
              { value: "100%", label: "Personalized" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-semibold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
            Ready to transform your fitness?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Join thousands who've revolutionized their health with AI-powered fitness.
          </p>
          <Button 
            onClick={() => navigate("/auth")}
            className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 rounded-full font-medium"
          >
            Get started for free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                <Dumbbell className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="font-medium">FitTrack</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FitTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
