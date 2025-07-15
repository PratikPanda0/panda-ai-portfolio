
-- Temporarily allow inserts to user_roles without authentication for admin panel
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Allow admin panel to manage roles" 
  ON public.user_roles 
  FOR ALL 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
