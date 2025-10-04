-- Fix RLS policies for orders table to allow admin operations

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

-- Create comprehensive RLS policies for orders table

-- Policy for viewing orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy for creating orders
CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can create orders for any user" 
ON public.orders 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy for updating orders
CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy for deleting orders
CREATE POLICY "Admins can delete all orders" 
ON public.orders 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));
