-- Create withdrawal requests table
CREATE TABLE public.withdrawal_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metal_type TEXT NOT NULL CHECK (metal_type IN ('gold', 'silver', 'platinum')),
  amount_oz NUMERIC NOT NULL CHECK (amount_oz > 0),
  withdrawal_type TEXT NOT NULL CHECK (withdrawal_type IN ('cash', 'physical')),
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_zip TEXT,
  shipping_country TEXT DEFAULT 'United States',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'shipped', 'completed', 'rejected')),
  tracking_number TEXT,
  rejection_reason TEXT,
  estimated_value NUMERIC,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID
);

-- Enable RLS
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own withdrawal requests
CREATE POLICY "Users can view their own withdrawal requests"
ON public.withdrawal_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own withdrawal requests
CREATE POLICY "Users can create their own withdrawal requests"
ON public.withdrawal_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND auth.uid() = created_by);

-- Admins can view all withdrawal requests
CREATE POLICY "Admins can view all withdrawal requests"
ON public.withdrawal_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admins can update withdrawal requests
CREATE POLICY "Admins can update withdrawal requests"
ON public.withdrawal_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_withdrawal_requests_updated_at
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();