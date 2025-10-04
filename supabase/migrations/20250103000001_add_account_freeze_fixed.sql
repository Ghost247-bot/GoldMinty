-- Add account_frozen field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_frozen BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS frozen_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS frozen_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS freeze_reason TEXT;

-- Create index for efficient frozen account queries
CREATE INDEX IF NOT EXISTS idx_profiles_account_frozen ON public.profiles(account_frozen);

-- Create function to freeze/unfreeze user account
CREATE OR REPLACE FUNCTION public.freeze_user_account(
  target_user_id UUID,
  freeze BOOLEAN,
  reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can freeze/unfreeze accounts';
  END IF;
  
  -- Update the account freeze status
  UPDATE public.profiles 
  SET 
    account_frozen = freeze,
    frozen_at = CASE WHEN freeze THEN now() ELSE NULL END,
    frozen_by = CASE WHEN freeze THEN auth.uid() ELSE NULL END,
    freeze_reason = CASE WHEN freeze THEN reason ELSE NULL END
  WHERE user_id = target_user_id;
  
  RETURN FOUND;
END;
$$;

-- Create function to check if user account is frozen
CREATE OR REPLACE FUNCTION public.is_account_frozen(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(account_frozen, false) 
  FROM public.profiles 
  WHERE user_id = $1;
$$;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile if not frozen" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles including frozen" ON public.profiles;

-- Create RLS policies to respect account freeze status
-- Users cannot access their own data if account is frozen
CREATE POLICY "Users can view their own profile if not frozen" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id AND NOT COALESCE(account_frozen, false));

-- Admins can always view profiles (including frozen ones)
CREATE POLICY "Admins can view all profiles including frozen"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update user_action_permissions RLS to respect freeze status
DROP POLICY IF EXISTS "Users can view their own action permissions" ON public.user_action_permissions;
CREATE POLICY "Users can view permissions if not frozen" 
ON public.user_action_permissions
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND NOT public.is_account_frozen(auth.uid()));

-- Update user_tool_settings RLS to respect freeze status  
DROP POLICY IF EXISTS "Users can manage their own tool settings" ON public.user_tool_settings;
CREATE POLICY "Users can manage tool settings if not frozen"
ON public.user_tool_settings
FOR ALL
TO authenticated
USING (auth.uid() = user_id AND NOT public.is_account_frozen(auth.uid()))
WITH CHECK (auth.uid() = user_id AND NOT public.is_account_frozen(auth.uid()));

-- Update user_ai_insights RLS to respect freeze status
DROP POLICY IF EXISTS "Users can view their own AI insights" ON public.user_ai_insights;
CREATE POLICY "Users can view AI insights if not frozen"
ON public.user_ai_insights
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND NOT public.is_account_frozen(auth.uid()) AND is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Update user_transactions RLS to respect freeze status
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.user_transactions;
CREATE POLICY "Users can view transactions if not frozen"
ON public.user_transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND NOT public.is_account_frozen(auth.uid()));

-- Update user_performance_metrics RLS to respect freeze status
DROP POLICY IF EXISTS "Users can view their own performance metrics" ON public.user_performance_metrics;
CREATE POLICY "Users can view performance metrics if not frozen"
ON public.user_performance_metrics
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND NOT public.is_account_frozen(auth.uid()));

-- Update user_risk_profiles RLS to respect freeze status
DROP POLICY IF EXISTS "Users can view their own risk profile" ON public.user_risk_profiles;
CREATE POLICY "Users can view risk profile if not frozen"
ON public.user_risk_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND NOT public.is_account_frozen(auth.uid()));

-- Grant execute permissions on the freeze function to authenticated users
GRANT EXECUTE ON FUNCTION public.freeze_user_account(UUID, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_account_frozen(UUID) TO authenticated;
