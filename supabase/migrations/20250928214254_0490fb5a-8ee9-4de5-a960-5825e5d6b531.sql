-- Update RLS policy to allow anonymous users to read security questions
-- This is needed for registration page where users aren't authenticated yet
DROP POLICY IF EXISTS "Security questions are viewable by authenticated users" ON public.security_questions;

CREATE POLICY "Security questions are publicly viewable"
ON public.security_questions
FOR SELECT
USING (true);