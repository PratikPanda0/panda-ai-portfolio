
-- Add RLS policies for admin_users table to allow admin user creation
-- Policy to allow inserting admin users (needed for initialization)
CREATE POLICY "Allow admin user creation" 
  ON public.admin_users 
  FOR INSERT 
  TO PUBLIC
  WITH CHECK (true);

-- Policy to allow selecting admin users (needed for login verification)
CREATE POLICY "Allow admin user login verification" 
  ON public.admin_users 
  FOR SELECT 
  TO PUBLIC
  USING (true);
