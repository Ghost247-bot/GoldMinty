-- Create user banners table
CREATE TABLE public.user_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  banner_type TEXT NOT NULL DEFAULT 'info', -- info, warning, success, error
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 1, -- Higher numbers show first
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_banners ENABLE ROW LEVEL SECURITY;

-- Create policies for user banners
CREATE POLICY "Users can view their own banners" 
ON public.user_banners 
FOR SELECT 
USING (auth.uid() = user_id AND is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Admins can view all banners" 
ON public.user_banners 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create banners" 
ON public.user_banners 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update banners" 
ON public.user_banners 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete banners" 
ON public.user_banners 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_banners_updated_at
BEFORE UPDATE ON public.user_banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();