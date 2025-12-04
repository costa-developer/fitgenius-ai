-- Add streak tracking to habits
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS best_streak integer DEFAULT 0;
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS last_logged_date date;

-- Create badges table
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  badge_type text NOT NULL,
  badge_name text NOT NULL,
  description text,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  habit_id uuid REFERENCES public.habits(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own badges" ON public.badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_badges_user_id ON public.badges(user_id);
CREATE INDEX idx_habit_logs_date ON public.habit_logs(date, habit_id);