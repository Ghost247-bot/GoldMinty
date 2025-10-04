# Database Migration Guide

## Issue
The admin dashboard is showing an error: `Could not find the 'account_frozen' column of 'profiles' in the schema cache`

## Solution
You need to apply the database migration to add the `account_frozen` column to the `profiles` table.

## Steps to Apply Migration

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/evhnpcssaivmiywecpck
2. Navigate to the SQL Editor
3. Run the following SQL:

```sql
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

-- Grant execute permissions on the freeze function to authenticated users
GRANT EXECUTE ON FUNCTION public.freeze_user_account(UUID, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_account_frozen(UUID) TO authenticated;
```

### Option 2: Using Supabase CLI (if you have access)
```bash
npx supabase db push
```

## Verification
After applying the migration:
1. The admin dashboard should work without errors
2. You should be able to freeze/unfreeze user accounts
3. The `account_frozen` column should be visible in the profiles table

## Files Modified
- `src/pages/AdminDashboard.tsx` - Added better error handling for missing migration
- `supabase/migrations/20250103000001_add_account_freeze_fixed.sql` - Contains the migration SQL
