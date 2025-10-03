-- Add RLS policies for admins to create and delete withdrawal requests

CREATE POLICY "Admins can create withdrawal requests"
ON public.withdrawal_requests
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete withdrawal requests"
ON public.withdrawal_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));