-- Create security questions table
CREATE TABLE public.security_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert predefined security questions
INSERT INTO public.security_questions (question) VALUES
  ('What was the name of your first pet?'),
  ('What city were you born in?'),
  ('What was your mother''s maiden name?'),
  ('What was the name of your first school?'),
  ('What is your favorite book?'),
  ('What was the model of your first car?'),
  ('What street did you grow up on?'),
  ('What is your favorite food?');

-- Create user security answers table
CREATE TABLE public.user_security_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.security_questions(id) ON DELETE CASCADE,
  answer_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE public.security_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_answers ENABLE ROW LEVEL SECURITY;

-- Security questions are readable by all authenticated users
CREATE POLICY "Security questions are viewable by authenticated users"
ON public.security_questions
FOR SELECT
TO authenticated
USING (true);

-- Users can only manage their own security answers
CREATE POLICY "Users can view their own security answers"
ON public.user_security_answers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security answers"
ON public.user_security_answers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own security answers"
ON public.user_security_answers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all security answers (for support purposes)
CREATE POLICY "Admins can view all security answers"
ON public.user_security_answers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_user_security_answers_updated_at
    BEFORE UPDATE ON public.user_security_answers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Update profiles table to include more user details
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_line1 TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address_line2 TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'United States';

-- Update the handle_new_user function to include first and last names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, full_name, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );

  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;