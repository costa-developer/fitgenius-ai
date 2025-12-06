import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Dumbbell, 
  ArrowRight,
  Sparkles,
  Apple,
  Activity,
  BarChart3,
  Check,
  Zap,
  Shield,
  Users
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
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: "400ms" }}>
            {/* Mock Dashboard UI */}
            <div className="p-4 md:p-6 bg-gradient-to-br from-card via-card to-muted/10">
              {/* Mock Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 text-background" />
                  </div>
                  <span className="font-medium">Dashboard</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                </div>
              </div>
              
              {/* Mock Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Weight", value: "72.5 kg", color: "from-primary/20 to-primary/5" },
                  { label: "BMI", value: "23.4", color: "from-emerald-500/20 to-emerald-500/5" },
                  { label: "Goal", value: "Muscle Gain", color: "from-amber-500/20 to-amber-500/5" },
                  { label: "Streak", value: "7 days 🔥", color: "from-rose-500/20 to-rose-500/5" }
                ].map((stat, i) => (
                  <div key={i} className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} border border-border/50`}>
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Mock Content Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Dumbbell className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Today's Workout</span>
                  </div>
                  <div className="space-y-2">
                    {["Push-ups: 3×15", "Squats: 4×12", "Planks: 3×45s"].map((ex, i) => (
                      <div key={i} className="text-xs text-muted-foreground py-1.5 px-2 bg-muted/50 rounded">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Apple className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">Meal Plan</span>
                  </div>
                  <div className="space-y-2">
                    {["Breakfast: 450 cal", "Lunch: 620 cal", "Dinner: 580 cal"].map((meal, i) => (
                      <div key={i} className="text-xs text-muted-foreground py-1.5 px-2 bg-muted/50 rounded">
                        {meal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
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

      {/* Why FitTrack Section */}
      <section className="px-6 py-24 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Why choose FitTrack?
            </h2>
            <p className="text-muted-foreground text-lg">
              Built for people who want results, not complexity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: "Instant AI Plans",
                description: "Get personalized workout and meal plans in seconds, not hours."
              },
              {
                icon: Shield,
                title: "Private & Secure",
                description: "Your data stays yours. No sharing, no ads, no compromises."
              },
              {
                icon: Activity,
                title: "Adaptive Progress",
                description: "Plans evolve as you do. The AI learns from your results."
              },
              {
                icon: Users,
                title: "Built for Everyone",
                description: "Beginner or advanced, any diet, any goal—we've got you."
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-border bg-card/30 hover:bg-card/60 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-24 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free Plan */}
            <div className="p-6 rounded-2xl border border-border bg-card/30">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "AI workout generation",
                  "Basic meal plans",
                  "Habit tracking",
                  "Weight logging"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                className="w-full rounded-full"
                onClick={() => navigate("/auth")}
              >
                Get started
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 rounded-2xl border-2 border-foreground bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                Popular
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Everything in Free",
                  "Unlimited AI generations",
                  "Advanced analytics",
                  "Priority support",
                  "Custom meal preferences"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                onClick={() => navigate("/auth")}
              >
                Start free trial
              </Button>
            </div>
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
              © {new Date().getFullYear()} FitTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
