-- Add custom notification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS custom_freeze_title TEXT,
ADD COLUMN IF NOT EXISTS custom_freeze_message TEXT,
ADD COLUMN IF NOT EXISTS custom_freeze_contact_info TEXT,
ADD COLUMN IF NOT EXISTS custom_freeze_show_contact BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS custom_freeze_show_reason BOOLEAN DEFAULT true;

-- Create function to update custom freeze notification content
CREATE OR REPLACE FUNCTION public.update_custom_freeze_notification(
  target_user_id UUID,
  custom_title TEXT DEFAULT NULL,
  custom_message TEXT DEFAULT NULL,
  custom_contact_info TEXT DEFAULT NULL,
  show_contact BOOLEAN DEFAULT true,
  show_reason BOOLEAN DEFAULT true
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can update custom freeze notifications';
  END IF;
  
  -- Update the custom notification fields
  UPDATE public.profiles 
  SET 
    custom_freeze_title = custom_title,
    custom_freeze_message = custom_message,
    custom_freeze_contact_info = custom_contact_info,
    custom_freeze_show_contact = show_contact,
    custom_freeze_show_reason = show_reason
  WHERE user_id = target_user_id;
  
  RETURN FOUND;
END;
$$;

-- Create function to get custom freeze notification content
CREATE OR REPLACE FUNCTION public.get_custom_freeze_notification(user_id UUID)
RETURNS TABLE(
  custom_title TEXT,
  custom_message TEXT,
  custom_contact_info TEXT,
  show_contact BOOLEAN,
  show_reason BOOLEAN
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    custom_freeze_title,
    custom_freeze_message,
    custom_freeze_contact_info,
    COALESCE(custom_freeze_show_contact, true),
    COALESCE(custom_freeze_show_reason, true)
  FROM public.profiles 
  WHERE user_id = $1;
$$;
