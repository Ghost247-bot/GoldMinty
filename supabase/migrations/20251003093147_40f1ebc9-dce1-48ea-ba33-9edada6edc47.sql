-- Create portfolio_allocations table to store allocation percentages
CREATE TABLE IF NOT EXISTS public.portfolio_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.investment_accounts(id) ON DELETE CASCADE,
  gold_percentage numeric NOT NULL DEFAULT 0,
  silver_percentage numeric NOT NULL DEFAULT 0,
  platinum_percentage numeric NOT NULL DEFAULT 0,
  cash_percentage numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  UNIQUE(account_id)
);

-- Enable RLS
ALTER TABLE public.portfolio_allocations ENABLE ROW LEVEL SECURITY;

-- Users can view their own portfolio allocations
CREATE POLICY "Users can view their own portfolio allocations"
ON public.portfolio_allocations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.investment_accounts
    WHERE investment_accounts.id = portfolio_allocations.account_id
    AND investment_accounts.user_id = auth.uid()
  )
);

-- Admins can view all portfolio allocations
CREATE POLICY "Admins can view all portfolio allocations"
ON public.portfolio_allocations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert portfolio allocations
CREATE POLICY "Admins can insert portfolio allocations"
ON public.portfolio_allocations
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update portfolio allocations
CREATE POLICY "Admins can update portfolio allocations"
ON public.portfolio_allocations
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete portfolio allocations
CREATE POLICY "Admins can delete portfolio allocations"
ON public.portfolio_allocations
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_portfolio_allocations_updated_at
BEFORE UPDATE ON public.portfolio_allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();