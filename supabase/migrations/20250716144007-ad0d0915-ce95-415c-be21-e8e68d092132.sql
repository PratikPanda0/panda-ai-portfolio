
-- Create a dedicated roles table with its own primary key
CREATE TABLE public.roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the standard roles
INSERT INTO public.roles (name, description) VALUES
  ('user', 'Regular user with basic permissions'),
  ('moderator', 'Moderator with content management permissions'),
  ('admin', 'Administrator with user management permissions'),
  ('super_admin', 'Super administrator with full system access');

-- Create a new user_roles table that references the roles table
CREATE TABLE public.user_roles_new (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role_id)
);

-- Copy existing data from old user_roles table to new structure
INSERT INTO public.user_roles_new (user_id, role_id, assigned_at, assigned_by)
SELECT 
  ur.user_id,
  r.id as role_id,
  ur.assigned_at,
  ur.assigned_by
FROM public.user_roles ur
JOIN public.roles r ON r.name = ur.role::text;

-- Drop the old user_roles table
DROP TABLE public.user_roles;

-- Rename the new table to user_roles
ALTER TABLE public.user_roles_new RENAME TO user_roles;

-- Enable RLS on both tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for roles table
CREATE POLICY "Everyone can view roles" 
  ON public.roles 
  FOR SELECT 
  USING (true);

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view all user roles" 
  ON public.user_roles 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Allow admin panel to manage user roles" 
  ON public.user_roles 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update the has_role function to work with the new structure
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND r.name = _role_name
  )
$$;

-- Now assign super_admin role to pratic.panda@gmail.com
DO $$
DECLARE
    target_user_id uuid;
    super_admin_role_id uuid;
BEGIN
    -- Find the user ID for pratic.panda@gmail.com
    SELECT id INTO target_user_id 
    FROM public.profiles 
    WHERE email = 'pratic.panda@gmail.com' 
    LIMIT 1;
    
    -- Get the super_admin role ID
    SELECT id INTO super_admin_role_id
    FROM public.roles
    WHERE name = 'super_admin'
    LIMIT 1;
    
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User pratic.panda@gmail.com not found in profiles table';
        RETURN;
    END IF;
    
    IF super_admin_role_id IS NULL THEN
        RAISE NOTICE 'super_admin role not found in roles table';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user ID: % and super_admin role ID: %', target_user_id, super_admin_role_id;
    
    -- Delete ALL existing roles for this user
    DELETE FROM public.user_roles 
    WHERE user_id = target_user_id;
    
    RAISE NOTICE 'Deleted all existing roles for user';
    
    -- Insert the super_admin role
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    VALUES (target_user_id, super_admin_role_id, target_user_id);
    
    RAISE NOTICE 'Successfully assigned super_admin role to user: %', target_user_id;
    
    -- Verify the assignment
    IF EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = target_user_id AND r.name = 'super_admin'
    ) THEN
        RAISE NOTICE 'Verification successful: super_admin role is now assigned';
    ELSE
        RAISE NOTICE 'Verification failed: super_admin role was not assigned';
    END IF;
END $$;

-- Drop the old enum type since we're no longer using it
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Final verification query
SELECT 
    p.email,
    p.first_name,
    p.last_name,
    r.name as role_name,
    ur.assigned_at
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
JOIN public.roles r ON r.id = ur.role_id
WHERE p.email = 'pratic.panda@gmail.com'
ORDER BY ur.assigned_at DESC;
