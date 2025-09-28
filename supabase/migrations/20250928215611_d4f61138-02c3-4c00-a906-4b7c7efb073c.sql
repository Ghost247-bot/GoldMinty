-- Fix security warning by setting proper search_path on function
CREATE OR REPLACE FUNCTION generate_account_number()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'INV-' || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || '-' || 
         LPAD(EXTRACT(DOY FROM NOW())::TEXT, 3, '0') || '-' || 
         LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$;