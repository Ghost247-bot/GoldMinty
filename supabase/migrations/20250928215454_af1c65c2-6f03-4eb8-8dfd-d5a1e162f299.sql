-- Create investment accounts table
CREATE TABLE public.investment_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  account_number TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL DEFAULT 'standard',
  balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  gold_holdings DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  silver_holdings DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  platinum_holdings DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.investment_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for investment accounts
CREATE POLICY "Users can view their own investment accounts" 
ON public.investment_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all investment accounts" 
ON public.investment_accounts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create investment accounts" 
ON public.investment_accounts 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update investment accounts" 
ON public.investment_accounts 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete investment accounts" 
ON public.investment_accounts 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_investment_accounts_updated_at
BEFORE UPDATE ON public.investment_accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Generate account numbers function
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'INV-' || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || '-' || 
         LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || 
         LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;