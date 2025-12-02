-- Drop the trigger that auto-creates profiles on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Make profile columns nullable so onboarding can set them
ALTER TABLE public.profiles 
  ALTER COLUMN age DROP NOT NULL,
  ALTER COLUMN gender DROP NOT NULL,
  ALTER COLUMN height DROP NOT NULL,
  ALTER COLUMN goal DROP NOT NULL,
  ALTER COLUMN weight DROP NOT NULL;