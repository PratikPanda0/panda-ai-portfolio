
-- Add super_admin to the app_role enum
ALTER TYPE public.app_role ADD VALUE 'super_admin';

-- Assign super_admin role to pratic.panda@gmail.com
-- First, find the user ID for pratic.panda@gmail.com
DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Get the user ID for pratic.panda@gmail.com
    SELECT id INTO user_uuid 
    FROM public.profiles 
    WHERE email = 'pratic.panda@gmail.com' 
    LIMIT 1;
    
    -- If user exists, assign super_admin role
    IF user_uuid IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role, assigned_by)
        VALUES (user_uuid, 'super_admin', user_uuid)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;
