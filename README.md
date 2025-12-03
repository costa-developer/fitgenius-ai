# FitTrack AI 💪

An AI-powered fitness and nutrition web app that provides personalized workouts, meal plans, and habit tracking.

## Features

- **🏋️ AI Workout Generator** - Get personalized workout routines based on your fitness goals, age, weight, and gender
- **🍎 AI Meal Planner** - Generate customized meal plans with macronutrient breakdowns tailored to your dietary preferences
- **📊 Weight Tracking** - Log daily weight and visualize progress with interactive charts
- **✅ Habit Tracker** - Track daily habits like water intake, sleep, steps, and more
- **👤 User Profiles** - Onboarding flow to capture fitness goals and preferences
- **🔐 Authentication** - Secure login and signup with email/password

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons, Recharts
- **Backend**: Lovable Cloud (Supabase)
- **AI**: Lovable AI Gateway (Google Gemini)
- **Database**: PostgreSQL with Row Level Security

## Getting Started

### Using Lovable

Visit the [Lovable Project](https://lovable.dev/projects/d4db88df-5f8d-47ba-baba-0beb5517b2e0) and start prompting.

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── WorkoutGenerator.tsx
│   ├── MealPlanner.tsx
│   ├── WeightTracker.tsx
│   └── HabitTracker.tsx
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Auth.tsx         # Login/Signup
│   ├── Onboarding.tsx   # User profile setup
│   └── Dashboard.tsx    # Main app dashboard
├── hooks/               # Custom React hooks
├── integrations/        # Supabase client & types
└── lib/                 # Utility functions
```

## Database Schema

- **profiles** - User profile data (age, weight, height, goals, diet)
- **workouts** - Saved AI-generated workouts
- **meals** - Saved AI-generated meal plans
- **habits** - User habit definitions
- **habit_logs** - Daily habit tracking entries
- **weight_logs** - Weight tracking history

## Deployment

Click **Share → Publish** in Lovable to deploy your app.

## Custom Domain

Navigate to **Project → Settings → Domains** to connect a custom domain.

## License

MIT
